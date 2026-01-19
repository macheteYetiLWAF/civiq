# CIVIQ Project

**URL:** https://fitaf570.com/sud/claude/civiq/
**Wireframes:** https://fitaf570.com/sud/claude/civiq/wireframes/

---

## Mission & Conceptual Framework

### Mission Statement
CIVIQ is a civic engagement platform that delivers hyper-local political news with AI-powered bias transparency, enabling verified voters to make informed decisions about their representatives from school board to federal office.

### Core Problem
No platform covers local politics (school boards, city councils, sheriffs) with bias transparency. National news dominates while local democracy operates in the dark. Existing bias tools are either partisan or focus only on national outlets.

### Core Differentiators
1. **Hyper-local coverage** - School boards, sheriffs, city councils, state legislators. The gap no one else fills.
2. **Algorithmic bias scoring** - Claude-powered sentence-level analysis, not human opinion
3. **Ownership transparency** - "buy'r aesthetic" reveals who funds/owns every source
4. **Multi-dimensional bias** - Not just left/right: Economic, Social, Establishment, Nationalist axes
5. **Verified-voter-only interaction** - Anti-bot by design

### Key Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Impartiality** | Blue-to-Red linear gradient (Blue LEFT, Red RIGHT - always) |

### Gradient Design Rule (CRITICAL - Jan 4, 2026)

**Blue must ALWAYS appear on the LEFT, Red on the RIGHT.**

This applies everywhere gradients show impartiality:
- Logo text
- Primary buttons
- Tab toggles
- Bias spectrum bars
- Any red-blue gradient in the app

**Correct patterns:**
```css
linear-gradient(135deg, #2563EB, #DC2626)  /* Blue first */
linear-gradient(90deg, #2563EB, #888, #DC2626)  /* Bias bar: Blue-Center-Red */
```

**Rationale:** Blue-left mirrors reading direction and avoids political connotation of "left" meaning liberal. Consistent across all screens - no random flipping.

### Icon Design Rules (Jan 4, 2026)

- **No gradients on icons** - Solid white/single color only
- At 24px nav size, gradients get muddy and lose definition
- Gradient reserved for logo, buttons, and larger UI elements with surface area
- Icons should be standalone recognizable (no text dependency)
- Style: 2px stroke, clean lines, professional

### Leaders Page Sort Order (Jan 4, 2026)

**Default sort: "Local ↑"** - Users see their mayor first.

Order of sections:
1. **Local** (Mayor, City Council, County Council, School Board)
2. **State** (Governor, Lt Gov, State Senate, State House)
3. **Federal** (US House, US Senate)

This reinforces the hyper-local philosophy: your mayor affects your daily life more than the President.

### State Facts Ticker (Jan 4, 2026)

**Feature:** Scrolling ticker of state facts appears throughout the app.

**Scope:**
- 10,000 facts per state (200 per state × 50 states)
- Appears on: Voices tab, Elections tab, Bills tab, bill detail, election detail
- Randomized or contextual display

**Purpose:**
- Passive learning while browsing
- Incentivizes visiting Learn section
- Earns XP/badges for learning facts
- Ties into "become a Voice" progression

### Learn Section Terminology (Jan 4, 2026)

- **"Foundations"** (not "Learning Paths") - these are foundational knowledge for informed citizens
- **Progress bar colors:**
  - 0-25%: Red
  - 26-50%: Orange
  - 51-75%: Yellow
  - 76-99%: Blue
  - 100%: Green

| **Anonymity** | Voter registration verification, then discard PII, store token only |
| **Anti-bot** | Only verified registered voters can rate, comment, interact |
| **Transparency** | Every source shows ownership, funding, advertiser data |
| **Mobile-first** | React Native, 375px viewport primary, dark mode default |

### User Roles Clarified

| Role | Function | Key Actions |
|------|----------|-------------|
| **Citizens/Constituents** | Regular users | Read, thumbs up/down, earn XP, follow Voices |
| **Voices** | Community influencers | Write editorial responses (like blog posts), build followers, earn credibility |
| **Bias Scoring** | Algorithm (Claude) | Sentence-level fact/opinion parsing, NOT human raters |

