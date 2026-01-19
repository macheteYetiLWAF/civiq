<?php
/**
 * CIVIQ Bills Feed API
 * GET /api/bills/feed
 *
 * Returns: { success, bills[], total }
 * Optional params: ?level=federal|state|local
 *                  ?status=Introduced|Passed|Failed|Vetoed|Enacted
 *                  ?chamber=house|senate|both
 *                  ?limit=20&offset=0
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();

// Query params
$level = $_GET['level'] ?? null;
$status = $_GET['status'] ?? null;
$chamber = $_GET['chamber'] ?? null;
$limit = min((int)($_GET['limit'] ?? 20), 50);
$offset = (int)($_GET['offset'] ?? 0);

// Build query
$where = [];
$params = [];

if ($level && in_array($level, ['federal', 'state', 'local'])) {
    $where[] = "level = ?";
    $params[] = $level;
}

if ($status) {
    $where[] = "status = ?";
    $params[] = $status;
}

if ($chamber && in_array($chamber, ['house', 'senate', 'both'])) {
    $where[] = "chamber = ?";
    $params[] = $chamber;
}

$whereClause = count($where) > 0 ? 'WHERE ' . implode(' AND ', $where) : '';

// Get total count
$countSql = "SELECT COUNT(*) FROM bills $whereClause";
$stmt = $db->prepare($countSql);
$stmt->execute($params);
$total = (int)$stmt->fetchColumn();

// Get bills
$sql = "
    SELECT
        id,
        bill_number,
        title,
        summary,
        level,
        status,
        chamber,
        sponsors,
        last_action,
        last_action_date,
        source_url,
        external_id,
        created_at,
        updated_at
    FROM bills
    $whereClause
    ORDER BY last_action_date DESC, created_at DESC
    LIMIT ? OFFSET ?
";

$params[] = $limit;
$params[] = $offset;

$stmt = $db->prepare($sql);
$stmt->execute($params);
$bills = $stmt->fetchAll();

// Format response
$formattedBills = array_map(function($b) {
    return [
        'id' => (int)$b['id'],
        'billNumber' => $b['bill_number'],
        'title' => $b['title'],
        'summary' => $b['summary'],
        'level' => $b['level'],
        'status' => $b['status'],
        'chamber' => $b['chamber'],
        'sponsors' => json_decode($b['sponsors']) ?? [],
        'lastAction' => $b['last_action'],
        'lastActionDate' => $b['last_action_date'],
        'sourceUrl' => $b['source_url'],
        'externalId' => $b['external_id'],
        'createdAt' => $b['created_at'],
        'updatedAt' => $b['updated_at']
    ];
}, $bills);

jsonResponse([
    'success' => true,
    'bills' => $formattedBills,
    'total' => $total,
    'limit' => $limit,
    'offset' => $offset
]);
