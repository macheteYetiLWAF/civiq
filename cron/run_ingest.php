<?php
/**
 * CIVIQ RSS Feed Ingestion
 */

// Database config
$pdo = new PDO(
    "mysql:host=localhost;dbname=lom1ubvhoxxi_civiq;charset=utf8mb4",
    'lom1ubvhoxxi_claude',
    'SLyb24sfbl5wJ',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
);

echo "[" . date('Y-m-d H:i:s') . "] Starting RSS ingestion...\n";

// Get active RSS feeds
$stmt = $pdo->query("
    SELECT rf.id, rf.source_id, rf.feed_url, rf.feed_name, rf.category, ns.name as source_name
    FROM rss_feeds rf
    JOIN news_sources ns ON ns.id = rf.source_id
    WHERE rf.active = 1 AND rf.feed_url IS NOT NULL AND rf.feed_url != ''
");
$feeds = $stmt->fetchAll();

echo "Found " . count($feeds) . " active feeds\n";

$totalNew = 0;
$totalSkipped = 0;
$errors = 0;

foreach ($feeds as $feed) {
    echo "\n[{$feed['source_name']}] {$feed['feed_url']}...\n";

    $ctx = stream_context_create(['http' => ['timeout' => 10]]);
    $content = @file_get_contents($feed['feed_url'], false, $ctx);

    if (!$content) {
        echo "  ERROR: Could not fetch feed\n";
        $errors++;
        continue;
    }

    $xml = @simplexml_load_string($content);
    if (!$xml) {
        echo "  ERROR: Could not parse XML\n";
        $errors++;
        continue;
    }

    $pdo->prepare("UPDATE rss_feeds SET last_checked = NOW() WHERE id = ?")->execute([$feed['id']]);

    $items = $xml->channel->item ?? $xml->entry ?? [];
    $feedNew = 0;
    $feedSkipped = 0;

    foreach ($items as $item) {
        $url = (string)($item->link['href'] ?? $item->link);
        $title = (string)($item->title);
        $pubDate = (string)($item->pubDate ?? $item->published ?? $item->updated);
        $description = (string)($item->description ?? $item->summary ?? '');

        if (empty($url) || empty($title)) continue;

        // Clean URL
        $url = preg_replace('/[?&](utm_[^&]+|fbclid|gclid)[^&]*/i', '', $url);
        $url = rtrim($url, '?&');

        // Check exists
        $check = $pdo->prepare("SELECT id FROM articles WHERE url = ?");
        $check->execute([$url]);
        if ($check->fetch()) {
            $feedSkipped++;
            continue;
        }

        // Parse date
        $publishedAt = $pubDate ? date('Y-m-d H:i:s', strtotime($pubDate)) : null;

        // Clean description
        $lede = strip_tags($description);
        $lede = html_entity_decode($lede, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $lede = preg_replace('/\s+/', ' ', trim($lede));
        if (strlen($lede) > 500) $lede = substr($lede, 0, 497) . '...';

        try {
            $ins = $pdo->prepare("INSERT INTO articles (source_id, url, title, published_at, lede, article_type) VALUES (?, ?, ?, ?, ?, 'news')");
            $ins->execute([$feed['source_id'], $url, $title, $publishedAt, $lede ?: null]);
            $feedNew++;
        } catch (PDOException $e) {
            $feedSkipped++;
        }
    }

    echo "  New: {$feedNew}, Skipped: {$feedSkipped}\n";

    if ($feedNew > 0) {
        $pdo->prepare("UPDATE rss_feeds SET last_successful = NOW() WHERE id = ?")->execute([$feed['id']]);
    }

    $totalNew += $feedNew;
    $totalSkipped += $feedSkipped;
}

$pdo->prepare("INSERT INTO ingestion_log (source_type, items_fetched, items_new, items_skipped, errors, notes) VALUES ('rss', ?, ?, ?, ?, ?)")
    ->execute([$totalNew + $totalSkipped, $totalNew, $totalSkipped, $errors, count($feeds) . " feeds"]);

echo "\n[" . date('Y-m-d H:i:s') . "] Done. New: {$totalNew}, Skipped: {$totalSkipped}, Errors: {$errors}\n";