**Voice Role Clarified (Jan 4, 2026):**
- Voices write **editorial responses** - think blog posts responding to articles, bills, or elections
- Voices do **NOT** rate bias - that is purely algorithmic (Claude-powered)
- Voices build followers and credibility through engagement with their editorial content
- Example: A Voice reads an article about a school board decision and writes a 500-word response with their perspective

### Content Strategy

| Dimension | Approach |
|-----------|----------|
| **Local Focus** | Start with Eastern PA (NEPA pilot), expand regionally |
| **Sources** | RSS ingestion, respectful metered scraping, headline extraction |
| **Data Gap** | Build our own local source catalog (no APIs exist) |
| **Partnerships** | Future: credibility exposure deals, not traffic-driving |
| **Ownership** | Track shareholders, advertisers, funding for every source |

### Technical Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Mobile Framework | React Native + Expo | Cross-platform, single codebase |
| AI Analysis | Claude | Sentence-level bias detection, fact/opinion parsing |
| Database | MySQL (MVP), PostgreSQL target | Per project CLAUDE.md, Supabase for scale |
| Blockchain | **Opt-in premium layer** (post-MVP) | Not required for participation; available for users wanting immutable verification |
| Subagent Delegation | Claudish | Free LLMs for bulk tasks, Claude for judgment |
| Vector DB | pgvector (MVP) -> Pinecone (scale) | Cost-effective scaling path |

### Blockchain Strategy (Refined Jan 4, 2026)

**Vision:** "Synthesized town square" - a permanent, immutable record of public opinion without manipulation.

**Implementation:**
- **NOT required for MVP participation** - users can fully engage without blockchain
- **Opt-in "premium trust layer"** for users who want verifiable civic participation records
- **Post-MVP feature** for those who see value in decentralized verification
- **Use case:** Immutable proof of civic engagement, tamper-proof opinion records

### Claudish Subagent Architecture (Jan 4, 2026)

**Principle:** Claude (Opus) orchestrates and delegates bulk work to free LLMs via Claudish.

| Task Type | Handler | Rationale |
|-----------|---------|-----------|
| Source research | Free LLMs | High volume, low judgment |
| RSS discovery | Free LLMs | Pattern matching, data gathering |
| Data normalization | Free LLMs | Structured transformation |
| Bias analysis | Claude | Requires nuanced judgment |
| User-facing content | Claude | Quality and tone critical |
| Judgment calls | Claude | Editorial decisions |

**Constraints:**
- OpenRouter free tier only (no billing)
- Claude retained for all high-stakes decisions
- Free models handle volume, Claude handles value

### Launch Targets
- **May 20, 2025** - PA Primary (interim milestone)
- **November 3, 2026** - Shapiro gubernatorial election (MVP launch)

---

## Core Differentiators (Detail)

1. **Hyper-local coverage** - School boards, sheriffs, city councils, state legislators. The gap no one else fills.
2. **Voices** - Community influencers who write editorial responses and build engaged followings. NOT bias raters.
3. **Multi-dimensional bias** - Not just left/right. Economic, Social, Establishment, Nationalist axes.
4. **Algorithmic bias scoring** - Claude-powered, sentence-level fact/opinion parsing. No human subjectivity.
5. **Impartiality at all costs** - 50/50 red-to-blue gradient flip on each page load. Baked into DNA.

---

## Current State

**Wireframes v0.8 - NEPA Edition**
- 21 interactive HTML/CSS screens
- Mobile-first (375px viewport)
- Dark mode default (light mode opt-in)
- NEPA pilot data seeded (Luzerne County, Wilkes-Barre)

### Screens Complete
| # | Screen | Status |
|---|--------|--------|
| 00 | Login | Done |
| 00a | Register | Done (address removed) |
| 00b | Identity Verification | Done (5 options) |
| 00c | Setup Complete | Done |
| 01 | Home - News Mode | Done |
| 02 | Home - Elections Mode | Done |
| 03 | Leaders | Done |
| 04 | Leader Profile | Done |
| 05 | Voices | Done |
| 06 | Voice Profile | Done |
| 07 | Learn | Done |
| 08 | Article View | Done |
| 09 | User Profile | Done |
| 10 | Voter Card Popup | Done |

---

## Design Decisions Made

