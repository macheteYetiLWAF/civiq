<?php
/**
 * News Sources API
 * Returns news sources with bias ratings and credibility info
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Session-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host = 'localhost';
$db = 'lom1ubvhoxxi_civiq';
$user = 'lom1ubvhoxxi_claude';
$pass = 'SLyb24sfbl5wJ';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get all active sources with bias data
    $stmt = $pdo->query("
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
            ns.is_locally_owned,
            ns.individual_owner,
            og.name as ownership_group,
            og.ownership_type,
            sb.avg_bias_score,
            sb.avg_factuality,
            sb.avg_opinion_percentage,
            sb.articles_analyzed
        FROM news_sources ns
        LEFT JOIN ownership_groups og ON ns.ownership_group_id = og.id
        LEFT JOIN source_bias sb ON ns.id = sb.source_id
        WHERE ns.active = 1
        ORDER BY ns.name ASC
    ");

    $sources = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process sources and categorize by bias
    $processed = [];
    foreach ($sources as $source) {
        // Calculate bias category based on avg_bias_score
        // Score ranges: -1 (far left) to +1 (far right), 0 = center
        $biasScore = $source['avg_bias_score'];
        $biasCategory = 'center'; // default

        if ($biasScore !== null) {
            $score = floatval($biasScore);
            if ($score <= -0.6) {
                $biasCategory = 'left';
            } elseif ($score <= -0.2) {
                $biasCategory = 'lean-left';
            } elseif ($score <= 0.2) {
                $biasCategory = 'center';
            } elseif ($score <= 0.6) {
                $biasCategory = 'lean-right';
            } else {
                $biasCategory = 'right';
            }
        }

        // Calculate credibility rating (0-100)
        $credibility = 75; // default
        if ($source['avg_factuality'] !== null) {
            $credibility = round(floatval($source['avg_factuality']) * 100);
        }

        // Generate abbreviation for logo placeholder
        $words = explode(' ', $source['name']);
        $abbr = '';
        if (count($words) >= 2) {
            $abbr = strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1));
        } else {
            $abbr = strtoupper(substr($source['name'], 0, 2));
        }

        // Map type to display category
        $typeMap = [
            'newspaper_daily' => 'Newspapers',
            'newspaper_weekly' => 'Newspapers',
            'tv_station' => 'Networks',
            'radio_station' => 'Radio',
            'online_only' => 'Digital',
            'nonprofit_news' => 'Nonprofit',
            'public_media' => 'Public Media'
        ];

        $processed[] = [
            'id' => intval($source['id']),
            'name' => $source['name'],
            'url' => $source['url'],
            'type' => $source['type'],
            'category' => $typeMap[$source['type']] ?? 'Other',
            'abbreviation' => $abbr,
            'bias_score' => $source['avg_bias_score'] !== null ? floatval($source['avg_bias_score']) : null,
            'bias_category' => $biasCategory,
            'credibility' => $credibility,
            'factuality' => $source['avg_factuality'] !== null ? floatval($source['avg_factuality']) : null,
            'opinion_percentage' => $source['avg_opinion_percentage'] !== null ? floatval($source['avg_opinion_percentage']) : null,
            'articles_analyzed' => intval($source['articles_analyzed'] ?? 0),
            'ownership_group' => $source['ownership_group'],
            'ownership_type' => $source['ownership_type'],
            'is_local' => (bool) $source['is_locally_owned'],
            'individual_owner' => $source['individual_owner'],
            'founded_year' => $source['founded_year'] ? intval($source['founded_year']) : null,
            'paywall' => $source['paywall_status'],
            'twitter' => $source['twitter_handle']
        ];
    }

    // Group by bias category
    $grouped = [
        'left' => [],
        'lean-left' => [],
        'center' => [],
        'lean-right' => [],
        'right' => []
    ];

    foreach ($processed as $source) {
        $grouped[$source['bias_category']][] = $source;
    }

    echo json_encode([
        'success' => true,
        'sources' => $processed,
        'grouped' => $grouped,
        'total' => count($processed)
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
