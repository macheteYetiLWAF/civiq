import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { TabToggle, Card } from '../../components/ui';
import './MediaScreen.css';

const TAB_OPTIONS = [
  { label: 'Stories', value: 'stories' },
  { label: 'Sources', value: 'sources' },
];

const STORY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'International', value: 'international' },
  { label: 'National', value: 'national' },
  { label: 'State', value: 'state' },
];

// National/International Sources by Category
// Order: Networks → Newspapers → Weekly Magazines → Digital-First → Podcasts → Carriers → Scientific Journals → Think Tanks → Official Documents
const MEDIA_SOURCES = {
  networks: {
    title: 'Networks',
    subtitle: 'Television & cable news',
    icon: 'fa-tv',
    color: '#EF4444',
    sources: [
      { id: 'cnn', name: 'CNN', abbr: 'CNN', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 78 },
      { id: 'fox', name: 'FOX News', abbr: 'FOX', bias: 'Lean Right', biasColor: '#EF4444', credibility: 65 },
      { id: 'msnbc', name: 'MSNBC', abbr: 'MS', bias: 'Left', biasColor: '#2563EB', credibility: 72 },
      { id: 'abc', name: 'ABC News', abbr: 'ABC', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 82 },
      { id: 'cbs', name: 'CBS News', abbr: 'CBS', bias: 'Center', biasColor: '#8B5CF6', credibility: 84 },
      { id: 'nbc', name: 'NBC News', abbr: 'NBC', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 80 },
      { id: 'pbs', name: 'PBS NewsHour', abbr: 'PBS', bias: 'Center', biasColor: '#8B5CF6', credibility: 92 },
      { id: 'bbc', name: 'BBC News', abbr: 'BBC', bias: 'Center', biasColor: '#8B5CF6', credibility: 90 },
    ]
  },
  newspapers: {
    title: 'Newspapers',
    subtitle: 'Daily print & digital publications',
    icon: 'fa-newspaper',
    color: '#3B82F6',
    sources: [
      { id: 'nyt', name: 'New York Times', abbr: 'NYT', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 88 },
      { id: 'wsj', name: 'Wall Street Journal', abbr: 'WSJ', bias: 'Center', biasColor: '#8B5CF6', credibility: 90 },
      { id: 'wapo', name: 'Washington Post', abbr: 'WP', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 86 },
      { id: 'ap', name: 'Associated Press', abbr: 'AP', bias: 'Center', biasColor: '#8B5CF6', credibility: 94 },
      { id: 'reuters', name: 'Reuters', abbr: 'R', bias: 'Center', biasColor: '#8B5CF6', credibility: 94 },
      { id: 'guardian', name: 'The Guardian', abbr: 'TG', bias: 'Left', biasColor: '#2563EB', credibility: 82 },
      { id: 'usatoday', name: 'USA Today', abbr: 'USA', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 76 },
      { id: 'latimes', name: 'Los Angeles Times', abbr: 'LAT', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 82 },
    ]
  },
  weeklyMagazines: {
    title: 'Weekly News Magazines',
    subtitle: 'In-depth analysis & commentary',
    icon: 'fa-book-open',
    color: '#6366F1',
    sources: [
      { id: 'economist', name: 'The Economist', abbr: 'TE', bias: 'Center', biasColor: '#8B5CF6', credibility: 91 },
      { id: 'atlantic', name: 'The Atlantic', abbr: 'ATL', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 85 },
      { id: 'newyorker', name: 'The New Yorker', abbr: 'NYR', bias: 'Left', biasColor: '#2563EB', credibility: 88 },
      { id: 'time', name: 'Time', abbr: 'TM', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 80 },
      { id: 'newsweek', name: 'Newsweek', abbr: 'NW', bias: 'Center', biasColor: '#8B5CF6', credibility: 72 },
      { id: 'theweek', name: 'The Week', abbr: 'TW', bias: 'Center', biasColor: '#8B5CF6', credibility: 78 },
      { id: 'usnews', name: 'U.S. News & World Report', abbr: 'USN', bias: 'Center', biasColor: '#8B5CF6', credibility: 76 },
      { id: 'bloomberg-bw', name: 'Bloomberg Businessweek', abbr: 'BBW', bias: 'Center', biasColor: '#8B5CF6', credibility: 86 },
      { id: 'ft', name: 'Financial Times', abbr: 'FT', bias: 'Center', biasColor: '#8B5CF6', credibility: 90 },
      { id: 'foreignaffairs', name: 'Foreign Affairs', abbr: 'FA', bias: 'Center', biasColor: '#8B5CF6', credibility: 92 },
      { id: 'foreignpolicy', name: 'Foreign Policy', abbr: 'FP', bias: 'Center', biasColor: '#8B5CF6', credibility: 88 },
      { id: 'spectator', name: 'The Spectator', abbr: 'SP', bias: 'Lean Right', biasColor: '#EF4444', credibility: 75 },
      { id: 'nation', name: 'The Nation', abbr: 'TN', bias: 'Left', biasColor: '#2563EB', credibility: 72 },
      { id: 'nationalreview', name: 'National Review', abbr: 'NR', bias: 'Right', biasColor: '#DC2626', credibility: 70 },
    ]
  },
  digitalFirst: {
    title: 'Digital-First',
    subtitle: 'Online-native news publications',
    icon: 'fa-globe',
    color: '#8B5CF6',
    sources: [
      { id: 'axios', name: 'Axios', abbr: 'AX', bias: 'Center', biasColor: '#8B5CF6', credibility: 82 },
      { id: 'politico', name: 'Politico', abbr: 'POL', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 84 },
      { id: 'thehill', name: 'The Hill', abbr: 'TH', bias: 'Center', biasColor: '#8B5CF6', credibility: 78 },
      { id: 'vox', name: 'Vox', abbr: 'VOX', bias: 'Left', biasColor: '#2563EB', credibility: 74 },
      { id: 'dailywire', name: 'Daily Wire', abbr: 'DW', bias: 'Right', biasColor: '#DC2626', credibility: 62 },
      { id: 'bp', name: 'Breaking Points', abbr: 'BP', bias: 'Center', biasColor: '#8B5CF6', credibility: 75 },
      { id: 'buzzfeednews', name: 'BuzzFeed News', abbr: 'BFN', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 68 },
      { id: 'huffpost', name: 'HuffPost', abbr: 'HP', bias: 'Left', biasColor: '#2563EB', credibility: 66 },
      { id: 'dailycaller', name: 'Daily Caller', abbr: 'DC', bias: 'Right', biasColor: '#DC2626', credibility: 58 },
      { id: 'slate', name: 'Slate', abbr: 'SL', bias: 'Left', biasColor: '#2563EB', credibility: 72 },
      { id: 'reason', name: 'Reason', abbr: 'RSN', bias: 'Libertarian', biasColor: '#F59E0B', credibility: 76 },
      { id: 'motherjones', name: 'Mother Jones', abbr: 'MJ', bias: 'Left', biasColor: '#2563EB', credibility: 70 },
      { id: 'fivethirtyeight', name: 'FiveThirtyEight', abbr: '538', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 84 },
      { id: 'realclearpolitics', name: 'RealClearPolitics', abbr: 'RCP', bias: 'Center', biasColor: '#8B5CF6', credibility: 76 },
    ]
  },
  podcasts: {
    title: 'Podcasts & Influencers',
    subtitle: 'Independent commentary & analysis',
    icon: 'fa-microphone',
    color: '#F472B6',
    sources: [
      { id: 'jre', name: 'Joe Rogan Experience', abbr: 'JRE', bias: 'Lean Right', biasColor: '#EF4444', credibility: 60 },
      { id: 'pbd', name: 'PBD Podcast', abbr: 'PBD', bias: 'Lean Right', biasColor: '#EF4444', credibility: 58 },
      { id: 'pod-save', name: 'Pod Save America', abbr: 'PSA', bias: 'Left', biasColor: '#2563EB', credibility: 70 },
      { id: 'ben-shapiro', name: 'Ben Shapiro Show', abbr: 'BS', bias: 'Right', biasColor: '#DC2626', credibility: 62 },
      { id: 'lex-fridman', name: 'Lex Fridman Podcast', abbr: 'LF', bias: 'Center', biasColor: '#8B5CF6', credibility: 72 },
      { id: 'all-in', name: 'All-In Podcast', abbr: 'ALL', bias: 'Lean Right', biasColor: '#EF4444', credibility: 68 },
      { id: 'majority-report', name: 'Majority Report', abbr: 'MR', bias: 'Left', biasColor: '#2563EB', credibility: 64 },
      { id: 'tim-pool', name: 'Timcast IRL', abbr: 'TP', bias: 'Right', biasColor: '#DC2626', credibility: 52 },
      { id: 'bari-weiss', name: 'Honestly w/ Bari Weiss', abbr: 'BW', bias: 'Center', biasColor: '#8B5CF6', credibility: 74 },
      { id: 'megyn-kelly', name: 'Megyn Kelly Show', abbr: 'MK', bias: 'Lean Right', biasColor: '#EF4444', credibility: 66 },
      { id: 'matt-walsh', name: 'Matt Walsh Show', abbr: 'MW', bias: 'Right', biasColor: '#DC2626', credibility: 56 },
      { id: 'crooked-media', name: 'Crooked Media', abbr: 'CM', bias: 'Left', biasColor: '#2563EB', credibility: 68 },
    ]
  },
  carriers: {
    title: 'Carriers',
    subtitle: 'Wire services & news agencies',
    icon: 'fa-satellite-dish',
    color: '#14B8A6',
    sources: [
      // Major US/UK Wire Services
      { id: 'ap-wire', name: 'Associated Press (AP)', abbr: 'AP', bias: 'Center', biasColor: '#8B5CF6', credibility: 94 },
      { id: 'reuters-wire', name: 'Reuters', abbr: 'R', bias: 'Center', biasColor: '#8B5CF6', credibility: 94 },
      { id: 'afp', name: 'Agence France-Presse', abbr: 'AFP', bias: 'Center', biasColor: '#8B5CF6', credibility: 90 },
      { id: 'upi', name: 'United Press Intl', abbr: 'UPI', bias: 'Center', biasColor: '#8B5CF6', credibility: 78 },
      { id: 'bloomberg-wire', name: 'Bloomberg News', abbr: 'BLM', bias: 'Center', biasColor: '#8B5CF6', credibility: 88 },
      // European Wire Services
      { id: 'dpa', name: 'Deutsche Presse-Agentur', abbr: 'DPA', bias: 'Center', biasColor: '#8B5CF6', credibility: 88 },
      { id: 'efe', name: 'EFE (Spain)', abbr: 'EFE', bias: 'Center', biasColor: '#8B5CF6', credibility: 84 },
      { id: 'ansa', name: 'ANSA (Italy)', abbr: 'ANS', bias: 'Center', biasColor: '#8B5CF6', credibility: 82 },
      { id: 'pa-media', name: 'PA Media (UK)', abbr: 'PA', bias: 'Center', biasColor: '#8B5CF6', credibility: 86 },
      // Asian Wire Services
      { id: 'xinhua', name: 'Xinhua (China)', abbr: 'XH', bias: 'State-Controlled', biasColor: '#F59E0B', credibility: 55 },
      { id: 'kyodo', name: 'Kyodo News (Japan)', abbr: 'KYO', bias: 'Center', biasColor: '#8B5CF6', credibility: 86 },
      { id: 'yonhap', name: 'Yonhap (S. Korea)', abbr: 'YON', bias: 'Center', biasColor: '#8B5CF6', credibility: 84 },
      // Middle East
      { id: 'tass', name: 'TASS (Russia)', abbr: 'TAS', bias: 'State-Controlled', biasColor: '#F59E0B', credibility: 45 },
    ]
  },
  international: {
    title: 'International',
    subtitle: 'Global news & foreign bureaus',
    icon: 'fa-earth-americas',
    color: '#0EA5E9',
    sources: [
      // Middle East & Africa
      { id: 'aljazeera', name: 'Al Jazeera', abbr: 'AJ', bias: 'Center-Left', biasColor: '#3B82F6', credibility: 76 },
      { id: 'aljazeera-arabic', name: 'Al Jazeera Arabic', abbr: 'AJA', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 70 },
      { id: 'alarabiya', name: 'Al Arabiya (UAE)', abbr: 'ARB', bias: 'Center', biasColor: '#8B5CF6', credibility: 72 },
      { id: 'haaretz', name: 'Haaretz (Israel)', abbr: 'HA', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 82 },
      { id: 'jpost', name: 'Jerusalem Post (Israel)', abbr: 'JP', bias: 'Center', biasColor: '#8B5CF6', credibility: 78 },
      { id: 'timesofisrael', name: 'Times of Israel', abbr: 'TOI', bias: 'Center', biasColor: '#8B5CF6', credibility: 80 },
      { id: 'i24news', name: 'i24NEWS (Israel)', abbr: 'i24', bias: 'Center', biasColor: '#8B5CF6', credibility: 74 },
      { id: 'middleeasteye', name: 'Middle East Eye', abbr: 'MEE', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 68 },
      // European
      { id: 'dw', name: 'Deutsche Welle (Germany)', abbr: 'DW', bias: 'Center', biasColor: '#8B5CF6', credibility: 86 },
      { id: 'france24', name: 'France 24', abbr: 'F24', bias: 'Center', biasColor: '#8B5CF6', credibility: 84 },
      { id: 'euronews', name: 'Euronews', abbr: 'EN', bias: 'Center', biasColor: '#8B5CF6', credibility: 80 },
      { id: 'derspiegel', name: 'Der Spiegel (Germany)', abbr: 'SPG', bias: 'Center-Left', biasColor: '#3B82F6', credibility: 84 },
      { id: 'lemonde', name: 'Le Monde (France)', abbr: 'LM', bias: 'Center-Left', biasColor: '#3B82F6', credibility: 86 },
      { id: 'elpais', name: 'El País (Spain)', abbr: 'EP', bias: 'Center-Left', biasColor: '#3B82F6', credibility: 82 },
      { id: 'corriere', name: 'Corriere della Sera (Italy)', abbr: 'CDS', bias: 'Center', biasColor: '#8B5CF6', credibility: 80 },
      { id: 'telegraph', name: 'The Telegraph (UK)', abbr: 'TEL', bias: 'Lean Right', biasColor: '#EF4444', credibility: 78 },
      { id: 'times-uk', name: 'The Times (UK)', abbr: 'TT', bias: 'Center', biasColor: '#8B5CF6', credibility: 84 },
      { id: 'independent', name: 'The Independent (UK)', abbr: 'IND', bias: 'Lean Left', biasColor: '#3B82F6', credibility: 76 },
      { id: 'irisht', name: 'Irish Times', abbr: 'IT', bias: 'Center', biasColor: '#8B5CF6', credibility: 82 },
      // Asia-Pacific
      { id: 'scmp', name: 'South China Morning Post', abbr: 'SCP', bias: 'Center', biasColor: '#8B5CF6', credibility: 78 },
      { id: 'japantimes', name: 'Japan Times', abbr: 'JT', bias: 'Center', biasColor: '#8B5CF6', credibility: 82 },
      { id: 'straitstimes', name: 'Straits Times (Singapore)', abbr: 'ST', bias: 'Center', biasColor: '#8B5CF6', credibility: 80 },
      { id: 'abc-au', name: 'ABC Australia', abbr: 'ABA', bias: 'Center', biasColor: '#8B5CF6', credibility: 86 },
      { id: 'smh', name: 'Sydney Morning Herald', abbr: 'SMH', bias: 'Center-Left', biasColor: '#3B82F6', credibility: 82 },
      // Americas
      { id: 'cbc', name: 'CBC (Canada)', abbr: 'CBC', bias: 'Center', biasColor: '#8B5CF6', credibility: 84 },
      { id: 'globemail', name: 'Globe and Mail (Canada)', abbr: 'G&M', bias: 'Center', biasColor: '#8B5CF6', credibility: 82 },
    ]
  },
  science: {
    title: 'Scientific Journals',
    subtitle: 'Research & academic sources',
    icon: 'fa-flask',
    color: '#F59E0B',
    sources: [
      { id: 'nature', name: 'Nature', abbr: 'N', bias: 'Peer Reviewed', biasColor: '#F59E0B', credibility: 98 },
      { id: 'nejm', name: 'NEJM', abbr: 'NE', bias: 'Peer Reviewed', biasColor: '#F59E0B', credibility: 99 },
      { id: 'lancet', name: 'The Lancet', abbr: 'TL', bias: 'Peer Reviewed', biasColor: '#F59E0B', credibility: 98 },
      { id: 'science', name: 'Science Magazine', abbr: 'SM', bias: 'Peer Reviewed', biasColor: '#F59E0B', credibility: 97 },
      { id: 'pnas', name: 'PNAS', abbr: 'PN', bias: 'Peer Reviewed', biasColor: '#F59E0B', credibility: 96 },
    ]
  },
  thinkTanks: {
    title: 'Think Tanks',
    subtitle: 'Policy research organizations',
    icon: 'fa-building-columns',
    color: '#EC4899',
    sources: [
      // Domestic - Left/Center-Left
      { id: 'brookings', name: 'Brookings Institution', abbr: 'BR', bias: 'Center-Left', biasColor: '#3B82F6', credibility: 88 },
      { id: 'cap', name: 'Center for American Progress', abbr: 'CAP', bias: 'Left', biasColor: '#2563EB', credibility: 80 },
      { id: 'urban', name: 'Urban Institute', abbr: 'UI', bias: 'Center-Left', biasColor: '#3B82F6', credibility: 86 },
      // Domestic - Center
      { id: 'cfr', name: 'Council on Foreign Relations', abbr: 'CFR', bias: 'Center', biasColor: '#8B5CF6', credibility: 90 },
      { id: 'rand', name: 'RAND Corporation', abbr: 'RND', bias: 'Center', biasColor: '#8B5CF6', credibility: 92 },
      { id: 'csis', name: 'CSIS', abbr: 'CSI', bias: 'Center', biasColor: '#8B5CF6', credibility: 88 },
      // Domestic - Right/Center-Right
      { id: 'heritage', name: 'Heritage Foundation', abbr: 'HF', bias: 'Right', biasColor: '#DC2626', credibility: 75 },
      { id: 'aei', name: 'American Enterprise Institute', abbr: 'AEI', bias: 'Center-Right', biasColor: '#EF4444', credibility: 82 },
      { id: 'cato', name: 'Cato Institute', abbr: 'CAT', bias: 'Libertarian', biasColor: '#F59E0B', credibility: 80 },
      { id: 'manhattan', name: 'Manhattan Institute', abbr: 'MI', bias: 'Center-Right', biasColor: '#EF4444', credibility: 78 },
      // Foreign
      { id: 'chatham', name: 'Chatham House (UK)', abbr: 'CH', bias: 'Center', biasColor: '#8B5CF6', credibility: 90 },
      { id: 'iiss', name: 'IISS (UK)', abbr: 'IIS', bias: 'Center', biasColor: '#8B5CF6', credibility: 88 },
      { id: 'bruegel', name: 'Bruegel (EU)', abbr: 'BRU', bias: 'Center', biasColor: '#8B5CF6', credibility: 86 },
    ]
  },
  official: {
    title: 'Official Documents',
    subtitle: 'Government & public records',
    icon: 'fa-landmark',
    color: '#22C55E',
    sources: [
      { id: 'whitehouse', name: 'WhiteHouse.gov', abbr: 'WH', bias: 'Official', biasColor: '#22C55E', credibility: 95 },
      { id: 'congress', name: 'Congress.gov', abbr: 'CG', bias: 'Official', biasColor: '#22C55E', credibility: 98 },
      { id: 'pa-ga', name: 'PA General Assembly', abbr: 'PA', bias: 'Official', biasColor: '#22C55E', credibility: 96 },
      { id: 'scotus', name: 'Supreme Court', abbr: 'SC', bias: 'Official', biasColor: '#22C55E', credibility: 99 },
      { id: 'gao', name: 'GAO Reports', abbr: 'GAO', bias: 'Official', biasColor: '#22C55E', credibility: 97 },
    ]
  },
};

