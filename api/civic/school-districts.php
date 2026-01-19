<?php
/**
 * CIVIQ School Districts API
 * GET /api/civic/school-districts
 *
 * Returns school districts for a county or near a zip code
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
    $where[] = 'sd.county_id = ?';
    $params[] = $countyId;
}

$whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$stmt = $db->prepare("
    SELECT
        sd.id,
        sd.name,
        sd.superintendent,
        sd.website,
        sd.enrollment,
        sd.municipalities,
        c.name as county_name,
        c.id as county_id
    FROM school_districts sd
    JOIN counties c ON c.id = sd.county_id
    $whereClause
    ORDER BY sd.enrollment DESC, sd.name
");
$stmt->execute($params);
$districts = $stmt->fetchAll();

// Parse municipalities JSON
foreach ($districts as &$d) {
    $d['municipalities'] = $d['municipalities'] ? json_decode($d['municipalities'], true) : [];
    $d['enrollment'] = $d['enrollment'] ? (int)$d['enrollment'] : null;
}

// Group by county
$byCounty = [];
foreach ($districts as $d) {
    $county = $d['county_name'];
    if (!isset($byCounty[$county])) {
        $byCounty[$county] = [];
    }
    $byCounty[$county][] = $d;
}

// Calculate total enrollment
$totalEnrollment = array_sum(array_column($districts, 'enrollment'));

jsonResponse([
    'success' => true,
    'districts' => $districts,
    'by_county' => $byCounty,
    'count' => count($districts),
    'total_enrollment' => $totalEnrollment
]);
