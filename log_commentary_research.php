<?php
/**
 * Log CIVIQ Commentary Mode Research Findings
 * Run once to populate claude_learnings table
 */

require_once __DIR__ . '/api/config.php';

$db = getDB();

// Check if table exists
$stmt = $db->query("SHOW TABLES LIKE 'claude_learnings'");
if ($stmt->rowCount() === 0) {
    // Create table if it doesn't exist
    $db->exec("
        CREATE TABLE claude_learnings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            project VARCHAR(50) NOT NULL,
            category VARCHAR(50) NOT NULL,
            topic VARCHAR(100) NOT NULL,
            content TEXT NOT NULL,
            confidence DECIMAL(3,2) DEFAULT 0.50,
            source VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_project (project),
            INDEX idx_category (category),
            INDEX idx_topic (topic)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "Created claude_learnings table\n";
}

$findings = [
    // Platform Technical Findings
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'youtube_live_technical',
        'content' => 'Chrome tabCapture API works on YouTube. Extensions can capture video/audio from tabs. Content scripts exempt from CSP, allowing DOM injection. YouTube overlay policy prohibits overlays except for user consent or playback controls. Many existing YouTube-focused extensions demonstrate feasibility. Ad-blocker crackdown ongoing in 2025 but info overlays are different from ad-blocking. YouTube enforces minimum player size (200x200px) and prohibits nested iframes.',
        'confidence' => 0.85,
        'source' => 'Chrome Developer Docs, YouTube Developer Policies, Google Developer Documentation'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'youtube_live_political',
        'content' => 'YouTube dominates political livestreaming with 98% of viewership. 3.4 billion hours watched in Q1 2025 (56% YoY increase). Major news orgs (CNN, BBC, Al Jazeera, ABC) have 24/7 digital hubs. Political content now 11% of all streaming. Key political channels have massive audiences. Platform leans slightly right (28% vs 21% left among influencers, 46% neutral). Over 2.7 billion users globally.',
        'confidence' => 0.90,
        'source' => 'StreamsCharts Politics in Livestreaming Report, Tubefilter, Pew Research 2025'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'rumble_technical',
        'content' => 'Multiple Chrome extensions already exist for Rumble (Rumble Live Ops, ChatPlus, Rumble Tools, Rumble Routine). Uses standard web technologies, no known anti-extension measures. Rumble API available with key authentication for livestream detection and video management. DOM manipulation demonstrated in existing extensions. Offscreen parsing techniques used for data scraping. Extensions work in both LIVE Stream and Rumble Studio modes.',
        'confidence' => 0.80,
        'source' => 'Chrome Web Store, GitHub Rumble-Live-Ops, Pipedream Rumble API docs'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'rumble_political',
        'content' => 'Rumble is #2 platform for political content after YouTube. 76% of news users are Republican/lean Republican (22% Democrat). 48M monthly users as of 2025. Top creators: Dan Bongino (50K avg viewers). Over 3B views for right-leaning shows. CEO became billionaire Jan 2025 after 190% stock increase. Platform described as alt-tech haven for conservatives. Left-leaning shows have essentially no presence.',
        'confidence' => 0.90,
        'source' => 'Pew Research, Statista, Wikipedia, The Nation, Media Matters'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'twitch_technical',
        'content' => 'Twitch has OFFICIAL Extension API supporting video overlays and component extensions. Extensions run in sandboxed iframes with postMessage communication. Extension Helper JavaScript API provides hooks for visibility, authorization, minimize functions. Official developer documentation and tools available. Extensions must pass Twitch review. Overlay extensions display transparently on top of video. Heavy sandboxing and CSP constraints for security.',
        'confidence' => 0.95,
        'source' => 'Twitch Developer Documentation (dev.twitch.tv/docs/extensions/)'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'twitch_political',
        'content' => 'Hasan Piker (HasanAbi) ranked #5 on Twitch 2025, 24K avg viewers, 313K peak during Nov 2024 election. Political content nearly matches gaming volume on platform. 56% YoY increase in political viewership. Primarily left-leaning political streamers. Young, male audience. Less than half audience from US. Platform has suspended Hasan multiple times. Political content now 11%+ of all streaming industry.',
        'confidence' => 0.85,
        'source' => 'StreamsCharts, NBC News, CNN, Hasan Piker Wikipedia, Fourthwall'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'twitter_x_technical',
        'content' => 'DOM injection works on Twitter/X - OldTwitter extension demonstrates comprehensive DOM replacement including blocking React app from loading. Content scripts execute at document_start before Twitter scripts. DOMSubtreeModified listeners handle AJAX-loaded content. Multiple extensions (Xetter, video downloaders) work in 2025. Isolated world execution model. Spaces audio-only format limits video overlay value.',
        'confidence' => 0.75,
        'source' => 'GitHub OldTwitter/DeepWiki, Medium articles, Chrome Web Store'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'facebook_live_technical',
        'content' => 'CSP bypass techniques available for extensions (iframe approach, DOM injection). Content scripts exempt from page CSP. However, Facebook Live viewership down 90%+ from pandemic peak. Only 32.6M monthly watch hours vs Twitch 1.8B (55x less). Engagement still high (6x regular videos, 10x comments) but total audience small for live. 68% of Americans use Facebook, 30% get news there.',
        'confidence' => 0.70,
        'source' => 'DebugBear, Medium, Facebook Live Statistics 2025, GoodParty.org'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'tiktok_live_technical',
        'content' => 'TikTok employs aggressive anti-detection and fingerprinting. Anti-detect browsers (AdsPower, Dolphin{anty}) needed for multi-account management. Some Chrome extensions exist (AutoBlocker, TokAudit) suggesting DOM access possible. Mobile-first platform - most viewing on app not browser. 99.2% ban avoidance rate with specialized tools. High technical risk for extension development. Dolphin{tt} beta specifically for TikTok.',
        'confidence' => 0.60,
        'source' => 'TokAudit, Multilogin blog, AdsPower documentation'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'cspan_technical',
        'content' => 'C-SPAN requires TV provider authentication for live streams. Not a standard web player - uses authenticated streaming. Multiple PBS/C-SPAN YouTube channels exist which would be easier targets. Live Chat Overlay extension shows overlay patterns for streams. C-SPAN is nonprofit created by cable industry, no government funding. Better to target C-SPAN YouTube channel than cspan.org directly.',
        'confidence' => 0.70,
        'source' => 'C-SPAN FAQ, YouTube PBS channels, Chrome Web Store'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'newsmax_oan_technical',
        'content' => 'Both available on Pluto TV, YouTube, and other streaming services for free. Newsmax went public March 2025, stock up 700%+ to $234 (market cap nearly $30B, surpassing Fox). OAN added to Spectrum July 2025, Matt Gaetz hosting show Jan 2025. Average weekly Newsmax audience 319K. OAN much smaller (14K-500K range). Better to target their YouTube presence than native platforms. Kari Lake announced OAN news coverage for VOA May 2025.',
        'confidence' => 0.75,
        'source' => 'Wikipedia Newsmax/OAN, Statista, streaming guides, Fast Company'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'pbs_newshour_technical',
        'content' => 'PBS NewsHour posts all content to YouTube channel with live streams. Free PBS App available on all major platforms. Local stations (WITF, WOSU) also stream at 6pm. YouTube channel is primary vector for live political content. Can leverage YouTube extension work for PBS coverage. Previous 30 days of full episodes available on pbs.org.',
        'confidence' => 0.85,
        'source' => 'PBS website, How to Watch PBS NewsHour page, local station pages'
    ],

    // Competitor Extensions
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'ground_news_extension',
        'content' => 'Ground News extension shows other sources reporting same story when browsing news. Processes 60K articles daily from 50K sources. Uses AllSides, Ad Fontes Media, Media Bias Fact Check for bias ratings. Available for Chrome, Firefox, Edge, Brave, Opera. Integrates with social media (Reddit, X, Bluesky, LinkedIn, Facebook). Does NOT fact-check individual articles - only rates outlets. Founded 2018 by former NASA engineer. Users report reliability issues and logout problems.',
        'confidence' => 0.85,
        'source' => 'Ground News help docs, chrome-stats, StationX review, DePauw LibGuides'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'newsguard_extension',
        'content' => 'NewsGuard rates 35K+ news sources on 0-100 scale using 9 journalistic criteria. Team of experienced journalists, not AI. Covers 95% of online engagement in US, UK, Canada, Australia, NZ, France, Germany, Austria, Italy. Available as browser extension (Chrome, Edge, Firefox, Safari). Revenue from licensing to tech platforms, AI companies, advertisers, educational orgs. Extension is personal use only - commercial requires license. Found AI tools repeat false claims 35% of time (Aug 2025).',
        'confidence' => 0.85,
        'source' => 'NewsGuard FAQ, Wikipedia, chrome-stats, EUI Blogs'
    ],

    // Transcription APIs
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'transcription_api_comparison',
        'content' => 'Pricing: AssemblyAI $0.0025/min, Deepgram $0.0043/min, Whisper API $0.006/min. Latency: Deepgram <300ms streaming, AssemblyAI real-time optimized, Whisper 1-5s in many implementations. Deepgram transcribes 1hr audio in 20sec. Per-second billing (Deepgram, AssemblyAI) beats 15-sec blocks (AWS) by 36% on short utterances. Self-hosted Whisper effective cost >$1/hr vs Deepgram $0.46/hr due to GPU/DevOps overhead.',
        'confidence' => 0.90,
        'source' => 'Deepgram pricing guide, AssemblyAI blog, BrassTranscripts Whisper pricing 2025'
    ],
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'speaker_diarization_apis',
        'content' => 'AssemblyAI: 10.1% DER improvement, 13.2% cpWER improvement, 30% better in noisy environments, handles 250ms segments. Deepgram: 53% accuracy gains vs prior, 10x faster than competitors, 100K+ speaker training, 80+ languages. NVIDIA Streaming Sortformer: Open-source production-grade, low latency, frame-level diarization, 2-4+ speaker tracking. PyAnnote: Open-source, 10% DER, 2.5% real-time factor on GPU. Diart: Python framework for real-time AI audio, incremental clustering improves over time.',
        'confidence' => 0.85,
        'source' => 'AssemblyAI blog, Deepgram docs, NVIDIA Developer Blog, MarkTechPost, GitHub diart'
    ],

    // MVP Recommendation
    [
        'project' => 'civiq',
        'category' => 'research',
        'topic' => 'commentary_mode_mvp_recommendation',
        'content' => 'MVP RECOMMENDATION: Focus on YouTube (98% of political viewership), Rumble (#2 political platform, conservative audience, extension-friendly), and consider Twitch official extension API for left-leaning audience. YouTube alone covers PBS NewsHour, C-SPAN, NewsMax, OAN through their channels. Technical stack: Deepgram for real-time transcription (<300ms, $0.0043/min), AssemblyAI as backup with speaker diarization. Skip Facebook Live (viewership down 90%), TikTok (high ban risk, mobile-first), and Twitter/X Spaces (audio-only limits value).',
        'confidence' => 0.90,
        'source' => 'Aggregated research findings from StreamsCharts, Pew Research, platform documentation'
    ]
];

$inserted = 0;
$stmt = $db->prepare("
    INSERT INTO claude_learnings (project, category, topic, content, confidence, source)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    content = VALUES(content),
    confidence = VALUES(confidence),
    source = VALUES(source),
    updated_at = NOW()
");

foreach ($findings as $finding) {
    try {
        $stmt->execute([
            $finding['project'],
            $finding['category'],
            $finding['topic'],
            $finding['content'],
            $finding['confidence'],
            $finding['source']
        ]);
        $inserted++;
        echo "Inserted: {$finding['topic']}\n";
    } catch (PDOException $e) {
        echo "Error inserting {$finding['topic']}: " . $e->getMessage() . "\n";
    }
}

echo "\nTotal inserted/updated: $inserted findings\n";
echo "Research logged to claude_learnings table with project='civiq', category='research'\n";
