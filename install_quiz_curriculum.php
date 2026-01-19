<?php
/**
 * CIVIQ Quiz Curriculum Installer
 * Creates and populates the quiz curriculum tables
 */

$host = 'localhost';
$dbname = 'lom1ubvhoxxi_sud_claude';
$username = 'lom1ubvhoxxi_claude';
$password = 'SLyb24sfbl5wJ';

$force = isset($_GET['force']) || (isset($argv[1]) && $argv[1] === '--force');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "<pre>\n";
    echo "CIVIQ Quiz Curriculum Installation\n";
    echo "===================================\n\n";

    // Check if table exists
    $tableExists = $pdo->query("SHOW TABLES LIKE 'civiq_quiz_topics'")->rowCount() > 0;

    if ($tableExists) {
        $existingCount = $pdo->query("SELECT COUNT(*) FROM civiq_quiz_topics")->fetchColumn();
        echo "Table already exists with $existingCount topics.\n";

        if ($force) {
            echo "Force flag set - dropping existing tables...\n";
            $pdo->exec("DROP TABLE IF EXISTS civiq_quiz_questions");
            $pdo->exec("DROP TABLE IF EXISTS civiq_quiz_topics");
            echo "Tables dropped.\n\n";
        } else {
            echo "\nTo reinstall, add ?force=1 to the URL.\n";
            echo "</pre>";
            exit(0);
        }
    }

    // Read and execute the SQL file
    $sqlFile = __DIR__ . '/civiq_quiz_curriculum.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file not found: $sqlFile");
    }

    $sql = file_get_contents($sqlFile);
    echo "SQL file loaded (" . strlen($sql) . " bytes)\n\n";

    // Remove comments
    $sql = preg_replace('/--.*$/m', '', $sql);

    // Parse statements (handle strings properly)
    $statements = [];
    $currentStatement = '';
    $inString = false;
    $stringChar = '';

    for ($i = 0; $i < strlen($sql); $i++) {
        $char = $sql[$i];

        if (!$inString && ($char === "'" || $char === '"')) {
            $inString = true;
            $stringChar = $char;
        } elseif ($inString && $char === $stringChar && ($i === 0 || $sql[$i-1] !== '\\')) {
            if ($i + 1 < strlen($sql) && $sql[$i+1] === $stringChar) {
                $currentStatement .= $char;
                $i++;
                $currentStatement .= $sql[$i];
                continue;
            }
            $inString = false;
        }

        if (!$inString && $char === ';') {
            $stmt = trim($currentStatement);
            if (!empty($stmt)) {
                $statements[] = $stmt;
            }
            $currentStatement = '';
        } else {
            $currentStatement .= $char;
        }
    }

    $stmt = trim($currentStatement);
    if (!empty($stmt)) {
        $statements[] = $stmt;
    }

    echo "Parsed " . count($statements) . " SQL statements\n\n";

    // Execute statements
    $executed = 0;
    $errors = 0;

    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (empty($statement)) continue;

        try {
            $pdo->exec($statement);
            $executed++;

            if (stripos($statement, 'CREATE TABLE') !== false) {
                preg_match('/CREATE TABLE[^`]*`([^`]+)`/', $statement, $matches);
                $tableName = $matches[1] ?? 'unknown';
                echo "[OK] Created table: $tableName\n";
            }
        } catch (PDOException $e) {
            $errors++;
            echo "[ERROR] " . substr($statement, 0, 80) . "...\n";
            echo "        " . $e->getMessage() . "\n";
        }
    }

    echo "\n";
    echo "Statements executed: $executed\n";
    echo "Errors: $errors\n\n";

    // Verify data
    echo "Verifying curriculum structure...\n";
    echo "===================================\n\n";

    // Count by level
    $levels = $pdo->query("
        SELECT level, COUNT(*) as count
        FROM civiq_quiz_topics
        GROUP BY level
        ORDER BY FIELD(level, 'root', 'category', 'subcategory', 'topic')
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo "Topics by level:\n";
    $totalTopics = 0;
    foreach ($levels as $level) {
        echo "  - {$level['level']}: {$level['count']}\n";
        $totalTopics += $level['count'];
    }
    echo "  TOTAL TOPICS: $totalTopics\n\n";

    // Count by government level
    $govLevels = $pdo->query("
        SELECT government_level, COUNT(*) as count
        FROM civiq_quiz_topics
        GROUP BY government_level
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo "Topics by government level:\n";
    foreach ($govLevels as $gov) {
        echo "  - {$gov['government_level']}: {$gov['count']}\n";
    }
    echo "\n";

    // Count questions
    $questionCount = $pdo->query("SELECT COUNT(*) FROM civiq_quiz_questions")->fetchColumn();
    echo "Total questions: $questionCount\n\n";

    // Show hierarchy sample
    echo "Federal Government Hierarchy:\n";
    $federal = $pdo->query("
        SELECT t1.title as root, t2.title as category, t3.title as subcategory
        FROM civiq_quiz_topics t1
        LEFT JOIN civiq_quiz_topics t2 ON t2.parent_id = t1.id
        LEFT JOIN civiq_quiz_topics t3 ON t3.parent_id = t2.id
        WHERE t1.code = 'FEDERAL'
        ORDER BY t2.sort_order, t3.sort_order
    ")->fetchAll(PDO::FETCH_ASSOC);

    $currentCategory = '';
    foreach ($federal as $row) {
        if ($row['category'] && $row['category'] !== $currentCategory) {
            echo "  {$row['category']}\n";
            $currentCategory = $row['category'];
        }
        if ($row['subcategory']) {
            echo "    - {$row['subcategory']}\n";
        }
    }

    echo "\n===================================\n";
    echo "Installation complete!\n\n";
    echo "API endpoints to create:\n";
    echo "  /api/quiz/topics.php - List curriculum\n";
    echo "  /api/quiz/questions.php - Get questions by topic\n";
    echo "  /api/quiz/progress.php - Track user progress\n";
    echo "</pre>";

} catch (Exception $e) {
    echo "<pre>\n";
    echo "FATAL ERROR: " . $e->getMessage() . "\n";
    echo "</pre>";
}
