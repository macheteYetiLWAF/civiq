<?php
/**
 * Campaign Finance API Endpoint
 *
 * GET /api/finance/candidate.php?id=P80001571
 * GET /api/finance/candidate.php?name=Trump&state=FL&office=P
 *
 * Returns campaign finance data from OpenFEC
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../clients/OpenFECClient.php';
require_once __DIR__ . '/../../config.php';

// Get API key from config or credentials table
$apiKey = defined('OPENFEC_API_KEY') ? OPENFEC_API_KEY : null;

if (!$apiKey) {
    // Try to get from credentials table
    try {
        $db = new PDO(
            'mysql:host=localhost;dbname=lom1ubvhoxxi_sud_claude',
            'lom1ubvhoxxi_claude',
            'SLyb24sfbl5wJ'
        );
        $stmt = $db->prepare("SELECT credential_value FROM claude_credentials WHERE service_name = 'openfec' AND credential_key = 'api_key'");
        $stmt->execute();
        $apiKey = $stmt->fetchColumn();
    } catch (Exception $e) {
        // Fall back to data.gov demo key
        $apiKey = 'DEMO_KEY';
    }
}

try {
    $client = new OpenFECClient($apiKey);

    $candidateId = $_GET['id'] ?? null;
    $name = $_GET['name'] ?? null;
    $state = $_GET['state'] ?? null;
    $office = $_GET['office'] ?? null;
    $cycle = $_GET['cycle'] ?? null;

    // If no ID provided, search by name
    if (!$candidateId && $name) {
        $candidate = $client->findCandidate($name, $state, $office, $cycle);
        if (!$candidate) {
            http_response_code(404);
            echo json_encode(['error' => 'Candidate not found', 'searched' => compact('name', 'state', 'office')]);
            exit;
        }
        $candidateId = $candidate['candidate_id'];
    }

    if (!$candidateId) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required parameter: id or name']);
        exit;
    }

    // Get comprehensive financial data
    $summary = $client->getCandidateFinancialSummary($candidateId, $cycle);

    // Add contribution breakdown if requested
    if (isset($_GET['include_contributions'])) {
        $summary['contributions_by_size'] = $client->getContributionsBySize([
            'candidate_id' => $candidateId,
            'cycle' => $cycle ?: date('Y'),
        ]);
        $summary['contributions_by_state'] = $client->getContributionsByState([
            'candidate_id' => $candidateId,
            'cycle' => $cycle ?: date('Y'),
        ]);
    }

    echo json_encode([
        'success' => true,
        'data' => $summary,
        'cached' => !empty($summary['candidate']['_cached']),
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'API error',
        'message' => $e->getMessage(),
    ]);
}
