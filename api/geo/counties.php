<?php
/**
 * CIVIQ Counties API
 * GET /api/geo/counties
 *
 * Returns list of counties that have data in the system.
 * Used by admin county switcher to show available viewing contexts.
 *
 * Returns: {
 *   success: true,
 *   counties: [{ id, name, fips_code, officialsCount }]
 * }
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();

// Get counties with at least some data
// Join with voices to get count of officials per county
$stmt = $db->query("
    SELECT
        c.id,
        c.name,
        c.fips_code,
        COUNT(DISTINCT v.id) as officials_count
    FROM counties c
    LEFT JOIN voices v ON v.county_id = c.id AND v.is_elected_official = 1
    GROUP BY c.id, c.name, c.fips_code
    HAVING officials_count > 0 OR c.id IN (
        SELECT DISTINCT county_id FROM pa_legislative_districts
    )
    ORDER BY c.name ASC
");

$counties = $stmt->fetchAll();

// Format response
$formattedCounties = array_map(function($county) {
    return [
        'id' => (int)$county['id'],
        'name' => $county['name'],
        'fipsCode' => $county['fips_code'],
        'officialsCount' => (int)$county['officials_count']
    ];
}, $counties);

jsonResponse([
    'success' => true,
    'counties' => $formattedCounties,
    'count' => count($formattedCounties)
]);
