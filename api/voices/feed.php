<?php
/**
 * CIVIQ Voices Feed API
 * GET /api/voices/feed
 *
 * Returns: { success, voices[], total }
 * Optional params: ?tier=premier|influential|established|emerging
 *                  ?type=official|journalist|all
 *                  ?limit=20&offset=0
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();

// Query params
$tier = $_GET['tier'] ?? null;
$type = $_GET['type'] ?? 'all';
$limit = min((int)($_GET['limit'] ?? 20), 50);
$offset = (int)($_GET['offset'] ?? 0);

// Build query
$where = [];
$params = [];

if ($tier && in_array($tier, ['emerging', 'established', 'influential', 'premier'])) {
    $where[] = "v.tier = ?";
    $params[] = $tier;
}

if ($type === 'official') {
    $where[] = "v.verified_official = 1";
} elseif ($type === 'journalist') {
    $where[] = "v.verified_journalist = 1";
}

$whereClause = count($where) > 0 ? 'WHERE ' . implode(' AND ', $where) : '';

// Get total count
$countSql = "SELECT COUNT(*) FROM voices v $whereClause";
$stmt = $db->prepare($countSql);
$stmt->execute($params);
$total = (int)$stmt->fetchColumn();

// Get voices with user info
$sql = "
    SELECT
        v.id,
        v.user_id,
        u.display_name as name,
        u.avatar_url,
        v.tagline,
        v.credentials,
        v.expertise_areas,
        v.website_url,
        v.twitter_handle,
        v.follower_count,
        v.tier,
        v.office_level,
        v.lean_score,
        v.verified_official,
        v.verified_journalist,
        v.response_count,
        v.total_likes_received
    FROM voices v
    JOIN users u ON v.user_id = u.id
    $whereClause
    ORDER BY
        CASE v.tier
            WHEN 'premier' THEN 1
            WHEN 'influential' THEN 2
            WHEN 'established' THEN 3
            ELSE 4
        END,
        v.follower_count DESC
    LIMIT ? OFFSET ?
";

$params[] = $limit;
$params[] = $offset;

$stmt = $db->prepare($sql);
$stmt->execute($params);
$voices = $stmt->fetchAll();

// Format response
$formattedVoices = array_map(function($v) {
    // Determine party from lean score
    $lean = (float)$v['lean_score'];
    $party = 'I'; // Independent/Unknown
    if ($lean <= -0.3) $party = 'D';
    elseif ($lean >= 0.3) $party = 'R';

    // Generate initials from name
    $nameParts = explode(' ', $v['name']);
    $initials = '';
    foreach ($nameParts as $part) {
        if (ctype_alpha($part[0])) {
            $initials .= strtoupper($part[0]);
        }
    }
    $initials = substr($initials, 0, 2);

    return [
        'id' => (int)$v['id'],
        'userId' => (int)$v['user_id'],
        'name' => $v['name'],
        'initials' => $initials,
        'avatarUrl' => $v['avatar_url'],
        'tagline' => $v['tagline'],
        'credentials' => $v['credentials'],
        'expertiseAreas' => json_decode($v['expertise_areas']) ?? [],
        'websiteUrl' => $v['website_url'],
        'twitter' => $v['twitter_handle'],
        'followers' => (int)$v['follower_count'],
        'tier' => $v['office_level'] ?? 'state', // Use office_level for local/state/federal filtering
        'engagementTier' => $v['tier'], // Keep original tier for ranking
        'leanScore' => (float)$v['lean_score'],
        'party' => $party,
        'isOfficial' => (bool)$v['verified_official'],
        'isJournalist' => (bool)$v['verified_journalist'],
        'responseCount' => (int)$v['response_count'],
        'likesReceived' => (int)$v['total_likes_received']
    ];
}, $voices);

jsonResponse([
    'success' => true,
    'voices' => $formattedVoices,
    'total' => $total,
    'limit' => $limit,
    'offset' => $offset
]);
