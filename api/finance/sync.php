<?php
/**
 * OpenFEC Campaign Finance Sync Script
 *
 * Syncs campaign finance data from OpenFEC API to local database.
 * Uses caching to minimize API calls:
 * - FEC candidate IDs cached in voices.fec_candidate_id
 * - Financial data refreshed only if older than 24 hours
 *
 * Usage:
 *   CLI: php sync.php [--force] [--voice_id=123]
 *   HTTP: /api/finance/sync.php?force=1&voice_id=123
 *
 * The OpenFECClient class handles API-level caching (1 hour TTL).
 * This script handles database-level caching (24 hour TTL).
 */

require_once __DIR__ . '/../clients/OpenFECClient.php';
require_once __DIR__ . '/../config.php';

// Configuration
$REFRESH_HOURS = 24;  // Only refresh data older than this
$MAX_SYNC_PER_RUN = 20;  // Limit to avoid rate limiting
$CYCLE_YEAR = 2024;

// Parse arguments
$force = isset($_GET['force']) || in_array('--force', $argv ?? []);
$singleVoiceId = $_GET['voice_id'] ?? null;
foreach ($argv ?? [] as $arg) {
    if (strpos($arg, '--voice_id=') === 0) {
        $singleVoiceId = substr($arg, 11);
    }
}

// Get API key
$apiKey = defined('OPENFEC_API_KEY') ? OPENFEC_API_KEY : null;
if (!$apiKey) {
    // Try credentials table
    try {
        $credDb = new PDO(
            'mysql:host=localhost;dbname=lom1ubvhoxxi_sud_claude',
            'lom1ubvhoxxi_claude',
            'SLyb24sfbl5wJ'
        );
        $stmt = $credDb->prepare("SELECT credential_value FROM claude_credentials WHERE service_name = 'openfec' AND credential_key = 'api_key'");
        $stmt->execute();
        $apiKey = $stmt->fetchColumn();
    } catch (Exception $e) {
        // Fall through to demo key
    }
}

if (!$apiKey) {
    $apiKey = 'DEMO_KEY';  // Limited rate but works for testing
}

$fec = new OpenFECClient($apiKey);
$db = getDB();

// Output helper
function output($msg) {
    if (php_sapi_name() === 'cli') {
        echo $msg . "\n";
    } else {
        echo "<p>" . htmlspecialchars($msg) . "</p>";
    }
}

// Get officials that need syncing
$query = "
    SELECT
        v.id as voice_id,
        v.user_id,
        v.office_level,
        v.office_title,
        v.district,
        v.fec_candidate_id,
        u.display_name,
        cf.last_updated as finance_updated,
        cf.fec_last_fetch
    FROM voices v
    JOIN users u ON u.id = v.user_id
    LEFT JOIN campaign_finance cf ON cf.voice_id = v.id AND cf.cycle_year = ?
    WHERE v.verified_official = 1
      AND v.office_level IN ('federal', 'state')
";

$params = [$CYCLE_YEAR];

if ($singleVoiceId) {
    $query .= " AND v.id = ?";
    $params[] = $singleVoiceId;
}

// Only federal officials have FEC data (state officials don't file with FEC)
$query .= " AND v.office_level = 'federal'";

if (!$force) {
    // Only sync records not updated recently
    $query .= " AND (cf.fec_last_fetch IS NULL OR cf.fec_last_fetch < DATE_SUB(NOW(), INTERVAL ? HOUR))";
    $params[] = $REFRESH_HOURS;
}

$query .= " ORDER BY CASE WHEN cf.fec_last_fetch IS NULL THEN 0 ELSE 1 END, cf.fec_last_fetch ASC LIMIT ?";
$params[] = $MAX_SYNC_PER_RUN;

$stmt = $db->prepare($query);
$stmt->execute($params);
$officials = $stmt->fetchAll();

output("Found " . count($officials) . " officials to sync");

$synced = 0;
$errors = 0;

