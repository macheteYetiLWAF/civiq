import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { TabToggle, Card, Accordion } from '../../components/ui';
import { PAFactTicker, UserStatsHeader, VoterCardFAB, VoterCardModal } from '../../components/features';
import { getNewsFeed, getBills, getVoices } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Government level colors
const LEVEL_COLORS = {
  local: '#F59E0B',   // Orange
  state: '#8B5CF6',   // Purple
  federal: '#64748B', // Slate
};

// Content type tabs
const CONTENT_TABS = [
  { label: 'Voices', value: 'voices' },
  { label: 'Elections', value: 'elections' },
  { label: 'Bills', value: 'bills' },
];

// Stream tag component
function StreamTag({ level, text }) {
  const color = LEVEL_COLORS[level] || LEVEL_COLORS.local;
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

// Section header for government level
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

// Voice item component
function VoiceItem({ voice }) {
  const level = voice.tier || 'local';
  const color = LEVEL_COLORS[level];

  return (
    <div style={{ marginBottom: '12px' }}>
      <StreamTag level={level} text={`${level.charAt(0).toUpperCase() + level.slice(1)} Voice`} />
      <Link
        to={`/voices/${voice.id}`}
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
        <div style={{ fontSize: '13px', fontWeight: 600 }}>
          {voice.title || voice.content?.substring(0, 60)}
        </div>
        {voice.author && (
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            By {voice.author}
          </div>
        )}
      </Link>
    </div>
  );
}

// Bill item component
function BillItem({ bill }) {
  const level = bill.level || 'state';
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
        {bill.summary && (
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {bill.summary.substring(0, 100)}{bill.summary.length > 100 ? '...' : ''}
          </div>
        )}
      </Link>
    </div>
  );
}