- **Sticky table headers** - All tables have position:sticky headers (platform-wide rule)
- **Dark mode first** - Users opt out on profile if they want light
- **No home address collection** - Pin-drop on map for district selection
- **Political gradient** - Radial gradients (not left-right linear), 50/50 random flip per page load
- **Home screen tabs** - Consistent Voices/Elections/Bills tabs on all home screens
- **Accordion drill-down** - Stories expand to bias ratings and related elections
- **Bottom nav** - Home, Leaders, Media, Learn
- **Voter Card FAB** - Floating button accessible from all screens
- **Gamification** - XP, levels, streaks, badges (Duolingo-inspired)
- **buy'r aesthetic** - Funding transparency, reveal ownership/donors

### UI Consistency (Jan 4, 2026)
- All home screens have consistent **Voices/Elections/Bills** tab structure
- Gradient exploration: Moving to **radial gradients** (center-out) instead of left-right linear
- Radial gradients avoid implicit political direction (left vs right)
- Sticky table headers applied platform-wide

---

## NEPA Pilot Data (Luzerne County)

Used for wireframe seeding and initial testing.

**Federal:**
- US Congressional: PA-8 (Matt Cartwright - D)
- US Senators: John Fetterman (D), Dave McCormick (R)

**State:**
- Governor: Josh Shapiro (D)
- State Senate: District 22
- State House: District 121

**Local:**
- Municipality: Wilkes-Barre City
- City Council: District A
- School District: Wilkes-Barre Area
- Precinct: Ward 15
- Polling Location: St. Aloysius Parish Hall, 340 W Division St

---

## Identity Verification Flow (Finalized Jan 4, 2026)

**Verification Method:** Voter registration number ONLY
- No photo ID required
- No SSN required
- No address collection

**District Selection:** Pin-drop on map
- User drops pin on their location
- System determines district anonymously
- No address stored

**Access Levels:**
| Status | Capabilities |
|--------|-------------|
| Unverified | Read-only access (browse content, no interaction) |
| Verified | Full participation (rate, comment, follow, earn XP) |

**Privacy Principle:** Verify once, discard PII, store token only.

---

## User Roles

| Role | Level | Description |
|------|-------|-------------|
| Founders | Super Admin | Josh & Yeti. Full access. |
| Cabinet | Admin | Trusted administrators |
| Delegates | TBD | Role refinement needed |
| Clerks | Moderator | Content mod, community, support |
| Voices | Influencer | Community influencers who write editorial responses. Levels 1-5. |
| Citizens/Constituents | Standard | Regular users. "Join as a Constituent, rise to become a Voice." |

### Voice Level System

Voices earn XP through editorial responses, follower engagement, and community contributions. Levels unlock credibility and visibility.

| Level | XP Required | Characteristics |
|-------|-------------|-----------------|
| 1 | 0 | New Voice. Learning the ropes. Gray badge. |
| 2 | 500 | Established. Starting to build followers. Gold badge. |
| 3 | 2,000 | Experienced. Trusted in specific topics. Pink badge. |
| 4 | 5,000 | Expert. Strong following, high accuracy. Purple badge. |
| 5 | 10,000 | Master. Top-tier credibility, centrist tendency. Purple badge. |

**Sorting:** Voices list sorted by followers + engagement (response count, likes received)
**Credibility:** Based on follower count, response engagement, and topic expertise
**Editorial Stance:** Shows where Voice's editorial responses typically align (transparency)

### Sample Voice (Placeholder)

**Jessica Williams** - Level 5, Philadelphia PA
- Former journalist, policy analyst
- 2.4K followers, 312 editorial responses
- Expertise: Healthcare Policy (87), Economic Analysis (124), State Politics (68), Media Criticism (33)
- Editorial stance: Centrist perspective

---

## Technical Architecture (Planned)

- **Frontend:** React Native + Expo
- **Backend:** Supabase (PostgreSQL, auth, realtime, pgvector)
- **AI/LLM:** Claude + GPT-4o for analysis
- **Vector DB:** Supabase pgvector (MVP) → Pinecone (scale)

---

## Migration Requirement

**Current environment:** VPS from Yeti's former employer (fitaf570.com)
**Target environment:** AWS or equivalent cloud services (autonomous management)
**Scale target:** Plan architecture for 100M-1B users (hopeful path)

