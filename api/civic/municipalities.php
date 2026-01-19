<?php
/**
 * CIVIQ Municipalities API
 * GET /api/civic/municipalities
 *
 * Returns municipalities for a county or near a zip code
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();

$countyId = $_GET['county_id'] ?? null;
$zip = $_GET['zip'] ?? null;

$where = [];
$params = [];

if ($countyId) {
    $where[] = 'm.county_id = ?';
    $params[] = $countyId;
}

$whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$stmt = $db->prepare("
    SELECT
        m.id,
        m.name,
        m.muni_type,
        m.population,
        m.zip_codes,
        c.name as county_name,
        c.id as county_id
    FROM municipalities m
    JOIN counties c ON c.id = m.county_id
    $whereClause
    ORDER BY m.population DESC, m.name
");
$stmt->execute($params);
$municipalities = $stmt->fetchAll();

// Parse zip_codes JSON
foreach ($municipalities as &$m) {
    $m['zip_codes'] = $m['zip_codes'] ? json_decode($m['zip_codes'], true) : [];
    $m['population'] = $m['population'] ? (int)$m['population'] : null;
}

// Group by county
$byCounty = [];
foreach ($municipalities as $m) {
    $county = $m['county_name'];
    if (!isset($byCounty[$county])) {
        $byCounty[$county] = [];
    }
    $byCounty[$county][] = $m;
}

jsonResponse([
    'success' => true,
    'municipalities' => $municipalities,
    'by_county' => $byCounty,
    'count' => count($municipalities)
]);
