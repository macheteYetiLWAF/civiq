<?php
/**
 * CIVIQ Source API
 * GET /api/news/source.php?id=X
 * Returns details for a single news source
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$sourceId = $_GET['id'] ?? null;
if (!$sourceId) {
    jsonError('Source ID required', 400);
}

$db = getDB();

// Get source details
$stmt = $db->prepare("
    SELECT
        ns.id,
        ns.name,
        ns.url,
        ns.type,
        ns.publication_frequency,
        ns.paywall_status,
        ns.twitter_handle,
        ns.founded_year,
        ns.notes,
        ns.bias_rating,
        ns.bias_score,
        ns.factuality_score,
        ns.credibility_tier,
        ns.bias_source,
        ns.last_bias_check,
        ns.is_locally_owned,
        ns.individual_owner,
        og.name as owner_name,
        og.ownership_type,
        og.headquarters as owner_headquarters
    FROM news_sources ns
    LEFT JOIN ownership_groups og ON ns.ownership_group_id = og.id
    WHERE ns.id = ?
");
$stmt->execute([$sourceId]);
$source = $stmt->fetch();

if (!$source) {
    jsonError('Source not found', 404);
}

// Get recent articles from this source
$articlesStmt = $db->prepare("
    SELECT id, title, url, lede, published_at, author
    FROM articles
    WHERE source_id = ?
    ORDER BY published_at DESC
    LIMIT 10
");
$articlesStmt->execute([$sourceId]);
$articles = $articlesStmt->fetchAll();

// Get article count
$countStmt = $db->prepare("SELECT COUNT(*) FROM articles WHERE source_id = ?");
$countStmt->execute([$sourceId]);
$articleCount = $countStmt->fetchColumn();

// Map bias rating to numeric score for display
$biasScoreMap = [
    'far_left' => -1.0,
    'left' => -0.7,
    'lean_left' => -0.35,
    'center' => 0,
    'lean_right' => 0.35,
    'right' => 0.7,
    'far_right' => 1.0
];

$biasNumeric = $source['bias_rating'] ? ($biasScoreMap[$source['bias_rating']] ?? 0) : null;

jsonResponse([
    'success' => true,
    'source' => [
        'id' => (int)$source['id'],
        'name' => $source['name'],
        'url' => $source['url'],
        'type' => $source['type'],
        'frequency' => $source['publication_frequency'],
        'paywall' => $source['paywall_status'],
        'twitter' => $source['twitter_handle'],
        'founded' => $source['founded_year'],
        'notes' => $source['notes'],
        'bias' => [
            'rating' => $source['bias_rating'],
            'score' => $biasNumeric,
            'factuality' => $source['factuality_score'] ? (float)$source['factuality_score'] : null,
            'credibility' => $source['credibility_tier'],
            'source' => $source['bias_source'],
            'lastCheck' => $source['last_bias_check']
        ],
        'ownership' => [
            'isLocal' => (bool)$source['is_locally_owned'],
            'owner' => $source['owner_name'] ?: $source['individual_owner'],
            'type' => $source['ownership_type'],
            'headquarters' => $source['owner_headquarters']
        ],
        'articleCount' => (int)$articleCount
    ],
    'articles' => array_map(function($a) {
        return [
            'id' => (int)$a['id'],
            'title' => $a['title'],
            'url' => $a['url'],
            'lede' => $a['lede'],
            'publishedAt' => $a['published_at'],
            'author' => $a['author']
        ];
    }, $articles)
]);