// Trending Stories Data
const TRENDING_STORIES = [
  { id: 1, title: 'Venezuela Military Operation Enters Week 3', category: 'international', sources: 14, time: '2h ago', hot: true },
  { id: 2, title: 'ICE Enforcement Actions Expand to Sanctuary Cities', category: 'national', sources: 22, time: '4h ago', hot: true },
  { id: 3, title: 'Federal Reserve Signals Rate Decision', category: 'national', sources: 18, time: '6h ago' },
  { id: 4, title: 'Ukraine Peace Negotiations Stall', category: 'international', sources: 11, time: '8h ago' },
  { id: 5, title: '2026 Midterm Election Cycle Analysis', category: 'national', sources: 9, time: '12h ago', hot: true },
  { id: 6, title: 'PA Budget Negotiations Continue', category: 'state', sources: 6, time: '1d ago' },
  { id: 7, title: 'Climate Summit Reaches Preliminary Agreement', category: 'international', sources: 16, time: '1d ago' },
  { id: 8, title: 'Tech Antitrust Hearing Scheduled', category: 'national', sources: 12, time: '1d ago' },
];

// Unified Media Stats Panel - similar design to HomeScreen data panel
// Includes: articles read, streak, reading balance bar
function MediaStatsPanel() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('civiq-stats-collapsed') === 'true';
  });

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('civiq-stats-collapsed', newState.toString());
  };

  // Mock reading balance data
  const readingBalance = { left: 35, center: 20, right: 45 };

  if (collapsed) {
    return (
      <div className="media-stats-panel collapsed" onClick={toggleCollapsed}>
        <div className="stats-collapsed-msg">
          <i className="fas fa-chart-bar"></i>
          Stats hidden · tap to expand
        </div>
      </div>
    );
  }

  return (
    <div className="media-stats-panel">
      <button className="stats-collapse-btn" onClick={toggleCollapsed}>
        <i className="fas fa-chevron-up"></i>
      </button>

      {/* Top row: Articles + Streak */}
      <div className="media-stats-row">
        <div className="media-stat-item">
          <div className="media-stat-value">7</div>
          <div className="media-stat-label">
            <i className="fas fa-newspaper"></i>
            articles today
          </div>
        </div>
        <div className="media-stat-divider"></div>
        <div className="media-stat-item">
          <div className="media-stat-value streak">
            12
            <i className="fas fa-fire"></i>
          </div>
          <div className="media-stat-label">day streak</div>
        </div>
      </div>

      {/* Reading Balance Bar */}
      <div className="media-balance-section">
        <div className="media-balance-header">
          <span className="media-balance-label">Reading Balance</span>
          <Link to="/rebalance" className="media-rebalance-btn">
            <i className="fas fa-scale-balanced"></i>
            Rebalance
          </Link>
        </div>
        <div className="media-balance-bar">
          <div className="balance-segment left" style={{ flex: readingBalance.left }}></div>
          <div className="balance-segment center" style={{ flex: readingBalance.center }}></div>
          <div className="balance-segment right" style={{ flex: readingBalance.right }}></div>
        </div>
        <div className="media-balance-labels">
          <span className="left">{readingBalance.left}% Left</span>
          <span className="center">{readingBalance.center}% Center</span>
          <span className="right">{readingBalance.right}% Right</span>
        </div>
      </div>
    </div>
  );
}