foreach ($officials as $official) {
    $voiceId = $official['voice_id'];
    $name = $official['display_name'];
    $title = $official['office_title'];
    $fecId = $official['fec_candidate_id'];

    output("\n--- Processing: $name ($title) ---");

    try {
        // Step 1: Get or lookup FEC candidate ID
        if (!$fecId) {
            output("  Looking up FEC candidate ID...");

            // Determine office type for FEC
            $fecOffice = null;
            if (stripos($title, 'Senator') !== false || stripos($title, 'Senate') !== false) {
                $fecOffice = 'S';
            } elseif (stripos($title, 'Representative') !== false || stripos($title, 'House') !== false) {
                $fecOffice = 'H';
            } elseif (stripos($title, 'President') !== false) {
                $fecOffice = 'P';
            }

            // Clean name for search (remove titles like Rep., Sen., etc.)
            $searchName = preg_replace('/^(Rep\.|Sen\.|Gov\.|Lt\.|Dr\.)\s*/i', '', $name);

            $candidate = $fec->findCandidate($searchName, 'PA', $fecOffice, $CYCLE_YEAR);

            if ($candidate && !empty($candidate['candidate_id'])) {
                $fecId = $candidate['candidate_id'];
                output("  Found FEC ID: $fecId");

                // Cache the ID
                $updateStmt = $db->prepare("UPDATE voices SET fec_candidate_id = ? WHERE id = ?");
                $updateStmt->execute([$fecId, $voiceId]);
            } else {
                output("  No FEC candidate found for: $searchName");
                continue;
            }
        } else {
            output("  Using cached FEC ID: $fecId");
        }

        // Step 2: Get financial totals
        output("  Fetching financial data...");
        $totals = $fec->getCandidateTotals($fecId, ['cycle' => $CYCLE_YEAR]);

        if (empty($totals['results'])) {
            output("  No financial data found for cycle $CYCLE_YEAR");
            // Mark as checked to avoid re-querying
            $updateStmt = $db->prepare("
                INSERT INTO campaign_finance (voice_id, cycle_year, source, fec_last_fetch)
                VALUES (?, ?, 'OpenFEC', NOW())
                ON DUPLICATE KEY UPDATE fec_last_fetch = NOW()
            ");
            $updateStmt->execute([$voiceId, $CYCLE_YEAR]);
            continue;
        }

        $data = $totals['results'][0];

        // Step 3: Get contribution breakdown by size to estimate small donors
        $smallDonors = 0;
        try {
            $bySize = $fec->getContributionsBySize([
                'candidate_id' => $fecId,
                'cycle' => $CYCLE_YEAR
            ]);
            if (!empty($bySize['results'])) {
                foreach ($bySize['results'] as $sizeData) {
                    // Small donors typically defined as $200 or less
                    if (isset($sizeData['size']) && $sizeData['size'] <= 200) {
                        $smallDonors += floatval($sizeData['total'] ?? 0);
                    }
                }
            }
        } catch (Exception $e) {
            output("  Warning: Could not fetch contribution breakdown");
        }

        // Map FEC fields to our schema
        $financeData = [
            'individual_contributions' => floatval($data['individual_contributions'] ?? 0),
            'pac_contributions' => floatval($data['other_political_committee_contributions'] ?? 0),
            'small_donors' => $smallDonors,
            'total_raised' => floatval($data['receipts'] ?? 0),
            'total_spent' => floatval($data['disbursements'] ?? 0),
            'cash_on_hand' => floatval($data['cash_on_hand_end_period'] ?? 0),
            'top_sector' => null,  // Would need additional API call
            'top_sector_amount' => 0
        ];

        output("  Total raised: $" . number_format($financeData['total_raised']));
        output("  Cash on hand: $" . number_format($financeData['cash_on_hand']));

        // Step 4: Upsert to database
        $upsertStmt = $db->prepare("
            INSERT INTO campaign_finance
                (voice_id, cycle_year, individual_contributions, pac_contributions, small_donors,
                 top_sector, top_sector_amount, total_raised, total_spent, cash_on_hand, source, fec_last_fetch)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OpenFEC', NOW())
            ON DUPLICATE KEY UPDATE
                individual_contributions = VALUES(individual_contributions),
                pac_contributions = VALUES(pac_contributions),
                small_donors = VALUES(small_donors),
                top_sector = VALUES(top_sector),
                top_sector_amount = VALUES(top_sector_amount),
                total_raised = VALUES(total_raised),
                total_spent = VALUES(total_spent),
                cash_on_hand = VALUES(cash_on_hand),
                source = 'OpenFEC',
                fec_last_fetch = NOW()
        ");

        $upsertStmt->execute([
            $voiceId,
            $CYCLE_YEAR,
            $financeData['individual_contributions'],
            $financeData['pac_contributions'],
            $financeData['small_donors'],
            $financeData['top_sector'],
            $financeData['top_sector_amount'],
            $financeData['total_raised'],
            $financeData['total_spent'],
            $financeData['cash_on_hand']
        ]);

        output("  Synced successfully!");
        $synced++;

    } catch (Exception $e) {
        output("  ERROR: " . $e->getMessage());
        $errors++;
    }
}

output("\n=== Sync Complete ===");
output("Synced: $synced");
output("Errors: $errors");

// Output JSON for API calls
if (php_sapi_name() !== 'cli') {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'synced' => $synced,
        'errors' => $errors,
        'total_processed' => count($officials)
    ]);
}
