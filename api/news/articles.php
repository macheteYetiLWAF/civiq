<?php
/**
 * CIVIQ Articles API
 * GET /api/news/articles
 *
 * Returns articles with source bias indicators and objectivity scores.
 * Supports filtering by source, date range, and bias rating.
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();

// Query parameters
$limit = min((int)($_GET['limit'] ?? 25), 100);
$offset = (int)($_GET['offset'] ?? 0);
$sourceId = $_GET['source_id'] ?? null;
$biasFilter = $_GET['bias'] ?? null; // 'left', 'center', 'right', 'all'
$minFactuality = $_GET['min_factuality'] ?? null;
$since = $_GET['since'] ?? null; // ISO date

// Build WHERE clause
$where = ['1=1'];
$params = [];

if ($sourceId) {
    $where[] = 'a.source_id = ?';
    $params[] = $sourceId;
}

if ($biasFilter && $biasFilter !== 'all') {
    switch ($biasFilter) {
        case 'left':
            $where[] = "ns.bias_rating IN ('far_left', 'left', 'lean_left')";
            break;
        case 'center':
            $where[] = "ns.bias_rating = 'center'";
            break;
        case 'right':
            $where[] = "ns.bias_rating IN ('lean_right', 'right', 'far_right')";
            break;
    }
}

if ($minFactuality) {
    $where[] = 'ns.factuality_score >= ?';
    $params[] = (float)$minFactuality;
}

if ($since) {
    $where[] = 'a.published_at >= ?';
    $params[] = $since;
}

$whereClause = implode(' AND ', $where);

// Query articles with source bias data
$stmt = $db->prepare("
    SELECT
        a.id,
        a.title,
        a.url,
        a.lede,
        a.published_at,
        a.article_type,
        ns.id as source_id,
        ns.name as source_name,
        ns.type as source_type,
        ns.bias_rating,
        ns.bias_score,
        ns.factuality_score,
        ns.credibility_tier,
        ns.is_locally_owned,
        aba.objectivity_score,
        aba.headline_sentiment,
        aba.loaded_language_score
    FROM articles a
    JOIN news_sources ns ON ns.id = a.source_id
    LEFT JOIN article_bias_analysis aba ON aba.article_id = a.id
    WHERE $whereClause
    ORDER BY a.published_at DESC
    LIMIT ? OFFSET ?
");

$params[] = $limit;
$params[] = $offset;
$stmt->execute($params);
$articles = $stmt->fetchAll();

// Count total for pagination
$countStmt = $db->prepare("
    SELECT COUNT(*) as total
    FROM articles a
    JOIN news_sources ns ON ns.id = a.source_id
    WHERE $whereClause
");
$countParams = array_slice($params, 0, -2); // Remove limit/offset
$countStmt->execute($countParams);
$total = $countStmt->fetch()['total'];

// Format response
$formattedArticles = array_map(function($a) {
    // Determine bias indicator color
    $biasColor = '#64748B'; // default gray
    if ($a['bias_score'] !== null) {
        $score = (float)$a['bias_score'];
        if ($score <= -0.5) $biasColor = '#1E40AF'; // dark blue - far left
        elseif ($score <= -0.2) $biasColor = '#3B82F6'; // blue - lean left
        elseif ($score < 0.2) $biasColor = '#8B5CF6'; // purple - center
        elseif ($score < 0.5) $biasColor = '#EF4444'; // red - lean right
        else $biasColor = '#991B1B'; // dark red - far right
    }

    return [
        'id' => (int)$a['id'],
        'title' => $a['title'],
        'url' => $a['url'],
        'lede' => $a['lede'],
        'publishedAt' => $a['published_at'],
        'type' => $a['article_type'],
        'source' => [
            'id' => (int)$a['source_id'],
            'name' => $a['source_name'],
            'type' => $a['source_type'],
            'isLocal' => (bool)$a['is_locally_owned']
        ],
        'bias' => [
            'rating' => $a['bias_rating'],
            'score' => $a['bias_score'] !== null ? (float)$a['bias_score'] : null,
            'color' => $biasColor,
            'factuality' => $a['factuality_score'] !== null ? (float)$a['factuality_score'] : null,
            'credibility' => $a['credibility_tier']
        ],
        'analysis' => $a['objectivity_score'] !== null ? [
            'objectivity' => (float)$a['objectivity_score'],
            'headlineSentiment' => $a['headline_sentiment'] !== null ? (float)$a['headline_sentiment'] : null,
            'loadedLanguage' => $a['loaded_language_score'] !== null ? (float)$a['loaded_language_score'] : null
        ] : null
    ];
}, $articles);

// Calculate bias distribution for this result set
$biasDistribution = [
    'left' => 0,
    'center' => 0,
    'right' => 0,
    'unknown' => 0
];

foreach ($articles as $a) {
    $score = $a['bias_score'];
    if ($score === null) $biasDistribution['unknown']++;
    elseif ((float)$score < -0.15) $biasDistribution['left']++;
    elseif ((float)$score > 0.15) $biasDistribution['right']++;
    else $biasDistribution['center']++;
}

jsonResponse([
    'success' => true,
    'articles' => $formattedArticles,
    'pagination' => [
        'total' => (int)$total,
        'limit' => $limit,
        'offset' => $offset,
        'hasMore' => ($offset + $limit) < $total
    ],
    'biasDistribution' => $biasDistribution,
    'filters' => [
        'sourceId' => $sourceId,
        'bias' => $biasFilter,
        'minFactuality' => $minFactuality,
        'since' => $since
    ]
]);
