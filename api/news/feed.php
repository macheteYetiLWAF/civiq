<?php
/**
 * CIVIQ News Feed API
 * GET /api/news/feed?state=PA&level=all
 *
 * Aggregates news from RSS feeds and categorizes by government level
 * Returns: { success, articles[] }
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$stateCode = $_GET['state'] ?? null;
$level = $_GET['level'] ?? 'all'; // all, federal, state, local
$limit = min((int)($_GET['limit'] ?? 20), 50);

$user = getCurrentUser();

// Use user's state if not specified
if (!$stateCode && $user) {
    $stateCode = $user['state_code'];
}

$db = getDB();

// Generate cache key
$cacheKey = "news_{$stateCode}_{$level}_{$limit}";

// Check cache (15 minute cache for news)
$stmt = $db->prepare("
    SELECT articles, fetched_at
    FROM news_cache
    WHERE cache_key = ?
    AND expires_at > NOW()
    LIMIT 1
");
$stmt->execute([$cacheKey]);
$cached = $stmt->fetch();

if ($cached) {
    $data = json_decode($cached['articles'], true);
    jsonResponse([
        'success' => true,
        'articles' => $data,
        'cached' => true,
        'cached_at' => $cached['fetched_at'],
        'state' => $stateCode,
        'level' => $level
    ]);
}

// Get news sources from database
$stmt = $db->prepare("
    SELECT ns.id, ns.name, ns.rss_feed_url, ns.type, sb.avg_bias_score
    FROM news_sources ns
    LEFT JOIN source_bias sb ON ns.id = sb.source_id
    WHERE ns.rss_feed_url IS NOT NULL
    AND ns.rss_feed_url != ''
    AND ns.active = 1
    LIMIT 20
");
$stmt->execute();
$sources = $stmt->fetchAll();

// Also add some major national sources for federal news
$federalSources = [
    ['name' => 'AP News', 'url' => 'https://rsshub.app/apnews/politics', 'level' => 'federal', 'bias' => 0],
    ['name' => 'Reuters', 'url' => 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best', 'level' => 'federal', 'bias' => 0],
    ['name' => 'NPR Politics', 'url' => 'https://feeds.npr.org/1014/rss.xml', 'level' => 'federal', 'bias' => -0.2],
];

// Fetch articles from RSS feeds
$articles = [];

// Fetch from local/state sources
foreach ($sources as $source) {
    if (empty($source['rss_feed_url'])) continue;

    $rssContent = @file_get_contents($source['rss_feed_url']);
    if (!$rssContent) continue;

    $rss = @simplexml_load_string($rssContent);
    if (!$rss) continue;

    $items = $rss->channel->item ?? $rss->item ?? [];
    $count = 0;

    foreach ($items as $item) {
        if ($count >= 3) break; // Max 3 per source

        $title = (string)($item->title ?? '');
        $description = (string)($item->description ?? '');
        $link = (string)($item->link ?? '');
        $pubDate = (string)($item->pubDate ?? '');

        // Determine if it's political/government news
        $keywords = ['council', 'mayor', 'governor', 'senator', 'representative', 'bill', 'law', 'election', 'vote', 'budget', 'tax', 'police', 'school board', 'zoning', 'government', 'legislature', 'congress', 'house', 'senate', 'political', 'democrat', 'republican', 'commission', 'ordinance'];

        $titleLower = strtolower($title . ' ' . $description);
        $isPolitical = false;
        foreach ($keywords as $kw) {
            if (strpos($titleLower, $kw) !== false) {
                $isPolitical = true;
                break;
            }
        }

        // Determine government level from content
        $govLevel = 'local'; // Default for local sources
        if (preg_match('/\b(u\.?s\.?\s+(senate|house|congress)|federal|president|national)\b/i', $titleLower)) {
            $govLevel = 'federal';
        } elseif (preg_match('/\b(governor|state\s+(senate|house|legislature)|harrisburg|pa\s+(house|senate))\b/i', $titleLower)) {
            $govLevel = 'state';
        }

        // Skip non-political unless we need more content
        if (!$isPolitical && count($articles) > 5) continue;

        // Convert bias score to category
        $biasScore = $source['avg_bias_score'] ?? 0;
        $biasCategory = 'center';
        if ($biasScore < -0.3) $biasCategory = 'left';
        elseif ($biasScore < -0.1) $biasCategory = 'left-center';
        elseif ($biasScore > 0.3) $biasCategory = 'right';
        elseif ($biasScore > 0.1) $biasCategory = 'right-center';

        $articles[] = [
            'title' => strip_tags($title),
            'description' => strip_tags(substr($description, 0, 200)),
            'url' => $link,
            'source' => $source['name'],
            'source_id' => $source['id'],
            'published_at' => $pubDate ? date('c', strtotime($pubDate)) : null,
            'level' => $govLevel,
            'bias' => $biasCategory,
            'bias_score' => (float)$biasScore,
            'is_political' => $isPolitical
        ];

        $count++;
    }
}

// Add federal sources
if ($level === 'all' || $level === 'federal') {
    foreach ($federalSources as $source) {
        $rssContent = @file_get_contents($source['url']);
        if (!$rssContent) continue;

        $rss = @simplexml_load_string($rssContent);
        if (!$rss) continue;

        $items = $rss->channel->item ?? $rss->item ?? [];
        $count = 0;

        foreach ($items as $item) {
            if ($count >= 3) break;

            $title = (string)($item->title ?? '');
            $description = (string)($item->description ?? '');
            $link = (string)($item->link ?? '');
            $pubDate = (string)($item->pubDate ?? '');

            $biasCategory = 'center';
            if ($source['bias'] < -0.1) $biasCategory = 'left-center';
            elseif ($source['bias'] > 0.1) $biasCategory = 'right-center';

            $articles[] = [
                'title' => strip_tags($title),
                'description' => strip_tags(substr($description, 0, 200)),
                'url' => $link,
                'source' => $source['name'],
                'source_id' => null,
                'published_at' => $pubDate ? date('c', strtotime($pubDate)) : null,
                'level' => 'federal',
                'bias' => $biasCategory,
                'bias_score' => $source['bias'],
                'is_political' => true
            ];

            $count++;
        }
    }
}

// Filter by level if specified
if ($level !== 'all') {
    $articles = array_filter($articles, function($a) use ($level) {
        return $a['level'] === $level;
    });
    $articles = array_values($articles);
}

// Sort by date (newest first)
usort($articles, function($a, $b) {
    $dateA = $a['published_at'] ? strtotime($a['published_at']) : 0;
    $dateB = $b['published_at'] ? strtotime($b['published_at']) : 0;
    return $dateB - $dateA;
});

// Limit results
$articles = array_slice($articles, 0, $limit);

// Cache the results
$expiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes'));
$stmt = $db->prepare("
    INSERT INTO news_cache (cache_key, gov_level, state_code, articles, expires_at)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE articles = VALUES(articles), fetched_at = NOW(), expires_at = VALUES(expires_at)
");
$stmt->execute([$cacheKey, $level, $stateCode, json_encode($articles), $expiresAt]);

jsonResponse([
    'success' => true,
    'articles' => $articles,
    'cached' => false,
    'state' => $stateCode,
    'level' => $level,
    'count' => count($articles)
]);
