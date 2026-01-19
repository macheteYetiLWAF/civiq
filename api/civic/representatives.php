<?php
/**
 * CIVIQ Representatives API
 * GET /api/civic/representatives?address=ZIP or full address
 *
 * NOTE: Google Representatives API was deprecated April 2025
 * This endpoint now falls back to civiq_voices table for PA officials
 * Use /api/civic/divisions for OCD division IDs
 *
 * Returns: { success, officials[], deprecated: true }
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$address = $_GET['address'] ?? null;
$user = getCurrentUser();

// Use user's address if not specified
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
    AND data_type = 'representatives'
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

// Google Representatives API deprecated April 2025
// Fall back to civiq_voices table for PA officials
$zip = preg_match('/^\d{5}/', $address, $m) ? $m[0] : null;

// Query voices for officials in this area
$stmt = $db->prepare("
    SELECT v.*, c.name as county_name
    FROM voices v
    LEFT JOIN counties c ON v.county_id = c.id
    WHERE v.voice_type = 'official'
    AND v.is_active = 1
    ORDER BY
        CASE v.tier
            WHEN 'premier' THEN 1
            WHEN 'influential' THEN 2
            WHEN 'established' THEN 3
            ELSE 4
        END,
        v.display_name ASC
");
$stmt->execute();
$voices = $stmt->fetchAll();

$officials = [];
foreach ($voices as $voice) {
    // Determine level from role
    $level = 'state';
    $role = strtolower($voice['role'] ?? '');
    if (strpos($role, 'mayor') !== false || strpos($role, 'council') !== false || strpos($role, 'commissioner') !== false) {
        $level = 'local';
    } elseif (strpos($role, 'u.s.') !== false || strpos($role, 'senator') !== false && strpos($role, 'state') === false) {
        $level = 'federal';
    }

    $officials[] = [
        'id' => $voice['id'],
        'name' => $voice['display_name'],
        'title' => $voice['role'] ?? 'Official',
        'party' => $voice['party_affiliation'],
        'level' => $level,
        'county' => $voice['county_name'],
        'district' => $voice['district'],
        'photoUrl' => $voice['avatar_url'],
        'urls' => $voice['website_url'] ? [$voice['website_url']] : [],
        'twitter' => $voice['twitter_handle'],
        'leanScore' => (float)$voice['lean_score']
    ];
}

// Sort: local first (per CIVIQ design), then state, then federal
$levelOrder = ['local' => 0, 'state' => 1, 'federal' => 2];
usort($officials, function($a, $b) use ($levelOrder) {
    return ($levelOrder[$a['level']] ?? 3) - ($levelOrder[$b['level']] ?? 3);
});

$result = [
    'success' => true,
    'address' => $address,
    'officials' => $officials,
    'source' => 'voices',
    'deprecated' => true,
    'deprecationNote' => 'Google Representatives API deprecated April 2025. Using local data.',
    'cached' => false
];

jsonResponse($result);
