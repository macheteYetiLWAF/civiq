<?php
/**
 * CIVIQ Timeline Events Table Installer
 * Run this script once to create and populate the civiq_timeline_events table
 *
 * Usage:
 *   Web: https://your-domain/civiq/install_timeline_events.php
 *   CLI: php install_timeline_events.php
 *
 * Add ?force=1 to drop and recreate existing table
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
    echo "CIVIQ Timeline Events Installation\n";
    echo "===================================\n\n";

    // Check if table exists
    $tableExists = $pdo->query("SHOW TABLES LIKE 'civiq_timeline_events'")->rowCount() > 0;

    if ($tableExists) {
        $existingCount = $pdo->query("SELECT COUNT(*) FROM civiq_timeline_events")->fetchColumn();
        echo "Table already exists with $existingCount records.\n";

        if ($force) {
            echo "Force flag set - dropping existing table...\n";
            $pdo->exec("DROP TABLE civiq_timeline_events");
            echo "Table dropped.\n\n";
        } else {
            echo "\nTo reinstall, add ?force=1 to the URL or run with --force flag.\n";
            echo "Or use the API: /api/timeline/events.php?action=stats\n";
            echo "</pre>";
            exit(0);
        }
    }

    // Read and execute the SQL file
    $sqlFile = __DIR__ . '/civiq_timeline_events.sql';

    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file not found: $sqlFile");
    }

    $sql = file_get_contents($sqlFile);
    echo "SQL file loaded (" . strlen($sql) . " bytes)\n\n";

    // Split SQL into individual statements
    // First, remove comments
    $sql = preg_replace('/--.*$/m', '', $sql);

    // Split by semicolons but be careful with values containing semicolons
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
            // Check for escaped quotes (two in a row)
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

    // Add last statement if any
    $stmt = trim($currentStatement);
    if (!empty($stmt)) {
        $statements[] = $stmt;
    }

    echo "Parsed " . count($statements) . " SQL statements\n\n";

    // Execute each statement
    $executed = 0;
    $errors = 0;

    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (empty($statement)) continue;

        try {
            $pdo->exec($statement);
            $executed++;

            // Show progress for major operations
            if (stripos($statement, 'CREATE TABLE') !== false) {
                echo "[OK] Created table: civiq_timeline_events\n";
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
    echo "Verifying data...\n";
    echo "===================================\n\n";

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

    // Count presidents
    $presidents = $pdo->query("
        SELECT COUNT(*) as count
        FROM civiq_timeline_events
        WHERE category = 'president'
    ")->fetchColumn();
    echo "Presidents: $presidents (expected: 47)\n";

    // Count legislation
    $legislation = $pdo->query("
        SELECT COUNT(*) as count
        FROM civiq_timeline_events
        WHERE category = 'legislation'
    ")->fetchColumn();
    echo "Legislation: $legislation (expected: 30+)\n";

    // Count economic events
    $economic = $pdo->query("
        SELECT COUNT(*) as count
        FROM civiq_timeline_events
        WHERE category = 'economic'
    ")->fetchColumn();
    echo "Economic events: $economic (expected: 15+)\n";

    // Count pre-1776 events
    $colonial = $pdo->query("
        SELECT COUNT(*) as count
        FROM civiq_timeline_events
        WHERE start_year < 1776
    ")->fetchColumn();
    echo "Pre-1776 colonial events: $colonial (expected: 10+)\n\n";

    // Year range
    $range = $pdo->query("
        SELECT MIN(start_year) as earliest, MAX(start_year) as latest
        FROM civiq_timeline_events
    ")->fetch(PDO::FETCH_ASSOC);
    echo "Year range: {$range['earliest']} - {$range['latest']}\n\n";

    // Sample some data
    echo "Sample records (earliest 5):\n";
    $samples = $pdo->query("
        SELECT id, category, title, start_year, importance
        FROM civiq_timeline_events
        ORDER BY start_year ASC
        LIMIT 5
    ")->fetchAll(PDO::FETCH_ASSOC);

    foreach ($samples as $sample) {
        echo "  [{$sample['id']}] {$sample['start_year']} - {$sample['title']} ({$sample['category']}, importance: {$sample['importance']})\n";
    }

    echo "\n===================================\n";
    echo "Installation complete!\n\n";
    echo "API endpoint: /api/timeline/events.php\n";
    echo "  ?action=stats - Get statistics\n";
    echo "  ?action=list - List events (default)\n";
    echo "  ?category=president - Filter by category\n";
    echo "  ?start_year=1900&end_year=2000 - Filter by year range\n";
    echo "  ?min_importance=8 - Filter by importance\n";
    echo "</pre>";

} catch (Exception $e) {
    echo "<pre>\n";
    echo "FATAL ERROR: " . $e->getMessage() . "\n";
    echo "</pre>";
}
