<?php
// Log CIVIQ API Research to claude_learnings database

$host = 'localhost';
$dbname = 'lom1ubvhoxxi_sud_claude';
$username = 'lom1ubvhoxxi_claude';
$password = 'SLyb24sfbl5wJ';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    $learnings = [
        // GOOGLE APIs
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Civic Information API',
            'content' => 'FREE: 25,000 queries/day, 2,500 queries per 100 seconds. IMPORTANT: Representatives API discontinued April 2025 - use Ballotpedia/Cicero alternatives. New Divisions API can lookup OCD-IDs for address. Cache voting locations <24hrs, office holders <30 days. Source: developers.google.com/civic-information',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Maps Platform 2025',
            'content' => 'New pricing March 2025: Free limits per API (Essentials: 10K/month, Map Tiles: 100K/month). Geocoding Essentials: 10K free. Places Text Search Pro: 5K free. Pay-as-you-go $2-30 per 1K requests depending on service. Volume discounts up to 80% at 5M+ calls. Legacy APIs (Places, Directions, Distance Matrix) limited to 100K discounts. Source: mapsplatform.google.com/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Cloud Natural Language API',
            'content' => 'FREE: First 5K requests/month (30K for text classification). $0.0005-0.002/request depending on feature. Pricing per 1000 Unicode chars. Features: sentiment analysis, entity extraction, syntax, classification, content moderation. annotateText method charged per feature requested. Source: cloud.google.com/natural-language/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Custom Search API',
            'content' => 'FREE: 100 queries/day per project. Paid: $5 per 1000 queries with no daily limit. Limited to 100 results per query. Site Restricted JSON API deprecated Jan 2025. Source: developers.google.com/custom-search',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Workspace APIs',
            'content' => 'Workspace plans: Starter $7-8.40/user/mo, Standard $14-16.80, Plus $22-26.40, Enterprise custom. 2025 includes Gemini AI integration. APIs for Gmail, Drive, Sheets, Calendar included with subscription. Volume discounts 25+ users. Source: workspace.google.com/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'YouTube Data API v3',
            'content' => 'FREE but quota-based: Default 10K units/day. Costs: search=100 units, video details=1 unit, upload=1600 units. Resets midnight PT. Higher quotas require compliance audit. No direct cost but quota is the currency. Source: developers.google.com/youtube/v3',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Firebase Services 2025',
            'content' => 'Spark (FREE): Auth unlimited for email/social (phone: 10K/mo), Firestore: 1GB storage + 50K reads + 20K writes + 20K deletes per day, Functions: 2M invocations/mo. Blaze pay-as-you-go: Auth $0.0055/MAU after 50K, Firestore $0.18/100K operations, Functions $0.40/M invocations. Source: firebase.google.com/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Cloud Pub/Sub',
            'content' => 'FREE: First 10GB/month. Then $40/TiB. BigQuery/Cloud Storage subscriptions $50/TiB. Storage: $0.27/GiB-month. Pub/Sub Lite deprecated March 2026. Source: cloud.google.com/pubsub/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Cloud Functions 2025',
            'content' => 'FREE: 2M invocations/mo, 180K vCPU-seconds, 360K GiB-seconds. Now follows Cloud Run pricing. Main cost driver is CPU/GB-seconds not invocations. Scale-to-zero supported. Source: cloud.google.com/functions',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Cloud Speech-to-Text',
            'content' => 'FREE: 60 minutes/month. Standard: $0.016-0.024/min. Enhanced: $0.036/min. Batch processing: $0.004/min discounted. V2 API with Chirp model available. Data logging opt-out adds 40%. $300 new customer credits. Source: cloud.google.com/speech-to-text/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Cloud Vision API',
            'content' => 'FREE: First 1K pages/month. Then $1.50/1K up to 5M, $0.60/1K after. Web detection $3.50/1K. Object localization $2.25/1K. Document AI: Form Parser $30/1K pages. Vision OCR On-Prem deprecated Sept 2025. Source: cloud.google.com/vision/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Knowledge Graph API',
            'content' => 'FREE: 100K queries/day per project. Pay-as-you-go for higher usage. Basic vs Advanced editions - Advanced for enterprise/production. Volume discounts available for high-volume users. Source: developers.google.com/knowledge-graph',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Gemini API 2025',
            'content' => 'FREE tier (AI Studio): No credit card needed. Dec 2025 changes: 2.5 Pro 50 req/day, 2.5 Flash 20 req/day, Flash-Lite 1K req/day. Paid: Flash-Lite $0.10/M tokens, Flash $0.30/M input + $2.50/M output, 3 Pro Preview $2/M input + $12/M output. Grounding with Search: 1500 free/day then $35/1K. Source: ai.google.dev/gemini-api/docs/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Google Cloud Translation API',
            'content' => 'FREE: 500K chars/month (Basic+Advanced combined, never expires). Paid: $20/M chars for both v2 Basic and v3 Advanced. Document translation $0.08-0.25/page. Custom model training $45/hr (max $300/job). Supports 100+ languages. Source: cloud.google.com/translate/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Mapbox vs Google Maps Comparison',
            'content' => 'Mapbox FREE: 50K web loads/mo, 25K mobile MAU. Directions: 100K free then $2/1K. Better for customization, AR, offline maps. Google better for data accuracy, Street View. Google more expensive at scale. Mapbox 0.9% market share vs Google 61%. Both complex pricing. Source: mapbox.com, radar.com/blog',
        ],

        // NON-GOOGLE CIVIC/POLITICAL APIs
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Deepgram Speech API',
            'content' => 'FREE: $150 credits to start (no CC). Nova-3: $0.0077/min PAYG, $0.0065/min Growth. Per-second billing. Speaker diarization extra. Voice Agent API $4.50/hr. Supports 30+ languages. Cheaper than Google STT at scale ($3.60 vs $4.00 per 1K min at high volume). Source: deepgram.com/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'OpenSecrets API - DISCONTINUED',
            'content' => 'API DISCONTINUED as of April 15, 2025. Was free for non-commercial use, 200 calls/day. Alternative: Bulk data still available free for educational use. Contact data@opensecrets.org for custom solutions. Data includes campaign finance, lobbying, personal financial disclosures. Source: opensecrets.org/open-data',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'ProPublica Congress API - DISCONTINUED',
            'content' => 'API NO LONGER AVAILABLE. Repository archived Feb 4, 2025. Was free with 5K requests/day limit. Covered House, Senate, Library of Congress data. Alternative: Use official Congress.gov API instead. Source: github.com/propublica/congress-api-docs',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'FEC OpenFEC API',
            'content' => 'FREE government API for federal election commission data. Uses API Umbrella for rate limiting/caching. Responses cached 1 hour. Data includes campaign finance filings, candidates, committees, itemized contributions. Sign up at api.open.fec.gov. Source: api.open.fec.gov',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Ballotpedia API',
            'content' => 'PAID subscription service - contact data@ballotpedia.org for rate card. Reportedly thousands $/month for full API. Cheapest option: one-time CSV dump $600. Annual subscriptions available. Most comprehensive ballot/election data. Covers federal, state, local races. Source: ballotpedia.org/Ballotpedia:Buy_Political_Data',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Vote Smart API',
            'content' => 'Registration required for pricing info. 32 years of political data. Includes bios, voting records, ballot measures, zip-to-district matching, interest group ratings. Endorsement data and public statements as paid add-ons. REST API returns XML/JSON. Source: votesmart.org/share/api',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'GovTrack API - ENDING',
            'content' => 'Bulk data and API terminating Summer 2025. GovTrack pioneered open legislative data in 2005. Recommends using official Congress.gov API now. Congress-legislators GitHub project continues for legislator data. Source: congressionaldata.org',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'OpenStates API (Plural Policy)',
            'content' => 'API v3 at v3.openstates.org. Covers all 50 states + DC + Puerto Rico. API key required via open.pluralpolicy.com. Bulk downloads available. Moved under Plural Open in 2023. Emphasizes free democracy tools. Specific pricing tiers not publicly documented. Source: docs.openstates.org/api-v3',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'LegiScan API',
            'content' => 'FREE Public tier: 30K queries/month. Pull subscription: 100K-250K queries/month. Push Enterprise: full database replication every 4hrs (or 15min). Annual pricing based on # of states. 501(c) nonprofits get discounts. Registration free. Source: legiscan.com/legiscan',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Congress.gov Official API',
            'content' => 'FREE: 5K requests/hour. API key from Data.gov signup. Returns XML/JSON. Version 3 current. Default 20 results (max 250). Covers bills, amendments, congresses, members, reports, nominations, treaties. GitHub repo with Python/Java samples. Source: api.congress.gov',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'NewsAPI.org',
            'content' => 'FREE tier for development/testing. Paid plans available. Popular for news aggregation. Check newsapi.org/pricing for current limits. Source: newsapi.org/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'NewsAPI.ai',
            'content' => 'FREE: 2K tokens, no CC needed. Full-text access even on free tier. 30-day historical limit on free. Includes entities, events, sentiment, clustering. Extra tokens $0.015 each. Source: newsapi.ai/plans',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'NewsData.io',
            'content' => 'FREE: 200 credits/day (10 articles/credit). 12hr delay, 100 char keyword limit, no full content. Can use commercially. Paid plans remove limitations. Source: newsdata.io/blog/pricing-plan',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'MediaStack API',
            'content' => 'FREE: 100 requests/month with 30-min delay. Basic $24.99/mo: 10K calls, real-time. Professional $59.99/mo: 50K calls. Business: 250K calls. 7,500+ global sources. Overage fees apply. Source: mediastack.com/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'Cicero API (Melissa)',
            'content' => 'PAID: ~3-4 cents per address lookup, volume discounts. FREE trial: 1K credits, 90 days. Credits last 1 year. NPO/Gov/Edu discounts. Covers districts (geographic + judicial/police), elected officials, elections. 1M+ calls = custom pricing. Acquired by Melissa 2024. Source: cicerodata.com/pricing',
        ],
        [
            'project' => 'civiq',
            'category' => 'api_knowledge',
            'source' => 'web_research',
            'title' => 'CIVIQ API Strategy Summary',
            'content' => 'BEST FREE OPTIONS: Congress.gov API (5K/hr), FEC API (free gov data), LegiScan (30K/mo), Google Civic (25K/day but reps discontinued). PAID ALTERNATIVES: Cicero for district lookup (Google Civic replacement), Ballotpedia for comprehensive ballot data, Deepgram over Google STT. NEWS: NewsAPI.ai best free, MediaStack for volume. DISCONTINUED: OpenSecrets API, ProPublica Congress API, GovTrack API. Research date: January 2026.',
        ]
    ];

    $sql = "INSERT INTO claude_learnings (project, category, source, title, content, created_at)
            VALUES (:project, :category, :source, :title, :content, NOW())";

    $stmt = $pdo->prepare($sql);
    $inserted = 0;

    foreach ($learnings as $learning) {
        try {
            $stmt->execute($learning);
            $inserted++;
            echo "Inserted: {$learning['title']}\n";
        } catch (PDOException $e) {
            echo "Error inserting {$learning['title']}: {$e->getMessage()}\n";
        }
    }

    echo "\n=== COMPLETE ===\n";
    echo "Total records inserted: $inserted\n";

} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
