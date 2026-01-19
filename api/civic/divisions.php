<?php
/**
 * CIVIQ Divisions API
 * GET /api/civic/divisions?address=ZIP or full address
 *
 * Uses Google Civic Information API divisionsByAddress endpoint
 * (Replacement for deprecated Representatives API)
 * Returns: { success, divisions[], normalizedAddress }
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$address = $_GET['address'] ?? null;
$user = getCurrentUser();

if (!$address && $user) {
    $address = $user['zip_code'];
}

if (!$address) {
    jsonError('Address or ZIP code required');
}

$db = getDB();

// Check cache first (24 hour cache)
$stmt = $db->prepare("
    SELECT response_data, fetched_at
    FROM civic_cache
    WHERE (zip_code = ? OR address = ?)
    AND data_type = 'divisions'
    AND expires_at > NOW()
    ORDER BY fetched_at DESC
    LIMIT 1
");
$stmt->execute([$address, $address]);
$cached = $stmt->fetch();

if ($cached) {
    $data = json_decode($cached['response_data'], true);
    $data['cached'] = true;
    $data['cached_at'] = $cached['fetched_at'];
    jsonResponse($data);
}

// Fetch from Google Civic Information API - divisionsByAddress
$apiUrl = "https://www.googleapis.com/civicinfo/v2/divisions?" . http_build_query([
    'key' => GOOGLE_API_KEY,
    'address' => $address
]);

$context = stream_context_create(['http' => ['ignore_errors' => true]]);
$response = @file_get_contents($apiUrl, false, $context);

if (!$response) {
    jsonError('Failed to connect to Civic API', 500);
}

$responseData = json_decode($response, true);

if (isset($responseData['error'])) {
    $errMsg = $responseData['error']['message'] ?? 'API error';
    jsonError($errMsg, $responseData['error']['code'] ?? 400);
}

// Process divisions into structured format
$divisions = [];
foreach ($responseData['divisions'] ?? [] as $ocdId => $divisionData) {
    $level = 'local';

    // Determine level from OCD ID
    if (preg_match('/^ocd-division\/country:us$/', $ocdId)) {
        $level = 'federal';
    } elseif (preg_match('/^ocd-division\/country:us\/state:[a-z]{2}$/', $ocdId)) {
        $level = 'state';
    } elseif (strpos($ocdId, '/cd:') !== false || strpos($ocdId, '/sldl:') !== false || strpos($ocdId, '/sldu:') !== false) {
        $level = strpos($ocdId, '/cd:') !== false ? 'federal' : 'state';
    }

    $divisions[] = [
        'ocdId' => $ocdId,
        'name' => $divisionData['name'] ?? 'Unknown',
        'alsoKnownAs' => $divisionData['alsoKnownAs'] ?? [],
        'level' => $level
    ];
}

// Sort: federal first, then state, then local
$levelOrder = ['federal' => 0, 'state' => 1, 'local' => 2];
usort($divisions, function($a, $b) use ($levelOrder) {
    return ($levelOrder[$a['level']] ?? 3) - ($levelOrder[$b['level']] ?? 3);
});

$result = [
    'success' => true,
    'normalizedAddress' => $responseData['normalizedInput'] ?? null,
    'divisions' => $divisions,
    'cached' => false
];

// Cache the result
$zip = preg_match('/^\d{5}/', $address, $m) ? $m[0] : null;
$expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

$stmt = $db->prepare("
    INSERT INTO civic_cache (zip_code, address, data_type, response_data, expires_at)
    VALUES (?, ?, 'divisions', ?, ?)
");
$stmt->execute([$zip, $address, json_encode($result), $expiresAt]);

jsonResponse($result);
