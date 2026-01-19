<?php
/**
 * OpenFECClient - FEC Campaign Finance API Client
 *
 * Provides access to Federal Election Commission data via api.open.fec.gov
 *
 * API Documentation: https://api.open.fec.gov/developers/
 * Rate Limits: Managed by API Umbrella (data.gov key required)
 *
 * Key Endpoints:
 * - /candidates/ - Candidate information
 * - /committees/ - Political action committees
 * - /schedules/schedule_a/ - Itemized receipts (donations)
 * - /schedules/schedule_b/ - Itemized disbursements (spending)
 * - /candidate/{candidate_id}/totals/ - Candidate financial summaries
 * - /committee/{committee_id}/totals/ - Committee financial summaries
 *
 * ID Formats:
 * - Candidate IDs: P00000001 (President), H0AK00097 (House), S0AL00109 (Senate)
 * - Committee IDs: C00401224
 *
 * @version 1.0.0
 * @created 2026-01-18
 */

class OpenFECClient {
    private $apiKey;
    private $baseUrl = 'https://api.open.fec.gov/v1';
    private $cache;
    private $cacheDir;
    private $cacheTtl = 3600; // 1 hour default cache

    /**
     * @param string $apiKey - data.gov API key
     * @param string|null $cacheDir - Directory for file-based caching
     */
    public function __construct($apiKey, $cacheDir = null) {
        $this->apiKey = $apiKey;
        $this->cacheDir = $cacheDir ?: sys_get_temp_dir() . '/openfec_cache';
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0755, true);
        }
    }

    /**
     * Make API request with caching and error handling
     */
    private function request($endpoint, $params = [], $cacheTtl = null) {
        $params['api_key'] = $this->apiKey;
        $url = $this->baseUrl . $endpoint . '?' . http_build_query($params);

        // Check cache
        $cacheKey = md5($url);
        $cacheFile = $this->cacheDir . '/' . $cacheKey . '.json';
        $ttl = $cacheTtl ?? $this->cacheTtl;

        if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $ttl) {
            $cached = json_decode(file_get_contents($cacheFile), true);
            if ($cached) {
                $cached['_cached'] = true;
                return $cached;
            }
        }

        // Make request
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new Exception("OpenFEC API curl error: $error");
        }

        if ($httpCode === 429) {
            throw new Exception("OpenFEC API rate limit exceeded");
        }

        if ($httpCode >= 400) {
            throw new Exception("OpenFEC API error: HTTP $httpCode");
        }

        $data = json_decode($response, true);
        if (!$data) {
            throw new Exception("OpenFEC API invalid JSON response");
        }

        // Cache successful response
        file_put_contents($cacheFile, $response);

        return $data;
    }

    // =========================================================================
    // CANDIDATES
    // =========================================================================

    /**
     * Search for candidates
     *
     * @param array $params - Filters:
     *   - name: Candidate name search
     *   - state: Two-letter state code
     *   - office: H (House), S (Senate), P (President)
     *   - party: DEM, REP, etc.
     *   - cycle: Election cycle (2024, 2026, etc.)
     *   - is_active_candidate: true/false
     *   - per_page: Results per page (max 100)
     *   - page: Page number
     */
    public function searchCandidates($params = []) {
        return $this->request('/candidates/', $params);
    }

    /**
     * Get candidate details by ID
     *
     * @param string $candidateId - e.g., P80001571 (Trump), P00009290 (Biden)
     */
    public function getCandidate($candidateId) {
        return $this->request('/candidate/' . urlencode($candidateId) . '/');
    }

    /**
     * Get candidate financial totals
     *
     * @param string $candidateId
     * @param array $params - cycle, full_election, etc.
     * @return array - total_receipts, total_disbursements, cash_on_hand, etc.
     */
    public function getCandidateTotals($candidateId, $params = []) {
        return $this->request('/candidate/' . urlencode($candidateId) . '/totals/', $params);
    }

    /**
     * Get candidate's principal campaign committee history
     */
    public function getCandidateCommittees($candidateId, $params = []) {
        return $this->request('/candidate/' . urlencode($candidateId) . '/committees/', $params);
    }

    // =========================================================================
    // COMMITTEES
    // =========================================================================

    /**
     * Search for committees (PACs, campaign committees, etc.)
     *
     * @param array $params - Filters:
     *   - q: Full-text search
     *   - committee_type: P (Presidential), H (House), S (Senate), etc.
     *   - designation: A (Authorized), J (Joint), P (Principal), etc.
     *   - state: Two-letter state code
     *   - party: DEM, REP, etc.
     */
    public function searchCommittees($params = []) {
        return $this->request('/committees/', $params);
    }

    /**
     * Get committee details
     */
    public function getCommittee($committeeId) {
        return $this->request('/committee/' . urlencode($committeeId) . '/');
    }

    /**
     * Get committee financial totals
     */
    public function getCommitteeTotals($committeeId, $params = []) {
        return $this->request('/committee/' . urlencode($committeeId) . '/totals/', $params);
    }

    // =========================================================================
    // CONTRIBUTIONS (Schedule A)
    // =========================================================================

    /**
     * Get itemized contributions (donations > $200)
     *
     * Note: Uses keyset pagination for large datasets
     *
     * @param array $params - Filters:
     *   - committee_id: Recipient committee
     *   - contributor_name: Donor name search
     *   - contributor_employer: Employer search
     *   - contributor_state: State code
     *   - min_amount, max_amount: Dollar range
     *   - two_year_transaction_period: 2024, 2026, etc.
     *   - sort: contribution_receipt_date, contribution_receipt_amount
     *   - per_page: Max 100
     */
    public function getContributions($params = []) {
        return $this->request('/schedules/schedule_a/', $params);
    }

    /**
     * Get contribution aggregates by contributor
     */
    public function getContributionsByContributor($params = []) {
        return $this->request('/schedules/schedule_a/by_contributor/', $params);
    }

    /**
     * Get contribution totals by size category
     */
    public function getContributionsBySize($params = []) {
        return $this->request('/schedules/schedule_a/by_size/', $params);
    }

    /**
     * Get contribution totals by state
     */
    public function getContributionsByState($params = []) {
        return $this->request('/schedules/schedule_a/by_state/', $params);
    }

    // =========================================================================
    // DISBURSEMENTS (Schedule B)
    // =========================================================================

    /**
     * Get itemized disbursements (expenditures)
     *
     * @param array $params - Filters:
     *   - committee_id: Spending committee
     *   - recipient_name: Payee search
     *   - purpose: Purpose description search
     *   - min_amount, max_amount: Dollar range
     */
    public function getDisbursements($params = []) {
        return $this->request('/schedules/schedule_b/', $params);
    }

    /**
     * Get disbursement totals by recipient
     */
    public function getDisbursementsByRecipient($params = []) {
        return $this->request('/schedules/schedule_b/by_recipient/', $params);
    }

    /**
     * Get disbursement totals by purpose
     */
    public function getDisbursementsByPurpose($params = []) {
        return $this->request('/schedules/schedule_b/by_purpose/', $params);
    }

    // =========================================================================
    // FILINGS
    // =========================================================================

    /**
     * Get FEC filings (Form 3, 3X, etc.)
     *
     * @param array $params - Filters:
     *   - committee_id, candidate_id
     *   - form_type: F3 (House/Senate), F3P (Presidential), F3X (PAC)
     *   - report_type: Q1, Q2, Q3, YE (quarterly/year-end)
     *   - is_amended: true/false
     */
    public function getFilings($params = []) {
        return $this->request('/filings/', $params);
    }

    /**
     * Get e-file data (recent ~4 months only)
     */
    public function getEfilings($params = []) {
        return $this->request('/efile/filings/', $params);
    }

    // =========================================================================
    // AGGREGATES & TOTALS
    // =========================================================================

    /**
     * Get election totals for candidates
     *
     * @param array $params - cycle, office, state, district
     */
    public function getElectionTotals($params = []) {
        return $this->request('/elections/', $params);
    }

    /**
     * Get communication costs (coordinated spending)
     */
    public function getCommunicationCosts($params = []) {
        return $this->request('/communication_costs/', $params);
    }

    /**
     * Get independent expenditures
     */
    public function getIndependentExpenditures($params = []) {
        return $this->request('/schedules/schedule_e/', $params);
    }

    // =========================================================================
    // HELPER METHODS
    // =========================================================================

    /**
     * Get all results using pagination
     * Warning: Can be slow/expensive for large datasets
     */
    public function getAllResults($method, $params = [], $maxPages = 10) {
        $results = [];
        $page = 1;

        while ($page <= $maxPages) {
            $params['page'] = $page;
            $params['per_page'] = 100;

            $response = call_user_func([$this, $method], $params);

            if (empty($response['results'])) {
                break;
            }

            $results = array_merge($results, $response['results']);

            if (count($response['results']) < 100) {
                break;
            }

            $page++;
        }

        return $results;
    }

    /**
     * Lookup candidate by name and state/office
     * Returns best match or null
     */
    public function findCandidate($name, $state = null, $office = null, $cycle = null) {
        $params = [
            'name' => $name,
            'per_page' => 10,
            'is_active_candidate' => true,
        ];

        if ($state) $params['state'] = $state;
        if ($office) $params['office'] = $office;
        if ($cycle) $params['cycle'] = $cycle;

        $result = $this->searchCandidates($params);

        return !empty($result['results']) ? $result['results'][0] : null;
    }

    /**
     * Get comprehensive financial summary for a candidate
     */
    public function getCandidateFinancialSummary($candidateId, $cycle = null) {
        $params = $cycle ? ['cycle' => $cycle] : [];

        $candidate = $this->getCandidate($candidateId);
        $totals = $this->getCandidateTotals($candidateId, $params);
        $committees = $this->getCandidateCommittees($candidateId);

        return [
            'candidate' => $candidate['results'][0] ?? null,
            'financial_totals' => $totals['results'][0] ?? null,
            'committees' => $committees['results'] ?? [],
        ];
    }

    /**
     * Clear cache
     */
    public function clearCache() {
        $files = glob($this->cacheDir . '/*.json');
        foreach ($files as $file) {
            unlink($file);
        }
    }
}
