<?php
/**
 * CongressClient - Congress.gov API Client
 *
 * Provides access to official congressional data via api.congress.gov
 *
 * API Documentation: https://api.congress.gov/
 * GitHub: https://github.com/LibraryOfCongress/api.congress.gov
 *
 * Rate Limits: 5000 requests per hour (with API key)
 * Base URL: https://api.congress.gov/v3
 *
 * Key Endpoints:
 * - /member - Current and historical members of Congress
 * - /bill - Legislation details and status
 * - /amendment - Bill amendments
 * - /summaries - Bill summaries by CRS
 * - /committee - Congressional committees
 * - /nomination - Presidential nominations
 * - /treaty - Treaties
 *
 * Response Formats: JSON (default), XML
 *
 * @version 1.0.0
 * @created 2026-01-18
 */

class CongressClient {
    private $apiKey;
    private $baseUrl = 'https://api.congress.gov/v3';
    private $cacheDir;
    private $cacheTtl = 3600; // 1 hour default

    /**
     * @param string $apiKey - api.data.gov API key
     * @param string|null $cacheDir - Cache directory
     */
    public function __construct($apiKey, $cacheDir = null) {
        $this->apiKey = $apiKey;
        $this->cacheDir = $cacheDir ?: sys_get_temp_dir() . '/congress_cache';
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0755, true);
        }
    }

    /**
     * Make API request
     */
    private function request($endpoint, $params = [], $cacheTtl = null) {
        $params['api_key'] = $this->apiKey;
        $params['format'] = 'json';

        $url = $this->baseUrl . $endpoint;
        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }

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
            throw new Exception("Congress API curl error: $error");
        }

        if ($httpCode === 429) {
            throw new Exception("Congress API rate limit exceeded (5000/hour)");
        }

        if ($httpCode >= 400) {
            throw new Exception("Congress API error: HTTP $httpCode");
        }

        $data = json_decode($response, true);
        if (!$data) {
            throw new Exception("Congress API invalid JSON response");
        }

        // Cache successful response
        file_put_contents($cacheFile, $response);

        return $data;
    }

    // =========================================================================
    // MEMBERS
    // =========================================================================

    /**
     * Get list of members of Congress
     *
     * @param array $params:
     *   - currentMember: true/false
     *   - limit: Results per page (20-250)
     *   - offset: Pagination offset
     */
    public function getMembers($params = []) {
        return $this->request('/member', $params);
    }

    /**
     * Get members by Congress number
     *
     * @param int $congress - Congress number (e.g., 118 for 2023-2024)
     */
    public function getMembersByCongress($congress, $params = []) {
        return $this->request("/member/congress/{$congress}", $params);
    }

    /**
     * Get members by state
     *
     * @param string $stateCode - Two-letter state code
     */
    public function getMembersByState($stateCode, $params = []) {
        $params['stateCode'] = $stateCode;
        return $this->request("/member", $params);
    }

    /**
     * Get members by state and district (House)
     *
     * @param string $stateCode
     * @param int $district
     */
    public function getMembersByDistrict($stateCode, $district, $params = []) {
        return $this->request("/member/state/{$stateCode}/district/{$district}", $params);
    }

    /**
     * Get member details by Bioguide ID
     *
     * @param string $bioguideId - e.g., "P000197" (Pelosi), "M000355" (McConnell)
     */
    public function getMember($bioguideId) {
        return $this->request("/member/{$bioguideId}");
    }

    /**
     * Get bills sponsored by a member
     */
    public function getMemberSponsoredLegislation($bioguideId, $params = []) {
        return $this->request("/member/{$bioguideId}/sponsored-legislation", $params);
    }

    /**
     * Get bills cosponsored by a member
     */
    public function getMemberCosponsoredLegislation($bioguideId, $params = []) {
        return $this->request("/member/{$bioguideId}/cosponsored-legislation", $params);
    }

    // =========================================================================
    // BILLS
    // =========================================================================

    /**
     * Get bills
     *
     * @param array $params:
     *   - limit: Results per page
     *   - offset: Pagination offset
     */
    public function getBills($params = []) {
        return $this->request('/bill', $params);
    }

    /**
     * Get bills by Congress
     *
     * @param int $congress - Congress number
     */
    public function getBillsByCongress($congress, $params = []) {
        return $this->request("/bill/{$congress}", $params);
    }

    /**
     * Get bills by Congress and type
     *
     * @param int $congress
     * @param string $billType - hr, s, hjres, sjres, hconres, sconres, hres, sres
     */
    public function getBillsByType($congress, $billType, $params = []) {
        return $this->request("/bill/{$congress}/{$billType}", $params);
    }

    /**
     * Get specific bill
     *
     * @param int $congress
     * @param string $billType
     * @param int $billNumber
     */
    public function getBill($congress, $billType, $billNumber) {
        return $this->request("/bill/{$congress}/{$billType}/{$billNumber}");
    }

    /**
     * Get bill actions (legislative history)
     */
    public function getBillActions($congress, $billType, $billNumber, $params = []) {
        return $this->request("/bill/{$congress}/{$billType}/{$billNumber}/actions", $params);
    }

    /**
     * Get bill cosponsors
     */
    public function getBillCosponsors($congress, $billType, $billNumber, $params = []) {
        return $this->request("/bill/{$congress}/{$billType}/{$billNumber}/cosponsors", $params);
    }

    /**
     * Get bill text versions
     */
    public function getBillText($congress, $billType, $billNumber, $params = []) {
        return $this->request("/bill/{$congress}/{$billType}/{$billNumber}/text", $params);
    }

    /**
     * Get bill subjects
     */
    public function getBillSubjects($congress, $billType, $billNumber, $params = []) {
        return $this->request("/bill/{$congress}/{$billType}/{$billNumber}/subjects", $params);
    }

    /**
     * Get related bills
     */
    public function getRelatedBills($congress, $billType, $billNumber, $params = []) {
        return $this->request("/bill/{$congress}/{$billType}/{$billNumber}/relatedbills", $params);
    }

    // =========================================================================
    // SUMMARIES
    // =========================================================================

    /**
     * Get bill summaries (written by CRS)
     */
    public function getSummaries($params = []) {
        return $this->request('/summaries', $params);
    }

    /**
     * Get summaries by Congress
     */
    public function getSummariesByCongress($congress, $params = []) {
        return $this->request("/summaries/{$congress}", $params);
    }

    // =========================================================================
    // AMENDMENTS
    // =========================================================================

    /**
     * Get amendments
     */
    public function getAmendments($params = []) {
        return $this->request('/amendment', $params);
    }

    /**
     * Get amendments by Congress
     */
    public function getAmendmentsByCongress($congress, $params = []) {
        return $this->request("/amendment/{$congress}", $params);
    }

    /**
     * Get specific amendment
     */
    public function getAmendment($congress, $amendmentType, $amendmentNumber) {
        return $this->request("/amendment/{$congress}/{$amendmentType}/{$amendmentNumber}");
    }

    // =========================================================================
    // COMMITTEES
    // =========================================================================

    /**
     * Get committees
     */
    public function getCommittees($params = []) {
        return $this->request('/committee', $params);
    }

    /**
     * Get committees by chamber
     *
     * @param string $chamber - house, senate, joint
     */
    public function getCommitteesByChamber($chamber, $params = []) {
        return $this->request("/committee/{$chamber}", $params);
    }

    /**
     * Get specific committee
     */
    public function getCommittee($chamber, $committeeCode) {
        return $this->request("/committee/{$chamber}/{$committeeCode}");
    }

    // =========================================================================
    // NOMINATIONS
    // =========================================================================

    /**
     * Get nominations
     */
    public function getNominations($params = []) {
        return $this->request('/nomination', $params);
    }

    /**
     * Get nominations by Congress
     */
    public function getNominationsByCongress($congress, $params = []) {
        return $this->request("/nomination/{$congress}", $params);
    }

    // =========================================================================
    // TREATIES
    // =========================================================================

    /**
     * Get treaties
     */
    public function getTreaties($params = []) {
        return $this->request('/treaty', $params);
    }

    /**
     * Get treaties by Congress
     */
    public function getTreatiesByCongress($congress, $params = []) {
        return $this->request("/treaty/{$congress}", $params);
    }

    // =========================================================================
    // CONGRESS INFO
    // =========================================================================

    /**
     * Get list of all Congresses
     */
    public function getCongresses($params = []) {
        return $this->request('/congress', $params);
    }

    /**
     * Get specific Congress info
     */
    public function getCongress($congress) {
        return $this->request("/congress/{$congress}");
    }

    /**
     * Get current Congress number
     */
    public function getCurrentCongressNumber() {
        // 118th Congress: Jan 2023 - Jan 2025
        // 119th Congress: Jan 2025 - Jan 2027
        $year = (int)date('Y');
        return 118 + floor(($year - 2023) / 2);
    }

    // =========================================================================
    // HELPER METHODS
    // =========================================================================

    /**
     * Search for member by name
     */
    public function findMember($name, $state = null, $chamber = null) {
        $params = ['limit' => 250, 'currentMember' => true];
        $members = $this->getMembers($params);

        if (empty($members['members'])) {
            return null;
        }

        $name = strtolower($name);
        $matches = [];

        foreach ($members['members'] as $member) {
            $fullName = strtolower($member['name'] ?? '');
            if (strpos($fullName, $name) !== false) {
                if ($state && ($member['state'] ?? '') !== $state) {
                    continue;
                }
                $matches[] = $member;
            }
        }

        return !empty($matches) ? $matches[0] : null;
    }

    /**
     * Get comprehensive member profile
     */
    public function getMemberProfile($bioguideId) {
        $member = $this->getMember($bioguideId);
        $sponsored = $this->getMemberSponsoredLegislation($bioguideId, ['limit' => 20]);
        $cosponsored = $this->getMemberCosponsoredLegislation($bioguideId, ['limit' => 20]);

        return [
            'member' => $member['member'] ?? null,
            'sponsored_legislation' => $sponsored['sponsoredLegislation'] ?? [],
            'cosponsored_legislation' => $cosponsored['cosponsoredLegislation'] ?? [],
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
