<?php
/**
 * CIVIQ Officials API
 * GET /api/civic/officials
 *
 * Returns elected officials for display on the Leaders screen.
 * Filtered by user's county to show only relevant representatives.
 *
 * Query params:
 *   county_id - User's county (required for proper filtering)
 *
 * Returns: {
 *   success,
 *   officials: {
 *     federal: [],
 *     state: { direct: [], other: [] },  // direct = user's reps, other = rest of PA
 *     local: []
 *   }
 * }
 */

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();

// Get user's county from request - REQUIRED for proper filtering
// Default to Luzerne County (id=1) for now until user auth is implemented
$countyId = isset($_GET['county_id']) ? (int)$_GET['county_id'] : 1;

// Get legislative districts for user's county
// IMPORTANT: Until we have address-level precision, pick only ONE district per type
// This is a temporary simplification - eventually users will have specific district assignments
$userDistricts = [
    'house' => [],
    'senate' => [],
    'congressional' => []
];

$districtStmt = $db->prepare("
    SELECT district_type, MIN(district_number) as district_number
    FROM pa_legislative_districts
    WHERE county_id = ?
    GROUP BY district_type
");
$districtStmt->execute([$countyId]);
$districts = $districtStmt->fetchAll();

foreach ($districts as $d) {
    // Only store ONE district per type (the first/smallest number as default)
    $userDistricts[$d['district_type']][] = (int)$d['district_number'];
}

// Query ALL officials first
$stmt = $db->query("
    SELECT
        u.id,
        u.display_name as name,
        u.party,
        u.avatar_url,
        v.office_level as level,
        v.office_title as title,
        v.district,
        v.term_start,
        v.next_election,
        v.party_vote_pct,
        v.approval_rating,
        v.lcv_score,
        v.credentials,
        v.lean_score,
        v.tier,
        v.twitter_handle,
        v.website_url,
        v.county_id
    FROM users u
    JOIN voices v ON u.id = v.user_id
    WHERE v.is_elected_official = 1
    ORDER BY
        FIELD(v.office_level, 'federal', 'state', 'local'),
        v.tier DESC,
        v.next_election ASC,
        u.display_name ASC
");
$allOfficials = $stmt->fetchAll();

// Get committee assignments for all officials
$committeeStmt = $db->query("
    SELECT
        v.user_id,
        ca.committee_name,
        ca.committee_type,
        ca.role,
        ca.chamber,
        ca.level
    FROM committee_assignments ca
    JOIN voices v ON v.id = ca.voice_id
    WHERE ca.is_current = 1
    ORDER BY
        FIELD(ca.role, 'chair', 'vice_chair', 'ranking_member', 'member'),
        ca.committee_name
");
$allCommittees = $committeeStmt->fetchAll();

// Index committees by user_id
$committeesByUser = [];
foreach ($allCommittees as $c) {
    $userId = $c['user_id'];
    if (!isset($committeesByUser[$userId])) {
        $committeesByUser[$userId] = [];
    }
    $committeesByUser[$userId][] = [
        'name' => $c['committee_name'],
        'type' => $c['committee_type'],
        'role' => $c['role'],
        'chamber' => $c['chamber'],
        'level' => $c['level']
    ];
}

// Get organization affiliations for all officials
$orgStmt = $db->query("
    SELECT
        v.user_id,
        oa.organization_name,
        oa.organization_type,
        oa.relationship
    FROM organization_affiliations oa
    JOIN voices v ON v.id = oa.voice_id
    WHERE oa.is_current = 1
    ORDER BY
        FIELD(oa.relationship, 'president', 'officer', 'board_member', 'founder', 'endorsed_by', 'member'),
        oa.organization_name
");
$allOrgs = $orgStmt->fetchAll();

// Index orgs by user_id
$orgsByUser = [];
foreach ($allOrgs as $o) {
    $userId = $o['user_id'];
    if (!isset($orgsByUser[$userId])) {
        $orgsByUser[$userId] = [];
    }
    $orgsByUser[$userId][] = [
        'name' => $o['organization_name'],
        'type' => $o['organization_type'],
        'relationship' => $o['relationship']
    ];
}

// Get campaign finance data for all officials
$financeStmt = $db->query("
    SELECT
        v.user_id,
        cf.cycle_year,
        cf.individual_contributions,
        cf.pac_contributions,
        cf.small_donors,
        cf.top_sector,
        cf.top_sector_amount,
        cf.total_raised,
        cf.total_spent,
        cf.cash_on_hand,
        cf.source
    FROM campaign_finance cf
    JOIN voices v ON cf.voice_id = v.id
    WHERE cf.cycle_year = 2024
");
$allFinance = $financeStmt->fetchAll();

// Index finance by user_id
$financeByUser = [];
foreach ($allFinance as $f) {
    $financeByUser[$f['user_id']] = [
        'cycleYear' => (int)$f['cycle_year'],
        'individualContributions' => (float)$f['individual_contributions'],
        'pacContributions' => (float)$f['pac_contributions'],
        'smallDonors' => (float)$f['small_donors'],
        'topSector' => $f['top_sector'],
        'topSectorAmount' => (float)$f['top_sector_amount'],
        'totalRaised' => (float)$f['total_raised'],
        'totalSpent' => (float)$f['total_spent'],
        'cashOnHand' => (float)$f['cash_on_hand'],
        'source' => $f['source']
    ];
}

// Get recent voting records for all officials
$votesStmt = $db->query("
    SELECT
        v.user_id,
        vr.bill_name,
        vr.bill_number,
        vr.vote_date,
        vr.vote,
        vr.chamber
    FROM voting_records vr
    JOIN voices v ON vr.voice_id = v.id
    ORDER BY vr.vote_date DESC
");
$allVotes = $votesStmt->fetchAll();

// Index votes by user_id (keep only 3 most recent per user)
$votesByUser = [];
foreach ($allVotes as $vote) {
    $userId = $vote['user_id'];
    if (!isset($votesByUser[$userId])) {
        $votesByUser[$userId] = [];
    }
    if (count($votesByUser[$userId]) < 3) {
        $votesByUser[$userId][] = [
            'billName' => $vote['bill_name'],
            'billNumber' => $vote['bill_number'],
            'voteDate' => $vote['vote_date'],
            'vote' => $vote['vote'],
            'chamber' => $vote['chamber']
        ];
    }
}

// Define statewide offices that show for everyone
$statewideOffices = [
    'Governor of Pennsylvania',
    'Lt. Governor of Pennsylvania',
    'Lieutenant Governor of Pennsylvania',
    'Attorney General',
    'Auditor General',
    'State Treasurer'
];

// Group officials
$grouped = [
    'federal' => [],
    'state' => [
        'direct' => [],  // User's direct representatives
        'other' => []    // Other state officials (for accordion)
    ],
    'local' => []
];

$currentYear = (int)date('Y');

foreach ($allOfficials as $official) {
    $level = $official['level'] ?? 'state';
    $officialId = (int)$official['id'];
    $title = $official['title'];
    $district = $official['district'] ? (int)$official['district'] : null;
    $officialCountyId = $official['county_id'] ? (int)$official['county_id'] : null;

    // Calculate years served
    $yearsServed = null;
    if ($official['term_start']) {
        $yearsServed = $currentYear - (int)$official['term_start'];
    }

    // Determine if up for election soon (within 2 years)
    $upForElection = false;
    if ($official['next_election']) {
        $upForElection = ((int)$official['next_election'] - $currentYear) <= 1;
    }

    // Build display role with district if applicable
    $displayRole = $title;
    if ($district) {
        $displayRole .= ' - District ' . $district;
    }

    // Get committees, orgs, finance, and votes for this official
    $committees = $committeesByUser[$officialId] ?? [];
    $organizations = $orgsByUser[$officialId] ?? [];
    $campaignFinance = $financeByUser[$officialId] ?? null;
    $votingRecords = $votesByUser[$officialId] ?? [];

    $formattedOfficial = [
        'id' => $officialId,
        'name' => $official['name'],
        'party' => $official['party'],
        'avatarUrl' => $official['avatar_url'],
        'title' => $title,
        'displayRole' => $displayRole,
        'district' => $district,
        'termStart' => $official['term_start'] ? (int)$official['term_start'] : null,
        'nextElection' => $official['next_election'] ? (int)$official['next_election'] : null,
        'yearsServed' => $yearsServed,
        'upForElection' => $upForElection,
        'partyVotePct' => $official['party_vote_pct'] ? (float)$official['party_vote_pct'] : null,
        'approvalRating' => $official['approval_rating'] ? (float)$official['approval_rating'] : null,
        'lcvScore' => $official['lcv_score'] ? (int)$official['lcv_score'] : null,
        'credentials' => $official['credentials'],
        'leanScore' => $official['lean_score'] ? (float)$official['lean_score'] : null,
        'tier' => $official['tier'],
        'twitter' => $official['twitter_handle'],
        'website' => $official['website_url'],
        'committees' => $committees,
        'committeeCount' => count($committees),
        'organizations' => $organizations,
        'organizationCount' => count($organizations),
        'campaignFinance' => $campaignFinance,
        'votingRecords' => $votingRecords
    ];

    // Route to appropriate group
    if ($level === 'federal') {
        // Federal officials - only show if congressional district matches user's
        $isCongressional = stripos($title, 'Representative') !== false ||
                           stripos($title, 'Congressman') !== false ||
                           stripos($title, 'Congresswoman') !== false;
        $isSenator = stripos($title, 'Senator') !== false;

        // US Senators represent entire state - always show
        if ($isSenator) {
            $grouped['federal'][] = $formattedOfficial;
        }
        // US Representatives - only show if district matches
        elseif ($isCongressional && $district) {
            if (in_array($district, $userDistricts['congressional'])) {
                $grouped['federal'][] = $formattedOfficial;
            }
        }
        // Other federal (President, VP, etc.) - show all
        elseif (!$isCongressional && !$isSenator) {
            $grouped['federal'][] = $formattedOfficial;
        }
    }
    elseif ($level === 'local') {
        // Local officials - ONLY show if county matches exactly
        if ($officialCountyId === $countyId) {
            $grouped['local'][] = $formattedOfficial;
        }
    }
    elseif ($level === 'state') {
        // Determine if this is user's direct representative or "other"
        $isDirect = false;

        // Statewide offices show for everyone as "direct"
        if (in_array($title, $statewideOffices)) {
            $isDirect = true;
        }
        // State representatives - check if district matches user's districts
        elseif ($district) {
            // Check if this is a house or senate district
            $isHouseRep = stripos($title, 'Representative') !== false;
            $isSenator = stripos($title, 'Senator') !== false;

            if ($isHouseRep && in_array($district, $userDistricts['house'])) {
                $isDirect = true;
            }
            elseif ($isSenator && in_array($district, $userDistricts['senate'])) {
                $isDirect = true;
            }
        }

        if ($isDirect) {
            $grouped['state']['direct'][] = $formattedOfficial;
        } else {
            $grouped['state']['other'][] = $formattedOfficial;
        }
    }
}

jsonResponse([
    'success' => true,
    'officials' => $grouped,
    'counts' => [
        'federal' => count($grouped['federal']),
        'stateDirectCount' => count($grouped['state']['direct']),
        'stateOtherCount' => count($grouped['state']['other']),
        'local' => count($grouped['local']),
        'total' => count($allOfficials)
    ],
    'userDistricts' => $userDistricts
]);