// Election item component
function ElectionItem({ election }) {
  const level = election.level || 'local';
  const color = LEVEL_COLORS[level];
  const daysUntil = election.daysUntil || 0;
  const hasCandidates = election.candidates && election.candidates.length > 0;

  // If no candidates, render as a simple card instead of accordion
  if (!hasCandidates) {
    return (
      <Link
        to={`/elections/${election.id}`}
        style={{
          display: 'block',
          marginBottom: '12px',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <StreamTag level={level} text={`${level.charAt(0).toUpperCase() + level.slice(1)} · ${daysUntil} days`} />
        <div style={{
          padding: '12px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderLeft: `3px solid ${color}`,
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{election.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{election.subtitle}</div>
        </div>
      </Link>
    );
  }

  return (
    <div style={{ marginBottom: '12px' }}>
      <StreamTag level={level} text={`${level.charAt(0).toUpperCase() + level.slice(1)} · ${daysUntil} days`} />
      <Accordion
        title={election.title}
        subtitle={election.subtitle}
        borderLeftColor={color}
        defaultOpen={election.defaultOpen}
      >
        {election.candidates.map((candidate, idx) => (
          <Link
            key={idx}
            to={`/leaders/${candidate.id || idx}`}
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
              background: candidate.party === 'D'
                ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)'
                : candidate.party === 'R'
                ? 'linear-gradient(135deg, #B91C1C, #EF4444)'
                : 'linear-gradient(135deg, #475569, #64748B)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: 'white',
            }}>
              {candidate.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{candidate.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{candidate.role}</div>
            </div>
          </Link>
        ))}
      </Accordion>
    </div>
  );
}

// Static election data
const STATIC_ELECTIONS = {
  local: [
    {
      id: 'local-council-a',
      title: 'WB City Council - District A',
      subtitle: 'Primary: May 20, 2025 · 3 candidates',
      date: '2025-05-20',
      level: 'local',
      defaultOpen: true,
      candidates: [
        { name: 'John Murphy', role: 'Former Council Member', initials: 'JM', party: 'D' },
        { name: 'Maria Rodriguez', role: 'Community Organizer', initials: 'MR', party: 'D' },
      ],
    },
  ],
  state: [
    {
      id: 'state-governor',
      title: 'Governor 2026',
      subtitle: 'Term-limited: Josh Shapiro (D) cannot run again',
      date: '2026-11-03',
      level: 'state',
    },
    {
      id: 'state-house-121',
      title: 'PA House District 121',
      subtitle: 'Current: Eddie Day Pashinski (D)',
      date: '2026-11-03',
      level: 'state',
    },
  ],
  federal: [
    {
      id: 'federal-house',
      title: 'U.S. House - PA-8',
      subtitle: 'Current: Matt Cartwright (D)',
      date: '2026-11-03',
      level: 'federal',
    },
    {
      id: 'federal-senate',
      title: 'U.S. Senate',
      subtitle: 'Current: John Fetterman (D)',
      date: '2028-11-05',
      level: 'federal',
    },
  ],
};

// Calculate days until
function daysUntil(dateString) {
  const today = new Date();
  const target = new Date(dateString);
  return Math.max(0, Math.ceil((target - today) / (1000 * 60 * 60 * 24)));
}

export default function StackScreen() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('voices');
  const [loading, setLoading] = useState(true);
  const [voices, setVoices] = useState([]);
  const [bills, setBills] = useState([]);
  const [news, setNews] = useState([]);
  const [voterCardOpen, setVoterCardOpen] = useState(false);

  // Use real user data from auth context
  const userData = {
    first_name: authUser?.display_name?.split(' ')[0] || authUser?.first_name || 'User',
    last_name: authUser?.display_name?.split(' ').slice(1).join(' ') || authUser?.last_name || '',
    read_streak_days: authUser?.streak_days || 0,
    learn_streak_days: authUser?.learn_streak_days || 0,
    xp_total: authUser?.xp_total || 0,
    reading_balance: authUser?.reading_balance || { left: 33, center: 34, right: 33 },
  };

  // Mock bills tracked count (would come from user data in real implementation)
  const billsTrackedCount = bills.filter(b => b.isTracked).length || 4;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [voicesRes, billsRes, newsRes] = await Promise.allSettled([
          getVoices({ limit: 20 }),
          getBills({ limit: 20 }),
          getNewsFeed({ limit: 20 }),
        ]);

        if (voicesRes.status === 'fulfilled' && voicesRes.value?.voices) {
          setVoices(voicesRes.value.voices);
        }
        if (billsRes.status === 'fulfilled' && billsRes.value?.bills) {
          setBills(billsRes.value.bills);
        }
        if (newsRes.status === 'fulfilled' && newsRes.value?.articles) {
          setNews(newsRes.value.articles);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Process elections with days until
  const elections = {};
  for (const [level, items] of Object.entries(STATIC_ELECTIONS)) {
    elections[level] = items.map(e => ({
      ...e,
      daysUntil: daysUntil(e.date),
    }));
  }

  // Election countdown data
  const localPrimary = new Date('2025-05-20');
  const statePrimary = new Date('2026-05-19');
  const federalPrimary = new Date('2026-11-03');
  const today = new Date();

  const daysUntilLocal = Math.max(0, Math.ceil((localPrimary - today) / (1000 * 60 * 60 * 24)));
  const daysUntilState = Math.max(0, Math.ceil((statePrimary - today) / (1000 * 60 * 60 * 24)));
  const daysUntilFederal = Math.max(0, Math.ceil((federalPrimary - today) / (1000 * 60 * 60 * 24)));

  // Filter content by level
  const localVoices = voices.filter(v => v.tier === 'local');
  const stateVoices = voices.filter(v => v.tier === 'state');
  const federalVoices = voices.filter(v => v.tier === 'federal' || !v.tier);

  const localBills = bills.filter(b => b.level === 'local');
  const stateBills = bills.filter(b => b.level === 'state');
  const federalBills = bills.filter(b => b.level === 'federal');

  const renderVoicesTab = () => (
    <>
      <LevelSectionHeader level="local" label="Local" />
      {localVoices.length > 0 ? localVoices.map(v => <VoiceItem key={v.id} voice={v} />) : (
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No local voices yet</p>
      )}

      <LevelSectionHeader level="state" label="State" />
      {stateVoices.length > 0 ? stateVoices.map(v => <VoiceItem key={v.id} voice={v} />) : (
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No state voices yet</p>
      )}

      <LevelSectionHeader level="federal" label="Federal" />
      {federalVoices.length > 0 ? federalVoices.map(v => <VoiceItem key={v.id} voice={v} />) : (
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No federal voices yet</p>
      )}
    </>
  );

  const renderElectionsTab = () => (
    <>
      <LevelSectionHeader level="local" label="Local" />
      {elections.local?.map(e => <ElectionItem key={e.id} election={e} />)}

      <LevelSectionHeader level="state" label="State" />
      {elections.state?.map(e => <ElectionItem key={e.id} election={e} />)}

      <LevelSectionHeader level="federal" label="Federal" />
      {elections.federal?.map(e => <ElectionItem key={e.id} election={e} />)}
    </>
  );

  const renderBillsTab = () => (
    <>
      <LevelSectionHeader level="local" label="Local" />
      {localBills.length > 0 ? localBills.map(b => <BillItem key={b.id} bill={b} />) : (
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No local bills</p>
      )}

      <LevelSectionHeader level="state" label="State" />
      {stateBills.length > 0 ? stateBills.map(b => <BillItem key={b.id} bill={b} />) : (
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No state bills</p>
      )}

      <LevelSectionHeader level="federal" label="Federal" />
      {federalBills.length > 0 ? federalBills.map(b => <BillItem key={b.id} bill={b} />) : (
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', padding: '12px 0' }}>No federal bills</p>
      )}
    </>
  );

  if (loading) {
    return (
      <>
        <Header title="Stack" />
        <Screen>
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px' }}></i>
            <p style={{ marginTop: '12px', fontSize: '14px' }}>Loading your stack...</p>
          </div>
        </Screen>
      </>
    );
  }

  return (
    <>
      <Header title="Stack" />
      <Screen>
        <UserStatsHeader
          user={userData}
          federalDays={daysUntilFederal}
          stateDays={daysUntilState}
          localDays={daysUntilLocal}
          federalTotal={730}
          stateTotal={548}
          localTotal={365}
          billsTracked={billsTrackedCount}
          sortByDays={true}
        />

        {/* Content type tabs */}
        <div style={{ marginTop: '20px', marginBottom: '16px' }}>
          <TabToggle
            options={CONTENT_TABS}
            activeValue={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Tab content */}
        {activeTab === 'voices' && renderVoicesTab()}
        {activeTab === 'elections' && renderElectionsTab()}
        {activeTab === 'bills' && renderBillsTab()}

        {/* PA Fact Ticker at bottom of scroll content */}
        <PAFactTicker position="bottom" />

        <div style={{ height: '20px' }}></div>
      </Screen>

      {/* Voter Card FAB */}
      <VoterCardFAB onClick={() => setVoterCardOpen(true)} />
      <VoterCardModal isOpen={voterCardOpen} onClose={() => setVoterCardOpen(false)} user={authUser} />
    </>
  );
}
