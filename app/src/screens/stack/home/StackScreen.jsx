import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { Accordion, Card, BiasLabel, TabToggle } from '../../components/ui';
import { UserStatsHeader, VoterCardFAB, VoterCardModal } from '../../components/features';
import { getVoices, getBills, getNewsFeed } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Content type tabs - the 3 bubbles
const CONTENT_TABS = [
  { label: 'Voices', value: 'voices' },
  { label: 'Elections', value: 'elections' },
  { label: 'Bills', value: 'bills' },
];

// Government level colors
const LEVEL_COLORS = {
  local: '#F59E0B',   // Orange
  state: '#8B5CF6',   // Purple
  federal: '#64748B', // Slate
};

// Stream tag component
function StreamTag({ level, text }) {
  const color = LEVEL_COLORS[level] || LEVEL_COLORS.federal;
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '9px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      padding: '2px 6px',
      borderRadius: '4px',
      marginBottom: '6px',
      background: `${color}20`,
      color: color,
    }}>
      {text}
    </span>
  );
}

// Section header component for government level
function LevelSectionHeader({ level, label }) {
  const color = LEVEL_COLORS[level];
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '20px',
      marginBottom: '12px',
      paddingBottom: '8px',
      borderBottom: `2px solid ${color}`,
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
      }} />
      <span style={{
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: color,
      }}>
        {label}
      </span>
    </div>
  );
}

// Candidate row component
function CandidateRow({ name, role, initials, party }) {
  const partyColor = party === 'D'
    ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)'
    : party === 'R'
    ? 'linear-gradient(135deg, #B91C1C, #EF4444)'
    : 'linear-gradient(135deg, #475569, #64748B)';

  return (
    <Link
      to="/leaders/profile"
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid var(--border)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{
        width: '32px',
        height: '32px',
        background: partyColor,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700,
        color: 'white',
      }}>
        {initials}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{role}</div>
      </div>
      <span style={{
        background: party === 'D' ? '#1D4ED8' : party === 'R' ? '#B91C1C' : '#64748B',
        color: 'white',
        fontSize: '10px',
        fontWeight: 700,
        padding: '2px 6px',
        borderRadius: '4px',
      }}>
        {party}
      </span>
    </Link>
  );
}

// Election item component
function ElectionItem({ election, level }) {
  const color = LEVEL_COLORS[level];
  const daysUntil = election.daysUntil;

  return (
    <div style={{ marginBottom: '12px' }}>
      <StreamTag level={level} text={`${level.charAt(0).toUpperCase() + level.slice(1)} · ${daysUntil} days`} />
      <Accordion
        title={election.title}
        subtitle={election.subtitle}
        borderLeftColor={color}
        defaultOpen={election.defaultOpen}
      >
        {election.candidates && election.candidates.map((candidate, idx) => (
          <CandidateRow
            key={idx}
            name={candidate.name}
            role={candidate.role}
            initials={candidate.initials}
            party={candidate.party}
          />
        ))}
        {election.candidates && election.candidates.length > 0 && (
          <Link
            to="/compare"
            style={{
              display: 'block',
              width: '100%',
              marginTop: '10px',
              padding: '8px 16px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '11px',
              fontWeight: 600,
              textAlign: 'center',
              color: 'var(--text-primary)',
              textDecoration: 'none',
            }}
          >
            Compare Candidates
          </Link>
        )}
      </Accordion>
    </div>
  );
}