// Source Card for categories
function SourceCard({ source, onClick }) {
  return (
    <div className="media-source-card" onClick={() => onClick(source.id)}>
      <div className="media-source-abbr" style={{ background: source.biasColor }}>
        {source.abbr}
      </div>
      <div className="media-source-info">
        <div className="media-source-name">{source.name}</div>
        <div className="media-source-meta">
          <span className="media-source-bias" style={{ color: source.biasColor }}>{source.bias}</span>
          <span className="media-source-credibility">{source.credibility}% credibility</span>
        </div>
      </div>
      <i className="fas fa-chevron-right media-source-chevron"></i>
    </div>
  );
}

// Category Section - 3-level expand: 0 (header only) → 3 → all
function CategorySection({ category, onSourceClick }) {
  // expandLevel: 0 = header only, 1 = show 3, 2 = show all
  const [expandLevel, setExpandLevel] = useState(0);

  const displaySources = expandLevel === 0
    ? []
    : expandLevel === 1
      ? category.sources.slice(0, 3)
      : category.sources;

  const handleHeaderClick = () => {
    setExpandLevel(prev => prev === 0 ? 1 : 0);
  };

  const handleShowMore = () => {
    setExpandLevel(prev => prev === 1 ? 2 : 1);
  };

  return (
    <div className="media-category">
      <div
        className="media-category-header"
        onClick={handleHeaderClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="media-category-icon" style={{ background: category.color }}>
          <i className={`fas ${category.icon}`}></i>
        </div>
        <div className="media-category-info">
          <div className="media-category-title">{category.title}</div>
          <div className="media-category-subtitle">{category.subtitle}</div>
        </div>
        <span className="media-category-count">{category.sources.length}</span>
        <i className={`fas fa-chevron-${expandLevel > 0 ? 'up' : 'down'} media-category-chevron`}></i>
      </div>
      {expandLevel > 0 && (
        <div className="media-category-sources">
          {displaySources.map(source => (
            <SourceCard key={source.id} source={source} onClick={onSourceClick} />
          ))}
        </div>
      )}
      {expandLevel === 1 && category.sources.length > 3 && (
        <button className="media-show-more" onClick={handleShowMore}>
          Show {category.sources.length - 3} More
        </button>
      )}
      {expandLevel === 2 && category.sources.length > 3 && (
        <button className="media-show-more" onClick={handleShowMore}>
          Show Less
        </button>
      )}
    </div>
  );
}

// Story Card
function StoryCard({ story }) {
  const categoryColors = {
    international: '#8B5CF6',
    national: '#3B82F6',
    state: '#F59E0B',
    local: '#22C55E',
  };

  return (
    <div className="trending-story-card">
      {story.hot && <span className="story-hot-badge">🔥 HOT</span>}
      <div className="story-title">{story.title}</div>
      <div className="story-meta">
        <span className="story-category" style={{ color: categoryColors[story.category] }}>
          {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
        </span>
        <span className="story-sources">{story.sources} sources covering</span>
        <span className="story-time">{story.time}</span>
      </div>
    </div>
  );
}

// Stories Tab Content (just the stories list, no stats panel)
function StoriesTabContent({ filter }) {
  const filteredStories = filter === 'all'
    ? TRENDING_STORIES
    : TRENDING_STORIES.filter(s => s.category === filter);

  return (
    <div className="stories-tab">
      <div className="stories-header">
        <span className="stories-title">Trending Stories</span>
        <span className="stories-count">{filteredStories.length} stories</span>
      </div>
      {filteredStories.map(story => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}

// Sources Tab Content (just the sources list, no stats panel)
function SourcesTabContent({ onSourceClick }) {
  return (
    <div className="sources-tab">
      {Object.entries(MEDIA_SOURCES).map(([key, category]) => (
        <CategorySection key={key} category={category} onSourceClick={onSourceClick} />
      ))}
    </div>
  );
}

export default function MediaScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sources');
  const [storyFilter, setStoryFilter] = useState('all');

  const handleSourceClick = (sourceId) => {
    navigate(`/source/${sourceId}`);
  };

  return (
    <>
      <Header title="Media" />
      <Screen>
        {/* 1. Stats Panel - static content, above all toggles/filters */}
        <MediaStatsPanel />

        {/* 2. Tab Toggle - Stories/Sources */}
        <div style={{ marginBottom: '16px' }}>
          <TabToggle
            options={TAB_OPTIONS}
            activeValue={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* 3. Filters (Stories tab only) - below stats panel */}
        {activeTab === 'stories' && (
          <div className="story-filters">
            {STORY_FILTERS.map(f => (
              <button
                key={f.value}
                className={`story-filter-btn ${storyFilter === f.value ? 'active' : ''}`}
                onClick={() => setStoryFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* 4. Tab Content */}
        {activeTab === 'sources' ? (
          <SourcesTabContent onSourceClick={handleSourceClick} />
        ) : (
          <StoriesTabContent filter={storyFilter} />
        )}
      </Screen>
    </>
  );
}
