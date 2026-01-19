<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$db = 'lom1ubvhoxxi_sud_claude';
$user = 'lom1ubvhoxxi_claude';
$pass = 'SLyb24sfbl5wJ';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get stats
    $stats = [
        'total_sources' => $pdo->query("SELECT COUNT(*) FROM news_sources")->fetchColumn(),
        'total_govt' => $pdo->query("SELECT COUNT(*) FROM government_sources")->fetchColumn(),
        'total_rss' => $pdo->query("SELECT COUNT(*) FROM rss_feeds")->fetchColumn()
    ];

    // Get by type
    $byType = $pdo->query("SELECT type, COUNT(*) as count FROM news_sources GROUP BY type ORDER BY count DESC")->fetchAll(PDO::FETCH_ASSOC);

    // Get all sources with RSS count and normalized ownership
    $sources = $pdo->query("
        SELECT
            s.id, s.name, s.url, s.type,
            og.name as owner_name,
            og.ownership_type,
            s.is_locally_owned,
            s.individual_owner,
            s.paywall_status, s.twitter_handle, s.notes,
            (SELECT COUNT(*) FROM rss_feeds f WHERE f.source_id = s.id) as rss_count
        FROM news_sources s
        LEFT JOIN ownership_groups og ON s.ownership_group_id = og.id
        ORDER BY
            FIELD(s.type, 'newspaper_daily', 'newspaper_weekly', 'tv_station', 'radio_station', 'online_only', 'nonprofit_news', 'public_media'),
            s.name
    ")->fetchAll(PDO::FETCH_ASSOC);

    // Get ownership breakdown
    $ownership = $pdo->query("
        SELECT
            og.name, og.ownership_type, og.headquarters,
            COUNT(s.id) as source_count,
            SUM(CASE WHEN s.is_locally_owned THEN 1 ELSE 0 END) as local_count
        FROM ownership_groups og
        LEFT JOIN news_sources s ON s.ownership_group_id = og.id
        GROUP BY og.id
        ORDER BY source_count DESC
    ")->fetchAll(PDO::FETCH_ASSOC);

    // Get government sources
    $govtSources = $pdo->query("
        SELECT id, name, url, type, jurisdiction, county,
               has_agenda_portal, has_meeting_videos, has_open_records
        FROM government_sources
        ORDER BY
            FIELD(type, 'county', 'city', 'school_board', 'state_legislature', 'state_courts', 'state_agency', 'open_data_portal'),
            name
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'by_type' => $byType,
        'ownership' => $ownership,
        'sources' => $sources,
        'govt_sources' => $govtSources
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
