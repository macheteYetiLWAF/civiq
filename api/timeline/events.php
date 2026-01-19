<?php
/**
 * CIVIQ Timeline Events API
 * GET /api/timeline/events.php - Get timeline events with optional filters
 * GET /api/timeline/events.php?action=install - Install/populate table
 * GET /api/timeline/events.php?action=stats - Get table statistics
 */

require_once __DIR__ . '/../config.php';

$db = getDB();
$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'install':
        installTable($db);
        break;
    case 'stats':
        getStats($db);
        break;
    case 'list':
    default:
        listEvents($db);
        break;
}

/**
 * Install the timeline events table from SQL file
 */
function installTable($db) {
    $sqlFile = dirname(__DIR__, 2) . '/civiq_timeline_events.sql';

    if (!file_exists($sqlFile)) {
        jsonError('SQL file not found', 500);
    }

    $sql = file_get_contents($sqlFile);

    // Remove comments
    $sql = preg_replace('/--.*$/m', '', $sql);

    // Parse statements carefully
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

    $executed = 0;
    $errors = [];

    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (empty($statement)) continue;

        try {
            $db->exec($statement);
            $executed++;
        } catch (PDOException $e) {
            $errors[] = [
                'statement' => substr($statement, 0, 100) . '...',
                'error' => $e->getMessage()
            ];
        }
    }

    // Get stats after install
    $stats = getStatsData($db);

    jsonResponse([
        'success' => count($errors) === 0,
        'statements_executed' => $executed,
        'errors' => $errors,
        'stats' => $stats
    ]);
}

/**
 * Get statistics about the timeline events table
 */
function getStatsData($db) {
    try {
        // Check if table exists
        $tableExists = $db->query("SHOW TABLES LIKE 'timeline_events'")->rowCount() > 0;

        if (!$tableExists) {
            return ['table_exists' => false];
        }

        // Get counts by category
        $categories = $db->query("
            SELECT category, COUNT(*) as count
            FROM timeline_events
            GROUP BY category
            ORDER BY count DESC
        ")->fetchAll();

        // Get total
        $total = $db->query("SELECT COUNT(*) FROM timeline_events")->fetchColumn();

        // Get pre-1776 events
        $colonial = $db->query("
            SELECT COUNT(*) FROM timeline_events WHERE start_year < 1776
        ")->fetchColumn();

        // Get presidents count
        $presidents = $db->query("
            SELECT COUNT(*) FROM timeline_events WHERE category = 'president'
        ")->fetchColumn();

        // Get year range
        $yearRange = $db->query("
            SELECT MIN(start_year) as earliest, MAX(start_year) as latest
            FROM timeline_events
        ")->fetch();

        return [
            'table_exists' => true,
            'total_records' => (int)$total,
            'categories' => $categories,
            'presidents_count' => (int)$presidents,
            'pre_1776_events' => (int)$colonial,
            'year_range' => [
                'earliest' => (int)$yearRange['earliest'],
                'latest' => (int)$yearRange['latest']
            ]
        ];
    } catch (PDOException $e) {
        return [
            'table_exists' => false,
            'error' => $e->getMessage()
        ];
    }
}

function getStats($db) {
    jsonResponse([
        'success' => true,
        'stats' => getStatsData($db)
    ]);
}

/**
 * List timeline events with optional filters
 */
function listEvents($db) {
    // Check if table exists
    $tableExists = $db->query("SHOW TABLES LIKE 'timeline_events'")->rowCount() > 0;

    if (!$tableExists) {
        jsonError('Timeline events table not found. Use ?action=install to create it.', 404);
    }

    // Parse filters
    $category = $_GET['category'] ?? null;
    $startYear = $_GET['start_year'] ?? null;
    $endYear = $_GET['end_year'] ?? null;
    $minImportance = $_GET['min_importance'] ?? null;
    $governmentLevel = $_GET['government_level'] ?? null;
    $search = $_GET['search'] ?? null;
    $limit = min((int)($_GET['limit'] ?? 100), 500);
    $offset = (int)($_GET['offset'] ?? 0);

    $where = [];
    $params = [];

    if ($category) {
        $where[] = "category = ?";
        $params[] = $category;
    }

    if ($startYear) {
        $where[] = "start_year >= ?";
        $params[] = (int)$startYear;
    }

    if ($endYear) {
        $where[] = "start_year <= ?";
        $params[] = (int)$endYear;
    }

    if ($minImportance) {
        $where[] = "importance >= ?";
        $params[] = (int)$minImportance;
    }

    if ($governmentLevel) {
        $where[] = "government_level = ?";
        $params[] = $governmentLevel;
    }

    if ($search) {
        $where[] = "(title LIKE ? OR description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    $whereClause = count($where) > 0 ? "WHERE " . implode(" AND ", $where) : "";

    // Get total count
    $countSql = "SELECT COUNT(*) FROM timeline_events $whereClause";
    $stmt = $db->prepare($countSql);
    $stmt->execute($params);
    $total = (int)$stmt->fetchColumn();

    // Get events
    $sql = "
        SELECT id, category, title, description, start_year, end_year, government_level, importance, created_at
        FROM timeline_events
        $whereClause
        ORDER BY start_year ASC, importance DESC
        LIMIT ? OFFSET ?
    ";
    $params[] = $limit;
    $params[] = $offset;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $events = $stmt->fetchAll();

    jsonResponse([
        'success' => true,
        'total' => $total,
        'limit' => $limit,
        'offset' => $offset,
        'events' => $events
    ]);
}
