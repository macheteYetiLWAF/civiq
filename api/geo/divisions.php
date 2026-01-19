<?php
/**
 * CIVIQ Divisions API
 * GET /api/geo/divisions?address=FULL_ADDRESS
 *
 * Uses Google Civic Information API to get legislative districts for an address.
 * Returns: { success, divisions: { congressional, stateSenate, stateHouse, county } }
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$address = $_GET['address'] ?? null;

if (!$address) {
    jsonError('Address required');
}

// Google Civic Information API - representativeInfoByAddress includes divisions
$url = "https://www.googleapis.com/civicinfo/v2/representatives?" . http_build_query([
    'key' => GOOGLE_API_KEY,
    'address' => $address,
    'levels' => 'country,administrativeArea1', // Federal + State
    'roles' => 'legislatorUpperBody,legislatorLowerBody' // Senators + Reps
]);

$context = stream_context_create([
    'http' => [
        'ignore_errors' => true,
        'timeout' => 10
    ]
]);

$response = @file_get_contents($url, false, $context);

if (!$response) {
    jsonError('Failed to fetch division data', 500);
}

$data = json_decode($response, true);

// Check for API errors
if (isset($data['error'])) {
    jsonError($data['error']['message'] ?? 'Civic API error', $data['error']['code'] ?? 400);
}

// Parse divisions from OCD IDs
$divisions = [
    'congressional' => null,
    'stateSenate' => null,
    'stateHouse' => null,
    'county' => null,
    'municipality' => null,
    'state' => null
];

$ocdIds = [];

foreach ($data['divisions'] ?? [] as $ocdId => $divisionData) {
    $name = $divisionData['name'] ?? '';
    $ocdIds[] = [
        'ocdId' => $ocdId,
        'name' => $name
    ];

    // Parse OCD ID format: ocd-division/country:us/state:pa/cd:10
    // Congressional District
    if (preg_match('/\/cd:(\d+)$/', $ocdId, $matches)) {
        $divisions['congressional'] = [
            'district' => (int)$matches[1],
            'name' => $name,
            'ocdId' => $ocdId
        ];
    }
    // State Senate District
    elseif (preg_match('/\/sldu:(\d+)$/', $ocdId, $matches)) {
        $divisions['stateSenate'] = [
            'district' => (int)$matches[1],
            'name' => $name,
            'ocdId' => $ocdId
        ];
    }
    // State House District
    elseif (preg_match('/\/sldl:(\d+)$/', $ocdId, $matches)) {
        $divisions['stateHouse'] = [
            'district' => (int)$matches[1],
            'name' => $name,
            'ocdId' => $ocdId
        ];
    }
    // County
    elseif (preg_match('/\/county:([^\/]+)$/', $ocdId, $matches)) {
        $countySlug = $matches[1];
        $divisions['county'] = [
            'slug' => $countySlug,
            'name' => $name,
            'ocdId' => $ocdId
        ];
    }
    // Municipality (place)
    elseif (preg_match('/\/place:([^\/]+)$/', $ocdId, $matches)) {
        $placeSlug = $matches[1];
        $divisions['municipality'] = [
            'slug' => $placeSlug,
            'name' => $name,
            'ocdId' => $ocdId
        ];
    }
    // State
    elseif (preg_match('/\/state:(\w+)$/', $ocdId, $matches)) {
        $stateCode = strtoupper($matches[1]);
        $divisions['state'] = [
            'code' => $stateCode,
            'name' => $name,
            'ocdId' => $ocdId
        ];
    }
}

// Also extract normalized address if available
$normalizedAddress = $data['normalizedInput'] ?? null;

jsonResponse([
    'success' => true,
    'divisions' => $divisions,
    'normalizedAddress' => $normalizedAddress,
    'allOcdIds' => $ocdIds
]);