// News item component
function NewsItem({ news, level }) {
  const color = LEVEL_COLORS[level];
  const sourceCount = news.sourceCount || 1;

  const biasColorMap = {
    'Left': '#2563EB',
    'Lean Left': '#3B82F6',
    'Center': 'var(--accent)',
    'Lean Right': '#EF4444',
    'Right': '#DC2626',
  };

  const biasColor = biasColorMap[news.bias] || 'var(--accent)';

  return (
    <div style={{ marginBottom: '12px' }}>
      <StreamTag level={level} text={`${level.charAt(0).toUpperCase() + level.slice(1)} News · ${sourceCount} sources`} />
      <Accordion
        title={news.title}
        borderLeftColor={color}
        subtitleElement={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
            <span style={{
              background: `${biasColor}20`,
              color: biasColor,
              fontSize: '9px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600,
            }}>
              {news.bias || 'Center'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
              {news.factuality || news.source || 'Mixed Factuality'}
            </span>
          </div>
        }
      />
    </div>
  );
}

// Bill item component
function BillItem({ bill, level }) {
  const color = LEVEL_COLORS[level];
  const statusColor = bill.status === 'Passed' || bill.status === 'PASSED'
    ? 'var(--success)'
    : bill.status === 'Failed'
    ? 'var(--error)'
    : 'var(--text-tertiary)';

  return (
    <div style={{ marginBottom: '12px' }}>
      <StreamTag level={level} text={`${level.charAt(0).toUpperCase() + level.slice(1)} Bill`} />
      <Link
        to={`/bills/${bill.id || 'detail'}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          padding: '12px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderLeft: `3px solid ${color}`,
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{bill.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {bill.billNumber} · {bill.statusText || bill.status}
            </div>
          </div>
          <div style={{ fontSize: '10px', color: statusColor, fontWeight: 600 }}>
            {bill.status?.toUpperCase()}
          </div>
        </div>
        {bill.repVotes && (
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {bill.repVotes}
          </div>
        )}
        {bill.summary && (
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {bill.summary.substring(0, 100)}{bill.summary.length > 100 ? '...' : ''}
          </div>
        )}
      </Link>
    </div>
  );
}

// Voice item component
function VoiceItem({ voice, level }) {
  const color = LEVEL_COLORS[level] || LEVEL_COLORS.federal;
  const partyColor = voice.party === 'D' ? '#3B82F6' : voice.party === 'R' ? '#EF4444' : '#64748B';

  return (
    <div style={{ marginBottom: '12px' }}>
      <StreamTag level={level} text={`${level.charAt(0).toUpperCase() + level.slice(1)} Voice`} />
      <Link
        to={`/voices/${voice.id}`}
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          padding: '12px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderLeft: `3px solid ${color}`,
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: voice.avatarUrl ? `url(${voice.avatarUrl}) center/cover` : partyColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 700,
          color: 'white',
          flexShrink: 0,
        }}>
          {!voice.avatarUrl && voice.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600 }}>{voice.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            {voice.tagline}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '10px' }}>
            {voice.isOfficial && <span style={{ color: '#22C55E' }}>✓ Official</span>}
            {voice.isJournalist && <span style={{ color: '#3B82F6' }}>✓ Journalist</span>}
            <span style={{ color: 'var(--text-tertiary)' }}>{voice.followers?.toLocaleString()} followers</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Static election data (elections API not yet built)
// Updated Jan 2026 with actual upcoming elections
const STATIC_ELECTIONS = {
  local: [
    {
      id: 'local-municipal-2026',
      title: 'Luzerne County Council',
      subtitle: 'General: Nov 3, 2026 · 5 seats up',
      date: '2026-11-03',
      defaultOpen: false,
      candidates: [],
    },
    {
      id: 'local-primary-2026',
      title: 'Municipal Primary Elections',
      subtitle: 'Primary: May 19, 2026 · Multiple races',
      date: '2026-05-19',
      candidates: [],
    },
    {
      id: 'local-school-board-2027',
      title: 'WB Area School Board',
      subtitle: 'General: Nov 2, 2027 · 4 seats up',
      date: '2027-11-02',
      candidates: [],
    },
  ],
  state: [
    {
      id: 'state-governor-2026',
      title: 'Governor 2026',
      subtitle: 'Term-limited: Josh Shapiro (D) cannot run',
      date: '2026-11-03',
      candidates: [],
    },
    {
      id: 'state-house-121',
      title: 'PA House District 121',
      subtitle: 'Current: Eddie Day Pashinski (D)',
      date: '2026-11-03',
      candidates: [],
    },
  ],
  federal: [
    {
      id: 'federal-house-pa8',
      title: 'U.S. House - PA-8',
      subtitle: 'Current: Matt Cartwright (D) · 7 terms',
      date: '2026-11-03',
      candidates: [],
    },
  ],
};

// Static news data for demo
const STATIC_NEWS = {
  local: [
    {
      id: 'local-news-1',
      title: 'City Council Approves Zoning Change',
      source: "Citizens' Voice",
      bias: 'Center',
      factuality: "Citizens' Voice",
      sourceCount: 3,
    },
  ],
  state: [
    {
      id: 'state-news-1',
      title: 'Governor Signs Education Reform',
      source: 'PA Capitol Bureau',
      bias: 'Center',
      factuality: 'Mixed Factuality',
      sourceCount: 8,
    },
  ],
  federal: [
    {
      id: 'federal-news-1',
      title: 'Senate Passes Infrastructure Bill',
      source: 'AP News',
      bias: 'Lean Left',
      factuality: 'High Factuality',
      sourceCount: 12,
    },
  ],
};

// Static bill for demo
const STATIC_BILLS = {
  federal: [
    {
      id: 'hr-3684',
      title: 'Infrastructure Investment Act',
      billNumber: 'HR 3684',
      status: 'Passed',
      statusText: 'Passed Senate',
      repVotes: 'Cartwright: Voted Yes · Fetterman: Voted Yes',
    },
  ],
};

// Calculate days until a date
function daysUntil(dateString) {
  const today = new Date();
  const target = new Date(dateString);
  return Math.max(0, Math.ceil((target - today) / (1000 * 60 * 60 * 24)));
}

// Add days until to election objects
function processElections(elections) {
  const processed = {};
  for (const [level, items] of Object.entries(elections)) {
    processed[level] = items.map(election => ({
      ...election,
      daysUntil: daysUntil(election.date),
    }));
  }
  return processed;
}

export default function HomeScreen() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('elections');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bills, setBills] = useState([]);
  const [voices, setVoices] = useState([]);
  const [news, setNews] = useState([]);
  const [voterCardOpen, setVoterCardOpen] = useState(false);

  // Use authenticated user data, with fallbacks for stats display
  const userData = {
    first_name: authUser?.first_name || authUser?.name?.split(' ')[0] || 'Guest',
    last_name: authUser?.last_name || authUser?.name?.split(' ').slice(1).join(' ') || '',
    email: authUser?.email,
    zip: authUser?.zip || authUser?.zipcode,
    party: authUser?.party || 'I',
    streak_days: authUser?.streak_days || 0,
    xp_total: authUser?.xp_total || 0,
    reading_balance: authUser?.reading_balance || { left: 0, center: 0, right: 0 },
  };

  // Fetch data from APIs
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [billsRes, voicesRes, newsRes] = await Promise.allSettled([
          getBills({ limit: 10 }),
          getVoices({ limit: 10 }),
          getNewsFeed({ limit: 10 }),
        ]);

        // Process bills
        if (billsRes.status === 'fulfilled' && billsRes.value?.bills) {
          setBills(billsRes.value.bills);
        }

        // Process voices
        if (voicesRes.status === 'fulfilled' && voicesRes.value?.voices) {
          setVoices(voicesRes.value.voices);
        }

        // Process news
        if (newsRes.status === 'fulfilled' && newsRes.value?.articles) {
          setNews(newsRes.value.articles);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Process elections with days until
  const elections = processElections(STATIC_ELECTIONS);

  // Calculate days until elections for progress circles
  // Updated Jan 2026: Next elections are 2026 primaries and generals
  const localPrimary = new Date('2026-05-19');  // PA Municipal Primary 2026
  const statePrimary = new Date('2026-05-19');  // PA State Primary 2026
  const federalGeneral = new Date('2026-11-03'); // Federal General 2026
  const today = new Date();

  const daysUntilLocal = Math.max(0, Math.ceil((localPrimary - today) / (1000 * 60 * 60 * 24)));
  const daysUntilState = Math.max(0, Math.ceil((statePrimary - today) / (1000 * 60 * 60 * 24)));
  const daysUntilFederal = Math.max(0, Math.ceil((federalGeneral - today) / (1000 * 60 * 60 * 24)));

  // Organize API bills by level
  const billsByLevel = {
    local: bills.filter(b => b.level === 'local'),
    state: bills.filter(b => b.level === 'state'),
    federal: bills.filter(b => b.level === 'federal'),
  };

  // Organize API voices by tier/level
  const voicesByLevel = {
    local: voices.filter(v => v.tier === 'local'),
    state: voices.filter(v => v.tier === 'state'),
    federal: voices.filter(v => v.tier === 'federal' || !v.tier),
  };

  // Organize API news by level
  const newsByLevel = {
    local: news.filter(n => n.level === 'local'),
    state: news.filter(n => n.level === 'state'),
    federal: news.filter(n => n.level === 'federal' || !n.level),
  };

  if (loading) {
    return (
      <>
        <Header title="Local Stack" />
        <Screen>
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px' }}></i>
            <p style={{ marginTop: '12px', fontSize: '14px' }}>Loading your unified stream...</p>
          </div>
        </Screen>
      </>
    );
  }

  return (
    <>
      {/* Header: CIVIQ + Local Stack + search + avatar */}
      <Header
        title="Local Stack"
      />

      <Screen>
        {/* Unified Stats Panel: User stats + Election countdown circles */}
        <UserStatsHeader
          user={userData}
          localDays={daysUntilLocal}
          stateDays={daysUntilState}
          federalDays={daysUntilFederal}
          localTotal={365}
          stateTotal={548}
          federalTotal={730}
          sortByDays={true}
        />

        {/* Content type tabs - 3 bubbles */}
        <div style={{ marginTop: '20px', marginBottom: '16px' }}>
          <TabToggle
            options={CONTENT_TABS}
            activeValue={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Tab content - each shows Local → State → Federal sections */}
        {activeTab === 'voices' && (
          <>
            <LevelSectionHeader level="local" label="Local Voices" />
            {voicesByLevel.local.length > 0
              ? voicesByLevel.local.map((voice, idx) => <VoiceItem key={`voice-local-${idx}`} voice={voice} level="local" />)
              : <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No local voices yet</p>
            }
            <LevelSectionHeader level="state" label="State Voices" />
            {voicesByLevel.state.length > 0
              ? voicesByLevel.state.map((voice, idx) => <VoiceItem key={`voice-state-${idx}`} voice={voice} level="state" />)
              : <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No state voices yet</p>
            }
            <LevelSectionHeader level="federal" label="Federal Voices" />
            {voicesByLevel.federal.length > 0
              ? voicesByLevel.federal.map((voice, idx) => <VoiceItem key={`voice-federal-${idx}`} voice={voice} level="federal" />)
              : <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No federal voices yet</p>
            }
          </>
        )}

        {activeTab === 'elections' && (
          <>
            <LevelSectionHeader level="local" label="Local Elections" />
            {elections.local?.map((election, idx) => (
              <ElectionItem key={`election-local-${idx}`} election={election} level="local" />
            ))}
            <LevelSectionHeader level="state" label="State Elections" />
            {elections.state?.map((election, idx) => (
              <ElectionItem key={`election-state-${idx}`} election={election} level="state" />
            ))}
            <LevelSectionHeader level="federal" label="Federal Elections" />
            {elections.federal?.map((election, idx) => (
              <ElectionItem key={`election-federal-${idx}`} election={election} level="federal" />
            ))}
          </>
        )}

        {activeTab === 'bills' && (
          <>
            <LevelSectionHeader level="local" label="Local Bills" />
            {billsByLevel.local.length > 0
              ? billsByLevel.local.map((bill, idx) => <BillItem key={`bill-local-${idx}`} bill={bill} level="local" />)
              : <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No local bills</p>
            }
            <LevelSectionHeader level="state" label="State Bills" />
            {billsByLevel.state.length > 0
              ? billsByLevel.state.map((bill, idx) => <BillItem key={`bill-state-${idx}`} bill={bill} level="state" />)
              : <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No state bills</p>
            }
            <LevelSectionHeader level="federal" label="Federal Bills" />
            {billsByLevel.federal.length > 0
              ? billsByLevel.federal.map((bill, idx) => <BillItem key={`bill-federal-${idx}`} bill={bill} level="federal" />)
              : <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No federal bills</p>
            }
          </>
        )}

        {/* Bottom spacer for navigation */}
        <div style={{ height: '80px' }}></div>
      </Screen>

      {/* Voter Card FAB - Stack page only */}
      <VoterCardFAB onClick={() => setVoterCardOpen(true)} />
      <VoterCardModal isOpen={voterCardOpen} onClose={() => setVoterCardOpen(false)} user={authUser} />
    </>
  );
}