MVP will be built on VPS, then migrate to cloud. Architecture decisions should account for:
- Data portability from day one
- Clean separation of concerns
- Avoid deep Supabase-specific patterns if migration is likely
- API abstraction layers for future flexibility
- Document data schemas thoroughly
- Current VPS may not have all optimal technologies available

**Note:** Supabase scalability at 100M+ users is uncertain. May need to evaluate alternatives before that scale.

---

## Decisions Made (Dec 27, 2025)

### District Lookup - RESOLVED
**Offer all methods. Prioritize UX and least personally identifiable.**

Order of options (easiest/least invasive first):
1. **ZIP code** - Instant, no PII, gets approximate district (may need refinement for edge cases)
2. **PA Voter Registration lookup** - Name + DOB + last 4 SSN, confirms identity AND district
3. **Manual selection** - User picks their districts from dropdowns
4. **Address entry** - Most precise, but most invasive (offer last)

Strategy: Start with ZIP, offer refinement if needed. Exact district confirmed during identity verification.

### MVP Scope - RESOLVED
**All 14 screens are v1. No cutting.**

### Voices Bootstrap - RESOLVED
**JK and YD provide initial content evaluations, augmented by Claude.**

- Josh and Yeti manually rate articles at launch
- Claude provides AI-assisted bias analysis to speed up rating
- Gaps filled later as community Voices are recruited
- This solves the chicken-egg problem: founders ARE the initial Voices

---

## Open Questions / Blockers

### Critical
1. **Local coverage data sourcing** - Pinned for now, but core differentiator
   - School board meetings, city council minutes need scraping or partnerships

### Deferred
- Trust Circle concept (social layer scope reduction)
- Polymarket integration for election odds
- Candidate role (active participant with editorial capabilities)

---

## Development Tiers

From project brief:

| Tier | Timeline | Monthly Cost |
|------|----------|--------------|
| Tier 1: Validation | 3-4 months | $50-150 |
| Tier 2: Competitive | 5-7 months | $500-800 |
| Tier 3: Full Vision | 9-12 months | $1,500-3,000 |

---

## Bias Evaluation Methodology

Multi-dimensional scoring:
- **Political axis** - Left/Center/Right (traditional)
- **Economic axis** - Socialist to Free Market
- **Social axis** - Progressive to Traditional
- **Establishment axis** - Anti-establishment to Pro-establishment
- **Nationalist axis** - Globalist to Nationalist

Article-level analysis:
- Sentence-level fact/opinion parsing
- Source reliability scoring
- Funding/ownership transparency
- Voice consensus ratings

---

## Files & Directories

```
/civiq/
├── Claude.md              # This file
├── wireframes/
│   ├── index.html         # Navigation hub
│   ├── styles.css         # Design system
│   ├── app.js             # Interactivity
│   ├── 00-login.html
│   ├── 00a-register.html
│   ├── 00b-verify.html
│   ├── 00c-setup.html
│   ├── 01-home-news.html
│   ├── 02-home-elections.html
│   ├── 03-leaders.html
│   ├── 04-leader-profile.html
│   ├── 05-voices.html
│   ├── 06-voice-profile.html
│   ├── 07-learn.html
│   ├── 08-article.html
│   ├── 09-profile.html
│   └── 10-voter-card.html
```

---

## Related Files

- `/uploads/civiq-project-brief.md` - Full project brief
- `/uploads/meeting1.txt` - First strategy meeting transcript
- `/uploads/meeting2.txt` - Second strategy meeting transcript
- `/uploads/meeting3.txt` - Third strategy meeting transcript
- `/uploads/loco.jpg` - Josh's NEPA district sketch

---

## Meeting 3 Key Insights (Dec 27, 2025)

### Confirmed Design Decisions
- **Bottom nav:** Home, Leaders, Voices, Learn
- **buy'r app aesthetic** - Transparency about ownership/funding
- **Purple accent color** - Josh: "Purple's my favorite color"
- **Red/blue gradient** - Less purple, more red/blue bleed
- **Dark mode first** - Users can opt out
- **No home address collection** - Use voter registration for verification

