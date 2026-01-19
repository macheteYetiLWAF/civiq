#!/usr/bin/env php
<?php
/**
 * CIVIQ RSS Feed Ingestion
 * Fetches articles from configured RSS feeds and stores in articles table
 *
 * Run via cron: */15 * * * * /usr/bin/php /home/lom1ubvhoxxi/public_html/sud/claude/civiq/cron/ingest_rss.php
 */

// CLI mode - no HTTP headers
if (php_sapi_name() !== 'cli') {
    die('CLI only');
}

// Database config
define('DB_HOST', 'localhost');
define('DB_NAME', 'lom1ubvhoxxi_civiq');
define('DB_USER', 'lom1ubvhoxxi_claude');
define('DB_PASS', 'SLyb24sfbl5wJ');

// Connect
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    die("DB connection failed: " . $e->getMessage() . "\n");
}

echo "[" . date('Y-m-d H:i:s') . "] Starting RSS ingestion...\n";

// Get active RSS feeds
$stmt = $pdo->query("
    SELECT rf.id, rf.source_id, rf.feed_url, rf.feed_name, rf.category, ns.name as source_name
    FROM rss_feeds rf
    JOIN news_sources ns ON ns.id = rf.source_id
    WHERE rf.active = 1
");
$feeds = $stmt->fetchAll();

echo "Found " . count($feeds) . " active feeds\n";

$totalNew = 0;
$totalSkipped = 0;
$errors = 0;

foreach ($feeds as $feed) {
    echo "\n[{$feed['source_name']}] Fetching {$feed['feed_url']}...\n";

    $xml = @simplexml_load_file($feed['feed_url']);

    if (!$xml) {
        echo "  ERROR: Could not parse feed\n";
        $errors++;
        continue;
    }

    // Update last_checked
    $pdo->prepare("UPDATE rss_feeds SET last_checked = NOW() WHERE id = ?")->execute([$feed['id']]);

    $items = $xml->channel->item ?? $xml->entry ?? [];
    $feedNew = 0;
    $feedSkipped = 0;

    foreach ($items as $item) {
        // Parse RSS 2.0 or Atom
        $url = (string)($item->link['href'] ?? $item->link);
        $title = (string)($item->title);
        $pubDate = (string)($item->pubDate ?? $item->published ?? $item->updated);
        $author = (string)($item->author->name ?? $item->{'dc:creator'} ?? $item->author ?? null);
        $description = (string)($item->description ?? $item->summary ?? $item->content ?? '');

        if (empty($url) || empty($title)) {
            continue;
        }

        // Clean URL (remove tracking params)
        $url = preg_replace('/[?&](utm_[^&]+|fbclid|gclid)[^&]*/i', '', $url);
        $url = rtrim($url, '?&');

        // Check if already exists
        $checkStmt = $pdo->prepare("SELECT id FROM articles WHERE url = ?");
        $checkStmt->execute([$url]);
        if ($checkStmt->fetch()) {
            $feedSkipped++;
            continue;
        }

        // Parse date
        $publishedAt = null;
        if ($pubDate) {
            $ts = strtotime($pubDate);
            if ($ts) {
                $publishedAt = date('Y-m-d H:i:s', $ts);
            }
        }

        // Clean description (strip HTML, limit length)
        $lede = strip_tags($description);
        $lede = html_entity_decode($lede, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $lede = preg_replace('/\s+/', ' ', trim($lede));
        if (strlen($lede) > 500) {
            $lede = substr($lede, 0, 497) . '...';
        }

        // Insert
        $insertStmt = $pdo->prepare("
            INSERT INTO articles (source_id, url, title, author, published_at, lede, article_type)
            VALUES (?, ?, ?, ?, ?, ?, 'news')
        ");

        try {
            $insertStmt->execute([
                $feed['source_id'],
                $url,
                $title,
                $author ?: null,
                $publishedAt,
                $lede ?: null
            ]);
            $feedNew++;
        } catch (PDOException $e) {
            // Duplicate or other error - skip
            $feedSkipped++;
        }
    }

    echo "  New: {$feedNew}, Skipped: {$feedSkipped}\n";

    // Update last_successful if we got items
    if ($feedNew > 0 || count($items) > 0) {
        $pdo->prepare("UPDATE rss_feeds SET last_successful = NOW() WHERE id = ?")->execute([$feed['id']]);
    }

    $totalNew += $feedNew;
    $totalSkipped += $feedSkipped;
}

// Log to ingestion_log
$pdo->prepare("
    INSERT INTO ingestion_log (source_type, items_fetched, items_new, items_skipped, errors, notes)
    VALUES ('rss', ?, ?, ?, ?, ?)
")->execute([
    $totalNew + $totalSkipped,
    $totalNew,
    $totalSkipped,
    $errors,
    "Processed " . count($feeds) . " feeds"
]);

echo "\n[" . date('Y-m-d H:i:s') . "] Done. New: {$totalNew}, Skipped: {$totalSkipped}, Errors: {$errors}\n";

// ============================================
// 7-DAY RETENTION POLICY
// Remove articles older than 7 days to keep feed fresh
// ============================================
echo "\n[" . date('Y-m-d H:i:s') . "] Enforcing 7-day retention policy...\n";

$retentionDays = 7;
$cutoffDate = date('Y-m-d H:i:s', strtotime("-{$retentionDays} days"));

// Count articles to be deleted
$countStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM articles WHERE published_at < ?");
$countStmt->execute([$cutoffDate]);
$toDelete = $countStmt->fetch()['cnt'];

if ($toDelete > 0) {
    // Delete old articles (cascade will handle related records)
    $deleteStmt = $pdo->prepare("DELETE FROM articles WHERE published_at < ?");
    $deleteStmt->execute([$cutoffDate]);
    echo "  Deleted {$toDelete} articles older than {$retentionDays} days\n";

    // Log retention cleanup
    $pdo->prepare("
        INSERT INTO ingestion_log (source_type, items_fetched, items_new, items_skipped, errors, notes)
        VALUES ('retention_cleanup', 0, 0, 0, 0, ?)
    ")->execute(["Deleted {$toDelete} articles older than {$retentionDays} days"]);
} else {
    echo "  No articles older than {$retentionDays} days to delete\n";
}

echo "[" . date('Y-m-d H:i:s') . "] Retention cleanup complete.\n";
