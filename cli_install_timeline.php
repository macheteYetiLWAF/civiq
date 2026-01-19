#!/usr/bin/env php
<?php
/**
 * CLI installer for CIVIQ Timeline Events
 * Run: php cli_install_timeline.php
 */

$host = 'localhost';
$dbname = 'lom1ubvhoxxi_sud_claude';
$username = 'lom1ubvhoxxi_claude';
$password = 'SLyb24sfbl5wJ';

echo "CIVIQ Timeline Events Installation\n";
echo "===================================\n\n";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected to database.\n";

    // Check if table exists
    $tableExists = $pdo->query("SHOW TABLES LIKE 'civiq_timeline_events'")->rowCount() > 0;

    if ($tableExists) {
        $count = $pdo->query("SELECT COUNT(*) FROM civiq_timeline_events")->fetchColumn();
        echo "Table already exists with $count records.\n";
        echo "Drop and recreate? (y/N): ";
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        if (trim(strtolower($line)) !== 'y') {
            echo "Aborted.\n";
            exit(0);
        }
        $pdo->exec("DROP TABLE civiq_timeline_events");
        echo "Table dropped.\n";
    }

    // Read SQL file
    $sqlFile = __DIR__ . '/civiq_timeline_events.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file not found: $sqlFile");
    }

    $sql = file_get_contents($sqlFile);
    echo "SQL file loaded (" . strlen($sql) . " bytes).\n";

    // Remove comments
    $sql = preg_replace('/--.*$/m', '', $sql);

    // Parse statements
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

    echo "Parsed " . count($statements) . " SQL statements.\n\n";

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
                echo "[OK] Created table civiq_timeline_events\n";
            } elseif (stripos($statement, 'INSERT INTO') !== false && $executed % 5 === 0) {
                echo "[OK] Inserted records batch...\n";
            }
        } catch (PDOException $e) {
            $errors++;
            echo "[ERROR] " . substr($statement, 0, 60) . "...\n";
            echo "        " . $e->getMessage() . "\n";
        }
    }

    echo "\n";
    echo "Statements executed: $executed\n";
    echo "Errors: $errors\n\n";

    // Verify
    echo "Verifying installation...\n\n";

    $categories = $pdo->query("
        SELECT category, COUNT(*) as count
        FROM civiq_timeline_events
        GROUP BY category
        ORDER BY count DESC
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo "Records by category:\n";
    $total = 0;
    foreach ($categories as $cat) {
        echo "  - {$cat['category']}: {$cat['count']}\n";
        $total += $cat['count'];
    }
    echo "  TOTAL: $total\n\n";

    // Specific counts
    $presidents = $pdo->query("SELECT COUNT(*) FROM civiq_timeline_events WHERE category = 'president'")->fetchColumn();
    $legislation = $pdo->query("SELECT COUNT(*) FROM civiq_timeline_events WHERE category = 'legislation'")->fetchColumn();
    $economic = $pdo->query("SELECT COUNT(*) FROM civiq_timeline_events WHERE category = 'economic'")->fetchColumn();
    $colonial = $pdo->query("SELECT COUNT(*) FROM civiq_timeline_events WHERE start_year < 1776")->fetchColumn();

    echo "Summary:\n";
    echo "  Presidents: $presidents (expected: 47)\n";
    echo "  Legislation: $legislation (expected: 30+)\n";
    echo "  Economic events: $economic (expected: 15+)\n";
    echo "  Pre-1776 events: $colonial (expected: 10+)\n\n";

    echo "===================================\n";
    echo "Installation complete!\n";

} catch (Exception $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
