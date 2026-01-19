# CIVIQ Technical Blueprint

**Living Document for Autonomous Development**
**Last Updated:** January 4, 2026
**Status:** Pre-Development Planning

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Component Architecture](#2-component-architecture)
3. [Styling Approach](#3-styling-approach)
4. [Routing Map](#4-routing-map)
5. [State Management](#5-state-management)
6. [Build Phases](#6-build-phases)
7. [Database Schema Reference](#7-database-schema-reference)
8. [API Endpoints](#8-api-endpoints-planned)
9. [Design Decisions Log](#9-design-decisions-log)

---

## 1. Project Setup

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vite** | ^5.x | Build tool & dev server |
| **React** | ^18.x | UI framework |
| **React Router** | ^6.x | Client-side routing |
| **Font Awesome** | 6.5.1 | Icon library (CDN) |

### File Structure

```
/home/lom1ubvhoxxi/public_html/sud/claude/civiq/app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── StatusBar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   ├── DeviceFrame.jsx
│   │   │   └── Screen.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Accordion.jsx
│   │   │   ├── Toggle.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── ProgressBar.jsx
│   │   └── features/
│   │       ├── BiasBar.jsx
│   │       ├── BiasLabel.jsx
│   │       ├── VoterCard.jsx
│   │       ├── VoterCardFAB.jsx
│   │       ├── ReadingStats.jsx
│   │       ├── ElectionCircle.jsx
│   │       ├── RepChip.jsx
│   │       ├── SourceCard.jsx
│   │       ├── QuizCard.jsx
│   │       ├── StreakBadge.jsx
│   │       ├── LevelBadge.jsx
│   │       ├── XPBar.jsx
│   │       └── ConsumptionChart.jsx
│   ├── screens/
│   │   ├── onboarding/
│   │   │   ├── LoginScreen.jsx          (0a)
│   │   │   ├── RegisterScreen.jsx       (0b)
│   │   │   ├── VerifyScreen.jsx         (0c)
│   │   │   ├── VerifyLocationScreen.jsx (0c-location)
│   │   │   ├── SetupScreen.jsx          (0d)
│   │   │   └── EngagementScreen.jsx     (0e)
│   │   ├── home/
│   │   │   ├── HomeScreen.jsx           (01-unified)
│   │   │   ├── VoicesTab.jsx            (1a)
│   │   │   ├── DashboardTab.jsx         (1b)
│   │   │   ├── NewsTab.jsx              (1c)
│   │   │   ├── ElectionsTab.jsx         (1d)
│   │   │   ├── BillsTab.jsx             (1e)
│   │   │   ├── BillDetailScreen.jsx     (1f)
│   │   │   └── ElectionDetailScreen.jsx (1g)
│   │   ├── leaders/
│   │   │   ├── LeadersScreen.jsx        (2a)
│   │   │   ├── LeaderProfileScreen.jsx  (2b)
│   │   │   └── CandidateCompareScreen.jsx (2c)
│   │   ├── media/
│   │   │   ├── MediaScreen.jsx          (3a)
│   │   │   ├── SourceProfileScreen.jsx  (3b)
│   │   │   ├── ArticleScreen.jsx        (3c)
│   │   │   └── SourceCompareScreen.jsx  (3d)
│   │   ├── learn/
│   │   │   ├── LearnScreen.jsx          (4a)
│   │   │   ├── QuizScreen.jsx           (4b)
│   │   │   └── GhostAdvisorScreen.jsx   (4c)
│   │   └── profile/
│   │       ├── ProfileScreen.jsx        (9a)
│   │       ├── VoterCardScreen.jsx      (9b)
│   │       ├── SettingsScreen.jsx       (9c)
│   │       ├── NotificationsScreen.jsx  (9d)
│   │       ├── SearchScreen.jsx         (9e)
│   │       └── RebalanceScreen.jsx      (9f)
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useUser.js
│   │   ├── useReadingStats.js
│   │   └── useStreak.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── UserContext.jsx
│   │   └── NavigationContext.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── storage.js
│   ├── styles/
│   │   ├── variables.css
│   │   ├── reset.css
│   │   └── utilities.css
│   ├── utils/
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── .env
```

### Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.10"
  }
}
```

### Font Awesome CDN (index.html)

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
```

### Initial Setup Commands

```bash
cd /home/lom1ubvhoxxi/public_html/sud/claude/civiq
npm create vite@latest app -- --template react
cd app
npm install react-router-dom
npm install
```

---

## 2. Component Architecture

### 2.1 Layout Components

#### StatusBar.jsx
Mock iOS status bar with time and icons.

```jsx
// Props: none (static mock)
// Displays: time (9:41), signal, wifi, battery icons
```

#### Header.jsx
Screen header with title, subtitle, and optional actions.

```jsx
// Props:
// - title: string
// - subtitle?: string
// - showLogo?: boolean (CIVIQ gradient logo)
// - rightAction?: ReactNode (avatar, settings icon, etc.)
// - showStateFlag?: boolean (PA flag banner for Leaders)
```

#### BottomNav.jsx
Fixed bottom navigation with 4 main sections.

```jsx
// Props:
// - activeTab: 'home' | 'leaders' | 'media' | 'learn'

// Navigation Icons (CONFIRMED Jan 4, 2026):
// Home: fa-layer-group
// Leaders: fa-landmark
// Media: fa-file-lines
// Learn: fa-graduation-cap

// Active color: #8B5CF6 (purple)
// Inactive color: #6B7280
```

#### DeviceFrame.jsx
Mobile device container for wireframe preview mode.

```jsx
// Props:
// - children: ReactNode
// Dimensions: 375px x 812px
// Border radius: 40px
```

#### Screen.jsx
Main content container with proper padding.

```jsx
// Props:
// - children: ReactNode
// - paddingBottom?: boolean (default true, for nav space)
```

### 2.2 UI Components

#### Button.jsx

```jsx
// Variants:
// - primary: Gradient background (Blue -> Purple -> Red)
// - secondary: var(--bg-tertiary)
// - outline: Transparent with border
// - gradient: Full political gradient

// Props:
// - variant: 'primary' | 'secondary' | 'outline' | 'gradient'
// - fullWidth?: boolean
// - children: ReactNode
// - onClick?: function
// - disabled?: boolean

// CRITICAL: No solid blue or red buttons (politically charged)
```

#### Card.jsx

```jsx
// Props:
// - children: ReactNode
// - borderLeft?: string (color for left accent)
// - gradient?: boolean (for special CTA cards)
// - padding?: 'normal' | 'compact' | 'none'
```

#### Accordion.jsx

```jsx
// Props:
// - title: string
// - subtitle?: string
// - children: ReactNode
// - defaultOpen?: boolean
// - chevronStyle?: 'arrow' | 'circle'
// - leftAccent?: string (color)

// Nested accordions supported via recursive use
```

#### Toggle.jsx (Tab Toggle)

```jsx
// Props:
// - options: Array<{ value: string, label: string }>
// - activeValue: string
// - onChange: (value: string) => void
```

#### InputField.jsx

```jsx
// Props:
// - label?: string
// - type: 'text' | 'password' | 'email'
// - placeholder?: string
// - value: string
// - onChange: function
// - error?: string
```

#### Badge.jsx

```jsx
// Variants for achievements:
// - earned: Gold/colored background
// - locked: Dim, var(--bg-tertiary)

// Props:
// - variant: 'earned' | 'locked'
// - icon?: string
// - label?: string
```

#### ProgressBar.jsx

```jsx
// Props:
// - value: number (0-100)
// - color?: string (default: gradient)
// - height?: 'sm' | 'md' | 'lg'
```

### 2.3 Feature Components

#### BiasBar.jsx
Visual representation of political bias spectrum.

```jsx
// Props:
// - position: number (0-100, 0=far left, 100=far right)
// - showMarker?: boolean

// CRITICAL: Blue (#3B82F6) always LEFT, Red (#EF4444) always RIGHT
// Center: Purple (#A855F7)
```

#### BiasLabel.jsx

```jsx
// Props:
// - bias: 'left' | 'lean-left' | 'center' | 'lean-right' | 'right' | 'official' | 'peer-reviewed'

// Colors:
// left: #1D4ED820 bg, #1D4ED8 text
// lean-left: #2563EB20 bg, #2563EB text
// center: #8B5CF620 bg, #8B5CF6 text
// lean-right: #DC262620 bg, #DC2626 text
// right: #B91C1C bg/text
// official: #22C55E20 bg, #22C55E text
// peer-reviewed: #3B82F620 bg, #3B82F6 text
```

#### VoterCard.jsx
Bottom sheet popup showing user's voting info.

```jsx
// Props:
// - isOpen: boolean
// - onClose: function
// - userData: object

// Sections: Representatives, Upcoming Elections, Polling Place, Badges
```

#### VoterCardFAB.jsx
Floating action button that opens Voter Card.

```jsx
// Props:
// - onClick: function
// Position: Fixed, bottom-right
// Style: 56px circle, purple background
```

#### ReadingStats.jsx

```jsx
// Props:
// - articlesRead: number
// - streak: number
// - period: 'today' | 'week' | 'month'
```

#### ElectionCircle.jsx
Countdown circle for upcoming elections.

```jsx
// Props:
// - daysUntil: number
// - level: 'local' | 'state' | 'federal'
// - electionName: string
// - date: string

// Colors:
// local: #F59E0B (orange)
// state: #8B5CF6 (purple)
// federal: #3B82F6 (blue)
```

#### RepChip.jsx

```jsx
// Props:
// - name: string
// - role: string
// - party: 'D' | 'R' | 'I'
// - avatarInitials: string
// - onClick?: function

// Party colors:
// D: Blue gradient
// R: Red gradient
// I: Purple gradient
```

#### SourceCard.jsx

```jsx
// Props:
// - name: string
// - logo?: string (or abbreviation)
// - bias: string
// - owner: string
// - isLocal?: boolean
// - onClick?: function
```

#### QuizCard.jsx

```jsx
// Props:
// - title: string
// - questionCount: number
// - xpReward: number
// - onClick?: function
```

#### StreakBadge.jsx

```jsx
// Props:
// - days: number
// Style: Orange background, flame icon
```

#### LevelBadge.jsx

```jsx
// Props:
// - level: number
// Style: Purple background
```

#### XPBar.jsx

```jsx
// Props:
// - current: number
// - max: number
// - label?: string
// Gradient: Gold to Orange
```

#### ConsumptionChart.jsx

```jsx
// Props:
// - leftPercent: number
// - centerPercent: number
// - rightPercent: number
// - period: string

// Displays: Stacked bar chart with legend
```

---

## 3. Styling Approach

### 3.1 CSS Variables (variables.css)

```css
:root {
  /* Background Colors - Dark mode default */
  --bg-primary: #0A0A0A;
  --bg-secondary: #141414;
  --bg-tertiary: #1F1F1F;

  /* Text Colors */
  --text-primary: #FAFAFA;
  --text-secondary: #A1A1A1;
  --text-tertiary: #6B6B6B;

  /* Border */
  --border: #2A2A2A;

  /* Accent - Purple for neutral active states */
  --accent: #A855F7;
  --accent-purple: #8B5CF6;
  --accent-light: #1E1B2E;

  /* Semantic Colors */
  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;

  /* Political Gradient - BLUE LEFT, RED RIGHT (CRITICAL) */
  --gradient-start: #2563EB;
  --gradient-end: #DC2626;

  /* Bias Spectrum */
  --bias-left: #3B82F6;
  --bias-center: #A855F7;
  --bias-right: #EF4444;

  /* Government Levels */
  --level-local: #F59E0B;
  --level-state: #8B5CF6;
  --level-federal: #3B82F6;

  /* Gamification */
  --xp-gold: #F59E0B;
  --streak-orange: #F97316;
  --badge-purple: #8B5CF6;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.4);
  --shadow-lg: 0 10px 20px rgba(0,0,0,0.5);
}

/* Light mode (opt-in) */
.light-mode {
  --bg-primary: #FAFAFA;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F5F5F5;
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --border: #E5E5E5;
  --accent: #7C3AED;
  --accent-light: #F3E8FF;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

### 3.2 Typography Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Logo | 48px | 800 | CIVIQ branding |
| Page Title | 22-28px | 700 | Screen headers |
| Section Header | 16px | 600 | Card titles |
| Body | 14px | 400 | General content |
| Secondary | 13px | 400 | Subtitles, metadata |
| Caption | 11px | 400 | Timestamps |
| Micro | 9-10px | 600 | Tags, labels |

### 3.3 Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 3.4 Critical Design Rules

1. **Political Gradient Direction**: Blue (#2563EB) ALWAYS on LEFT, Red (#DC2626) ALWAYS on RIGHT
2. **Active States**: Use Purple (#8B5CF6), never solid blue or red
3. **No Political Buttons**: Any CTA button must use gradient, not solid blue/red
4. **Content Order**: Local first, then State, then Federal
5. **Dark Mode Default**: Light mode is opt-in only

### 3.5 Logo Gradient

```css
.logo-gradient {
  background: linear-gradient(90deg, #2563EB 40%, #DC2626 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 3.6 Primary Button Gradient

```css
.btn-gradient {
  background: linear-gradient(90deg, #2563EB 0%, #8B5CF6 50%, #DC2626 100%);
}
```

---

## 4. Routing Map

### 4.1 Route Definitions

```jsx
// App.jsx routing structure

<Routes>
  {/* Onboarding (0x series) */}
  <Route path="/login" element={<LoginScreen />} />
  <Route path="/register" element={<RegisterScreen />} />
  <Route path="/verify" element={<VerifyScreen />} />
  <Route path="/verify/location" element={<VerifyLocationScreen />} />
  <Route path="/setup" element={<SetupScreen />} />
  <Route path="/engagement" element={<EngagementScreen />} />

  {/* Main App (authenticated) */}
  <Route path="/" element={<AppLayout />}>
    {/* Home (1x series) */}
    <Route index element={<Navigate to="/home" />} />
    <Route path="home" element={<HomeScreen />}>
      <Route index element={<Navigate to="voices" />} />
      <Route path="voices" element={<VoicesTab />} />
      <Route path="elections" element={<ElectionsTab />} />
      <Route path="bills" element={<BillsTab />} />
    </Route>
    <Route path="bill/:id" element={<BillDetailScreen />} />
    <Route path="election/:id" element={<ElectionDetailScreen />} />

    {/* Leaders (2x series) */}
    <Route path="leaders" element={<LeadersScreen />} />
    <Route path="leader/:id" element={<LeaderProfileScreen />} />
    <Route path="compare/candidates" element={<CandidateCompareScreen />} />

    {/* Media (3x series) */}
    <Route path="media" element={<MediaScreen />} />
    <Route path="source/:id" element={<SourceProfileScreen />} />
    <Route path="article/:id" element={<ArticleScreen />} />
    <Route path="compare/sources" element={<SourceCompareScreen />} />

    {/* Learn (4x series) */}
    <Route path="learn" element={<LearnScreen />} />
    <Route path="quiz/:id" element={<QuizScreen />} />
    <Route path="ghost-advisor" element={<GhostAdvisorScreen />} />

    {/* Profile/Settings (9x series) */}
    <Route path="profile" element={<ProfileScreen />} />
    <Route path="voter-card" element={<VoterCardScreen />} />
    <Route path="settings" element={<SettingsScreen />} />
    <Route path="notifications" element={<NotificationsScreen />} />
    <Route path="search" element={<SearchScreen />} />
    <Route path="rebalance" element={<RebalanceScreen />} />
  </Route>

  {/* 404 */}
  <Route path="*" element={<Navigate to="/home" />} />
</Routes>
```

### 4.2 Route-to-Wireframe Mapping

| Route | Wireframe | Description |
|-------|-----------|-------------|
| `/login` | 0a-login.html | Email/password login |
| `/register` | 0b-register.html | Create account |
| `/verify` | 0c-verify.html | Email verification |
| `/verify/location` | 0c-verify-location.html | ZIP/location verify |
| `/setup` | 0d-setup.html | Welcome + setup |
| `/engagement` | 0e-engagement.html | Personalization |
| `/home` | 01-home-unified.html | Main home tabs |
| `/home/voices` | 1a-home-voices.html | Media feed tab |
| `/home/elections` | 1d-home-elections.html | Elections tab |
| `/home/bills` | 1e-home-bills.html | Bills tab |
| `/bill/:id` | 1f-bill-detail.html | Bill details |
| `/election/:id` | 1g-election-detail.html | Election details |
| `/leaders` | 2a-leaders.html | Representatives list |
| `/leader/:id` | 2b-leader-profile.html | Leader profile |
| `/compare/candidates` | 2c-candidate-compare.html | Compare candidates |
| `/media` | 3a-media.html | Sources & stories |
| `/source/:id` | 3b-source-profile.html | Source details |
| `/article/:id` | 3c-article.html | Article view |
| `/compare/sources` | 3d-source-compare.html | Compare sources |
| `/learn` | 4a-learn.html | Education hub |
| `/quiz/:id` | 4b-quiz.html | Quiz interface |
| `/ghost-advisor` | 4c-ghost-advisor.html | Ghost panel |
| `/profile` | 9a-profile.html | User profile |
| `/voter-card` | 9b-voter-card.html | Voter ID card |
| `/settings` | 9c-settings.html | App settings |
| `/notifications` | 9d-notifications.html | Notification prefs |
| `/search` | 9e-search.html | Global search |
| `/rebalance` | 9f-rebalance.html | Bias rebalance |

---

## 5. State Management

### 5.1 Context Providers

#### AuthContext

```jsx
const AuthContext = createContext();

// State:
{
  user: null | {
    id: string,
    email: string,
    isVerified: boolean
  },
  isAuthenticated: boolean,
  isLoading: boolean
}

// Actions:
- login(email, password)
- register(email, password, zip)
- logout()
- verifyEmail(token)
- resetPassword(email)
```

#### UserContext

```jsx
const UserContext = createContext();

// State:
{
  profile: {
    id: string,
    displayName: string,
    handle: string,
    avatarInitials: string,
    zip: string,
    county: string,
    state: string,
    voterStatus: 'active' | 'inactive' | 'unregistered',
    partyAffiliation: 'D' | 'R' | 'I' | 'none'
  },
  stats: {
    level: number,
    xp: number,
    xpToNextLevel: number,
    streak: number,
    articlesRead: number,
    quizzesCompleted: number,
    badges: string[]
  },
  biasProfile: {
    left: number,
    center: number,
    right: number,
    period: 'week' | 'month' | 'all'
  },
  representatives: Representative[],
  upcomingElections: Election[]
}
```

#### NavigationContext

```jsx
const NavigationContext = createContext();

// State:
{
  activeTab: 'home' | 'leaders' | 'media' | 'learn',
  homeSubTab: 'voices' | 'elections' | 'bills',
  mediaSubTab: 'sources' | 'stories',
  voterCardOpen: boolean
}

// Actions:
- setActiveTab(tab)
- setHomeSubTab(tab)
- toggleVoterCard()
```

### 5.2 Local Storage Keys

```javascript
const STORAGE_KEYS = {
  AUTH_TOKEN: 'civiq_auth_token',
  USER_PROFILE: 'civiq_user_profile',
  THEME: 'civiq_theme', // 'dark' | 'light'
  STREAK_LAST_DATE: 'civiq_streak_date',
  ONBOARDING_COMPLETE: 'civiq_onboarded'
};
```

### 5.3 Custom Hooks

#### useAuth()

```javascript
// Returns: { user, isAuthenticated, login, logout, register }
```

#### useUser()

```javascript
// Returns: { profile, stats, biasProfile, representatives, updateProfile }
```

#### useReadingStats()

```javascript
// Returns: { articlesRead, addArticle, getStats(period) }
```

#### useStreak()

```javascript
// Returns: { currentStreak, checkIn, lastCheckIn }
```

---

## 6. Build Phases

### Phase 1: Core Shell
**Estimated Time:** 1-2 days
**Priority:** CRITICAL

- [ ] Initialize Vite + React project
- [ ] Set up CSS variables (variables.css)
- [ ] Create DeviceFrame component
- [ ] Create StatusBar component
- [ ] Create Header component (basic)
- [ ] Create BottomNav component with icons
- [ ] Set up React Router with basic routes
- [ ] Create AppLayout wrapper
- [ ] Implement navigation state management

**Deliverable:** Working app shell with navigation between 4 main sections (placeholder screens)

### Phase 2: Home Section
**Estimated Time:** 2-3 days
**Priority:** HIGH

- [ ] HomeScreen with tab toggle (Voices/Elections/Bills)
- [ ] ElectionCircle component
- [ ] Election countdown cards
- [ ] VoicesTab with news feed layout
- [ ] ElectionsTab with upcoming elections list
- [ ] BillsTab with tracked bills
- [ ] Accordion component for election details
- [ ] VoterCardFAB component
- [ ] VoterCard popup component

**Deliverable:** Fully functional Home section with all 3 tabs

### Phase 3: Leaders Section
**Estimated Time:** 2 days
**Priority:** HIGH

- [ ] LeadersScreen with Local/State/Federal sections
- [ ] PA state flag banner component
- [ ] RepChip component
- [ ] LeaderProfileScreen
- [ ] Party badges (D/R/I)
- [ ] CandidateCompareScreen

**Deliverable:** Browse representatives at all government levels

### Phase 4: Media Section
**Estimated Time:** 2 days
**Priority:** HIGH

- [ ] MediaScreen with Sources/Stories toggle
- [ ] SourceCard component
- [ ] Category headers with icons
- [ ] BiasBar component
- [ ] BiasLabel component
- [ ] SourceProfileScreen
- [ ] ArticleScreen with bias summary
- [ ] ReadingStats component
- [ ] SourceCompareScreen

**Deliverable:** Browse media sources with bias ratings

### Phase 5: Learn Section
**Estimated Time:** 2-3 days
**Priority:** MEDIUM

- [ ] LearnScreen with Knowledge/Bias sections
- [ ] Quiz category accordions
- [ ] Progress indicators (mini progress bars)
- [ ] XP/Level display
- [ ] StreakBadge component
- [ ] QuizScreen interface
- [ ] Answer selection UI
- [ ] Results/XP animation
- [ ] GhostAdvisorScreen

**Deliverable:** Complete learning system with quizzes and progress

### Phase 6: Onboarding Flow
**Estimated Time:** 2 days
**Priority:** HIGH

- [ ] LoginScreen with social options
- [ ] RegisterScreen with ZIP input
- [ ] Progress bar (3 steps)
- [ ] VerifyScreen (email)
- [ ] VerifyLocationScreen (map pin)
- [ ] SetupScreen (welcome)
- [ ] EngagementScreen (preferences)
- [ ] Onboarding state management
- [ ] Route guards for authenticated routes

**Deliverable:** Complete new user onboarding experience

### Phase 7: Settings/Profile
**Estimated Time:** 1-2 days
**Priority:** MEDIUM

- [ ] ProfileScreen with stats
- [ ] ConsumptionChart (bias breakdown)
- [ ] Voting record display
- [ ] Badges earned section
- [ ] VoterCardScreen (full view)
- [ ] SettingsScreen
- [ ] NotificationsScreen
- [ ] SearchScreen
- [ ] RebalanceScreen

**Deliverable:** User profile and app settings

### Phase 8: API Integration
**Estimated Time:** 3-5 days
**Priority:** MEDIUM

- [ ] Auth API endpoints
- [ ] User profile endpoints
- [ ] Representatives data
- [ ] Elections data
- [ ] Bills data
- [ ] Media sources data
- [ ] Quiz/Learn data
- [ ] Reading stats tracking

**Deliverable:** Live data from backend APIs

---

## 7. Database Schema Reference

**Database:** `lom1ubvhoxxi_sud_claude`
**Table Prefix:** `civiq_`

### Existing Tables (from wireframes)

These tables already exist with seed data:

| Table | Purpose |
|-------|---------|
| `civiq_news_sources` | News outlets (newspapers, online) |
| `civiq_coverage_areas` | Source geographic coverage |
| `civiq_rss_feeds` | RSS feed URLs per source |
| `civiq_social_media` | Source social accounts |
| `civiq_government_refs` | Gov entities referenced |
| `civiq_tv_stations` | Television stations |
| `civiq_tv_coverage` | TV market coverage |
| `civiq_tv_social_media` | TV station social |
| `civiq_radio_stations` | Radio stations |
| `civiq_government_sources` | Official gov websites |
| `civiq_data_sources` | Civic data portals |
| `civiq_aggregators` | News aggregator networks |
| `civiq_aggregator_sites` | Local aggregator sites |
| `civiq_ownership_groups` | Media ownership info |

### Tables to Create

```sql
-- Users
CREATE TABLE civiq_users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    handle VARCHAR(50) UNIQUE,
    zip VARCHAR(10),
    county VARCHAR(100),
    state VARCHAR(2),
    voter_status ENUM('active', 'inactive', 'unregistered') DEFAULT 'unregistered',
    party_affiliation ENUM('D', 'R', 'I', 'none') DEFAULT 'none',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Stats
CREATE TABLE civiq_user_stats (
    user_id VARCHAR(36) PRIMARY KEY,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_streak_date DATE,
    articles_read INT DEFAULT 0,
    quizzes_completed INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES civiq_users(id) ON DELETE CASCADE
);

-- User Badges
CREATE TABLE civiq_user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    badge_id VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES civiq_users(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, badge_id)
);

-- Bias Tracking
CREATE TABLE civiq_reading_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    source_id VARCHAR(50),
    article_url VARCHAR(500),
    bias_rating ENUM('left', 'lean-left', 'center', 'lean-right', 'right'),
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES civiq_users(id) ON DELETE CASCADE
);

-- Quiz Progress
CREATE TABLE civiq_quiz_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    quiz_id VARCHAR(50) NOT NULL,
    questions_answered INT DEFAULT 0,
    questions_correct INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES civiq_users(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, quiz_id)
);

-- Tracked Bills
CREATE TABLE civiq_user_bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    bill_id VARCHAR(50) NOT NULL,
    tracked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES civiq_users(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, bill_id)
);
```

---

## 8. API Endpoints (Planned)

**Base URL:** `https://fitaf570.com/sud/claude/civiq/api/`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new account |
| POST | `/auth/login` | Email/password login |
| POST | `/auth/logout` | Invalidate session |
| POST | `/auth/verify-email` | Verify email token |
| POST | `/auth/forgot-password` | Request reset email |
| POST | `/auth/reset-password` | Set new password |
| GET | `/auth/me` | Get current user |

### User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get user profile |
| PUT | `/users/profile` | Update profile |
| GET | `/users/stats` | Get XP, level, streak |
| GET | `/users/badges` | Get earned badges |
| GET | `/users/bias` | Get bias consumption data |
| GET | `/users/representatives` | Get user's reps |
| GET | `/users/elections` | Get upcoming elections |

### Content Feeds

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/feed/voices` | Local news feed |
| GET | `/feed/elections` | Elections feed |
| GET | `/feed/bills` | Bills feed |
| GET | `/sources` | Media sources list |
| GET | `/sources/:id` | Source details |
| GET | `/articles/:id` | Article details |

### Leaders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leaders` | Representatives list |
| GET | `/leaders/:id` | Leader profile |
| GET | `/leaders/compare` | Compare candidates |

### Learn

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/learn/categories` | Quiz categories |
| GET | `/learn/quiz/:id` | Quiz questions |
| POST | `/learn/quiz/:id/submit` | Submit answers |
| GET | `/learn/progress` | User progress |

### Actions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/track/article` | Log article read |
| POST | `/track/bill/:id` | Track bill |
| DELETE | `/track/bill/:id` | Untrack bill |
| POST | `/streak/checkin` | Daily check-in |

---

## 9. Design Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Jan 4, 2026 | Active state = Purple (#8B5CF6) | Cannot use solid blue or red - politically charged. Purple represents the blend of both sides. |
| Jan 4, 2026 | Home icon = fa-layer-group | Stack represents layered content feed |
| Jan 4, 2026 | Leaders icon = fa-landmark | Capitol/landmark = clear government association |
| Jan 4, 2026 | Media icon = fa-file-lines | Article icon represents content consumption |
| Jan 4, 2026 | Learn icon = fa-graduation-cap | Achievement through education |
| Jan 4, 2026 | Font Awesome only - no custom SVGs | Custom line icons looked unprofessional. FA is consistent. |
| Jan 4, 2026 | Bias Rebalance moved to Media | Keep Home feed clean. Bias tracking belongs with reading context. |
| Jan 4, 2026 | 3-step onboarding | Simplified: Register -> Welcome -> Personalize -> Home |
| Jan 4, 2026 | All action buttons use gradient | No solid red buttons (logout, delete) - use gradient instead |
| Jan 4, 2026 | Dark mode default | Light mode is opt-in |
| Jan 4, 2026 | Local content first | All lists: Local -> State -> Federal ordering |

---

## Development Notes

### Environment Variables (.env)

```env
VITE_API_BASE_URL=https://fitaf570.com/sud/claude/civiq/api
VITE_APP_NAME=CIVIQ
VITE_APP_TAGLINE=Your Political Intelligence
```

### Key Implementation Notes

1. **Device Frame**: Optional wrapper for wireframe preview mode. Production app won't use it.

2. **Voter Card FAB**: Always visible on main screens, opens bottom sheet overlay.

3. **Tab State**: Home tabs (Voices/Elections/Bills) should persist when navigating away and back.

4. **Bias Tracking**: Every article read should be logged with source bias rating for consumption analytics.

5. **Streak Logic**: User gets credit for a day if they:
   - Read 1+ articles, OR
   - Complete 1+ quiz, OR
   - Log in and interact with Learn section

6. **XP Rewards**:
   - Read article: +5 XP
   - Complete quiz: +25-45 XP (varies by difficulty)
   - Maintain streak: +10 XP bonus per day
   - First vote badge: +100 XP

---

**Document Status:** Ready for Phase 1 development
**Next Review:** After Phase 1 completion
