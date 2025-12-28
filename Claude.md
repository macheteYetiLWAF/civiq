# CIVIQ Project

Political news aggregation platform with hyper-local coverage and AI-powered bias evaluation.

**URL:** https://fitaf570.com/sud/claude/civiq/
**Wireframes:** https://fitaf570.com/sud/claude/civiq/wireframes/

---

## Core Differentiators

1. **Hyper-local coverage** - School boards, sheriffs, city councils, state legislators. The gap no one else fills.
2. **Voices** - Community-nominated human evaluators for bias ratings. "Your bias rating, powered by real Voices — not algorithms."
3. **Multi-dimensional bias** - Not just left/right. Economic, Social, Establishment, Nationalist axes.
4. **Impartiality at all costs** - 50/50 red-to-blue gradient flip on each page load. Baked into DNA.

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

- **Dark mode first** - Users opt out on profile if they want light
- **No home address collection** - Need smarter approach for district lookup
- **Political gradient** - Red-to-blue with minimal purple transition, 50/50 random flip per page load
- **Toggle-based navigation** - Elections vs News as primary dimension
- **Accordion drill-down** - Stories expand to bias ratings and related elections
- **Bottom nav** - Home, Leaders, Voices, Learn
- **Voter Card FAB** - Floating button accessible from all screens
- **Gamification** - XP, levels, streaks, badges (Duolingo-inspired)
- **buy'r aesthetic** - Funding transparency, reveal ownership/donors

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

## Identity Verification Options

Five methods for the verification screen:
1. PA Voter Registration lookup (name + DOB + last 4 SSN)
2. Photo ID upload (driver's license, state ID)
3. SSN + DOB verification
4. Voter Registration Card photo
5. Knowledge-based questions

---

## User Roles

| Role | Level | Description |
|------|-------|-------------|
| Founders | Super Admin | Josh & Yeti. Full access. |
| Cabinet | Admin | Trusted administrators |
| Delegates | TBD | Role refinement needed |
| Clerks | Moderator | Content mod, community, support |
| Voices | Evaluator | Community-nominated bias raters. Levels 1-5. |
| Citizens/Constituents | Standard | Regular users. "Join as a Constituent, rise to become a Voice." |

### Voice Level System

Voices earn XP through article evaluations. Levels unlock credibility and visibility.

| Level | XP Required | Characteristics |
|-------|-------------|-----------------|
| 1 | 0 | New Voice. Learning the ropes. Gray badge. |
| 2 | 500 | Established. Starting to build followers. Gold badge. |
| 3 | 2,000 | Experienced. Trusted in specific topics. Pink badge. |
| 4 | 5,000 | Expert. Strong following, high accuracy. Purple badge. |
| 5 | 10,000 | Master. Top-tier credibility, centrist tendency. Purple badge. |

**Sorting:** Voices list sorted by followers + rating count (engagement-weighted)
**Accuracy:** Percentage of ratings that match eventual consensus
**Rating Tendency:** Shows where Voice typically rates on left/center/right spectrum (transparency)

### Sample Voice (Placeholder)

**Jessica Williams** - Level 5, Philadelphia PA
- Former journalist, policy analyst
- 2.4K followers, 312 ratings, 94% accuracy
- Expertise: Healthcare Policy (87), Economic Analysis (124), State Politics (68), Media Criticism (33)
- Rating tendency: Centrist evaluator

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