### XP Sources Confirmed
- Civic quizzes (correct answers)
- Reading articles
- Balanced consumption (reading diverse sources)
- Voice reputation (for evaluators)
- Voting streaks (confirmed via location at polling place)

### Verification Ideas
- Voter registration number as verification method
- Shred verification data immediately after confirming - no retention
- Location check-in at polling place for vote confirmation

### Launch Target
- **November 3, 2026** - Josh Shapiro gubernatorial election
- **May 20, 2025** - PA Primary as interim milestone

### Future Ideas (Pinned)
- Naturalization exam integration - federal subcontracting
- Communist Manifesto in education section (Lana's suggestion for broad appeal)
- Ideology lens option - present info through different philosophical frameworks
- Google Fact-Check API vs xAI for counterbalancing

### Claude's Project Assessment
- Tier 1 (Validation): Very achievable, 3-4 months part-time
- Tier 2 (Competitive): Achievable but demanding, 8-10 months realistic
- Tier 3 (Full Vision): Different scale of operation
- Key risk: Part-time + single technical point of failure
- Key advantage: AI-first architecture in window before established players adapt

---

## Meeting 5 Key Insights (Dec 27, 2025)

### Wireframe Review (v0.8)

**Completed/Confirmed:**
- ✅ Unified stream implemented (01-home-unified.html) - combines news, elections, stats
- ✅ PA state flag banner on leaders page
- ✅ No search bar on leaders page (removed - too cluttered for small dataset)
- ✅ Bottom nav points to unified home
- ✅ Elections sorted by upcoming date
- ✅ Three countdown circles for federal/state/local (progress bars for election timing)

**Navigation Architecture:**
- Dashboard, Elections, and News now unified into single tabbed interface
- Filter buttons: All | News | Elections | Stats
- Level filters: Federal | State | Local

**Action Items Completed:**
1. Removed search bar from leaders page
2. Added PA state flag banner to leaders
3. Created unified stream (01-home-unified.html)
4. Reading balance moved to feed (not dashboard)
5. Bottom nav goes to unified home

**Pending Enhancements:**
- Add candidate photos (currently using initials in colored circles)
- Real headshots needed for all leaders/candidates
- Consider different colors for federal/state/local countdown circles (currently using: Federal=#3B82F6, State=#8B5CF6, Local=#F59E0B)

### Domain Status
- civiq.com is taken (government RFP tracking service - unrelated)
- Alternatives considered: civiq.app, civiq.org, civiq.us, joinciviq.com
- informedvoter.org may be available

### Voices Filtering Ideas
- Track paid subscribers (Substack, Breaking Points, etc.) as viability metric
- Users become "Voices" after reaching minimum follower threshold
- Track funding sources for networks, influencers, podcasters, candidates
- "See both directions of the money" - transparency about who funds whom

### Privacy Approach
- Don't ask for income or address directly
- Use voter registration lookup for district verification
- Transmit sensitive data once, store token, discard original
- User responsibility for secure connection

### Related Files
- `/uploads/meeting5.txt` - Full meeting transcript

---

## Next Steps

1. ~~Lock wireframe scope~~ - All 21 screens are v1
2. ~~Resolve district lookup approach~~ - ZIP first, refinement if needed
3. Add candidate photos to wireframes
4. Document user flows
5. Plan migration architecture
6. Set up dev environment (React Native + Expo + Supabase)
7. Build trivial practice app before production

---

*Team: Josh (Marketing/Ops) & Yeti (Technical)*

---

## Git Workflow

**Claude manages the repo.** User doesn't need to remember git commands.

- **Branches:** `main` (stable) and `dev` (active development)
- **Current branch:** `main`
- **Commit protocol:** Claude proposes commits when changes are meaningful, user confirms with "yes" or "commit"
- **No remote configured yet** (local only)

---

## Meeting 6 Key Insights (Jan 4, 2026)

### Navigation Architecture Revision

**Bottom Nav (4 items):**
1. Home (Dashboard)
2. Leaders
3. Media (renamed from Voices)
4. Learn

**Home Screen - 3 tabs:**
- **Voices** = LOCAL content only (your district, your reps) - renamed from News
- **Elections** = your upcoming elections
- **Bills** = bills affecting you

### Media Screen Structure

**Two dimensions:**
- **Stories** (top stories across sources)
- **Sources** (browse by publication)

**Categories:**
- Networks (TV)
- Newspapers
- Magazines (gloss publications)
- Podcasts / Influencers
- Official Documents (whitehouse.gov, declassified docs, etc.)
- Scientific Journals (funding transparency)

**Source Profile popup:**
- Logo
- Tenure / Ownership history / Shareholders
- Top Advertisers
- % Opinion score (algorithmic)

### Leaders Page Enhancement
- US Map visualization
- Click state → see districts (red/blue heat map)
- District type dropdown: Congressional, Senate, House, City, School
- Flows to candidate comparison

### Learn Screen
- Ghost Panel moved here (from standalone)
- Types of Badges
- Types of Publications education
- Future: AI "podcast" with historical figures commenting on news

### Bias/Opinion Scoring
- Algorithmic (Claude-powered), not manual human rating
- Sentence-level analysis for factuality vs opinion
- Fine-tuning phase later in development

### Voices (Community Evaluators)
- Community-driven nominations
- Mini-elections within districts
- Follower/engagement based credibility
- Top-down push from politicians using platform

### Data Sourcing Strategy
- No APIs exist for local data - must build our own
- Claude does targeted research per locale
- Catalog: local newspapers, government sites, RSS feeds
- Build mesh of publicly available sources
- Eastern PA is pilot region

### Future Features (Post-V1)
- Delegate/Politician interface (separate wireframe)
- Real-time constituent sentiment on bills
- Messaging system for politicians
- Scientific journal funding transparency deep-dive

### Related Files
- `/uploads/meeting6.txt` - Full meeting transcript
- `/uploads/PXL_*.jpg` - Josh's whiteboard sketches

---

## Source Catalog Database (Jan 4, 2026)

### Database Schema

Tables in `lom1ubvhoxxi_sud_claude` with `civiq_` prefix:

**Core Source Tables:**
- `civiq_news_sources` - Publications, broadcasts, websites (63+ sources)
- `civiq_rss_feeds` - RSS endpoints per source (15+ feeds)
- `civiq_source_coverage` - Geographic coverage (legacy, JSON cities)
- `civiq_government_sources` - Official govt data sources (19 sources)

**Normalized Geography (NEW):**
- `civiq_counties` - PA counties with FIPS codes and region
- `civiq_municipalities` - Cities/boroughs/townships with FK to counties
- `civiq_source_municipalities` - Many-to-many junction (source → municipality)

**Article Ingestion:**
- `civiq_articles` - Stored articles with metadata, bias scores, full text
- `civiq_ingestion_log` - Track fetch jobs, quotas, errors

**Quota Tracking Columns (added to civiq_news_sources):**
- `monthly_quota` - Articles allowed per month (10 for metered, 999 for free)
- `quota_used` - Current month usage
- `quota_reset_day` - Day of month quota resets
- `scrape_priority` - high/medium/low/skip
- `acquisition_method` - rss/scrape/api/headlines_only

### Regions Catalogued

**Eastern PA (NEPA):** Luzerne, Lackawanna, Monroe, Lehigh, Northampton
**Southeastern PA:** Philadelphia, Bucks, Montgomery, Delaware, Chester, Berks, Lancaster, York, Carbon, Schuylkill

### Ownership Landscape

| Owner | Type | Properties |
|-------|------|------------|
| Alden Global Capital | Hedge fund | Citizens' Voice, Times-Tribune, Standard-Speaker, Morning Call, Reading Eagle, Times Herald, Delco Daily Times, Daily Local News, Pottstown Mercury |
| Gannett | Public company | Bucks County Courier Times, Intelligencer, York Daily Record, York Dispatch |
| Advance Publications | Private | Express-Times/LehighValleyLive, Philadelphia Business Journal |
| Lenfest Institute | Nonprofit | Philadelphia Inquirer |
| Avant Publications | Private/Local | Times Leader, Sunday Dispatch, Abington Journal |
| American Community Journals | Private | VISTA Today, MONTCO Today, DELCO Today, BUCKSCO Today |

### Content Acquisition Strategy

**Tier 1: Free/Open (Immediate)**
- Public media (WHYY, WVIA) - mission-aligned
- Nonprofits (Spotlight PA, Billy Penn) - free redistribution
- Government sources - public domain
- RSS-enabled free sites

**Tier 2: Metered Paywalls (Respectful Scraping)**
- Rotate user-agent, stay under monthly limits
- Prioritize headlines + lede (often free)
- Link out for full articles

**Tier 3: Recognition Partnerships (Medium-term)**
- NOT about driving traffic off-platform (that would harm our model)
- Value props for sources:
  - **Credibility exposure**: High-quality sources get visible trust scores
  - **Civically-engaged audience**: Reach users who care about news quality
  - **Brand attribution**: Prominent source credit in quality-focused context
  - **Reputation metrics**: Factuality scores that reward good journalism
- In exchange: Full article access via API/direct feed
- Note: Content is consumed IN-app, never "link out" as primary strategy

**Tier 4: Bulk Deals (Scale)**
- Negotiate with ownership groups (Alden, Gannett, Advance)

### Research Files Generated

```
/civiq/
├── eastern_pa_news_sources.sql   # Eastern PA schema + seed data
├── eastern_pa_news_sources.json  # Eastern PA structured JSON
├── sources-dashboard.html        # Visualization dashboard
├── api/sources.php               # API for dashboard
└── wireframes/
    ├── sepa_news_sources.json    # SE PA structured JSON
    └── sepa_news_sources_schema.sql  # SE PA schema (different structure)
```

### RSS Feeds Confirmed (15)

| Source | Feed URL | Category |
|--------|----------|----------|
| Morning Call | mcall.com/latest-headlines/feed/ | breaking |
| Morning Call | mcall.com/local-news/feed/ | local |
| Times-Tribune | thetimes-tribune.com/feed/ | news |
| WBRE/WYOU | pahomepage.com/feed/ | news |
| Philadelphia Inquirer | inquirer.com/arcio/rss/ | news |
| PhillyVoice | phillyvoice.com/feed/ | all |
| Billy Penn | billypenn.com/feed/ | all |
| WHYY | whyy.org/feed/ | news |
| LevittownNow | levittownnow.com/feed/ | all |
| LNP/LancasterOnline | lancasteronline.com/search/?f=rss | news |
| Express-Times | lehighvalleylive.com/arc/outboundfeeds/rss/ | news |
| Spotlight PA | spotlightpa.org/feed.xml | news |
| WPVI 6ABC | 6abc.com/feed/ | news |
| NBC10 | nbcphiladelphia.com/feed/ | news |
| WFMZ-TV | wfmz.com/search/?f=rss | news |

### Cron Architecture (Planned)

```
RSS Daemon (every 15 min)
└─ Fetch all active RSS feeds
└─ Dedupe by URL hash
└─ Queue for processing

Scrape Scheduler (daily, per-source limits)
└─ Track: source_id, quota_used, quota_reset
└─ Prioritize: local > regional > national
└─ Prioritize: news > opinion > features

Rate Limit Manager
└─ metered_sources: 10/month per source
└─ free_sources: unlimited
└─ hard_paywall: headlines only
```

---

## Wireframe File Naming (Jan 4, 2026)

Reorganized to hierarchical naming:

| Prefix | Section | Files |
|--------|---------|-------|
| 0x | Auth | 0a-login, 0b-register, 0c-verify, 0d-setup, 0e-engagement |
| 1x | Home | 1a-home-voices, 1b-home-dashboard (ALT), 1c-home-news (ALT), 1d-home-elections, 1e-home-bills, 1f-bill-detail, 1g-election-detail |
| 2x | Leaders | 2a-leaders, 2b-leader-profile, 2c-candidate-compare |
| 3x | Media | 3a-media, 3b-source-profile, 3c-article, 3d-source-compare |
| 4x | Learn | 4a-learn, 4b-quiz, 4c-ghost-advisor (V2) |
| 9x | Utilities | 9a-profile, 9b-voter-card, 9c-settings, 9d-notifications, 9e-search, 9f-rebalance |

### Styling Fixes Applied
- Input field text color: `color: var(--text-primary)`
- Placeholder color: `color: var(--text-tertiary)` with `opacity: 1`
