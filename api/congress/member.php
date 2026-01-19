<?php
/**
 * Congress Member API Endpoint
 *
 * GET /api/congress/member.php?id=P000197 (by bioguide ID)
 * GET /api/congress/member.php?name=Pelosi&state=CA
 * GET /api/congress/member.php?state=PA (list by state)
 * GET /api/congress/member.php?state=PA&district=1 (by district)
 *
 * Returns member data from Congress.gov API
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../clients/CongressClient.php';
require_once __DIR__ . '/../config.php';

// Get API key
$apiKey = defined('CONGRESS_API_KEY') ? CONGRESS_API_KEY : null;

if (!$apiKey) {
    try {
        $db = new PDO(
            'mysql:host=localhost;dbname=lom1ubvhoxxi_sud_claude',
            'lom1ubvhoxxi_claude',
            'SLyb24sfbl5wJ'
        );
        $stmt = $db->prepare("SELECT credential_value FROM claude_credentials WHERE service_name = 'congress' AND credential_key = 'api_key'");
        $stmt->execute();
        $apiKey = $stmt->fetchColumn();
    } catch (Exception $e) {
        // Fall back to DEMO_KEY (rate limited but functional)
        $apiKey = 'DEMO_KEY';
    }
}

if (!$apiKey) {
    // Final fallback to DEMO_KEY
    $apiKey = 'DEMO_KEY';
}

try {
    $client = new CongressClient($apiKey);

    $bioguideId = $_GET['id'] ?? null;
    $name = $_GET['name'] ?? null;
    $state = $_GET['state'] ?? null;
    $district = $_GET['district'] ?? null;
    $includeProfile = isset($_GET['include_legislation']);

    // Get by bioguide ID
    if ($bioguideId) {
        if ($includeProfile) {
            $data = $client->getMemberProfile($bioguideId);
        } else {
            $data = $client->getMember($bioguideId);
        }
        echo json_encode(['success' => true, 'data' => $data]);
        exit;
    }

    // Search by name
    if ($name) {
        $member = $client->findMember($name, $state);
        if (!$member) {
            http_response_code(404);
            echo json_encode(['error' => 'Member not found', 'searched' => compact('name', 'state')]);
            exit;
        }
        echo json_encode(['success' => true, 'data' => $member]);
        exit;
    }

    // List by state and optionally district
    if ($state) {
        if ($district) {
            $data = $client->getMembersByDistrict($state, $district);
        } else {
            $data = $client->getMembersByState($state);
        }
        echo json_encode(['success' => true, 'data' => $data]);
        exit;
    }

    // Default: return current members
    $data = $client->getMembers(['currentMember' => true, 'limit' => 50]);
    echo json_encode(['success' => true, 'data' => $data]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'API error',
        'message' => $e->getMessage(),
    ]);
}
