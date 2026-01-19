import { useParams, Link } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { Card } from '../../components/ui';

// Government level colors
const LEVEL_COLORS = {
  local: '#F59E0B',
  state: '#8B5CF6',
  federal: '#64748B',
};

// Legislative stages for progress tracker
const STAGES = ['Introduced', 'House', 'Senate', 'Conference', 'Signed'];

// Mock bill data (would come from API)
const MOCK_BILLS = {
  'hb-1234': {
    id: 'hb-1234',
    billNumber: 'HB 1234',
    title: 'Infrastructure Investment Act',
    level: 'state',
    status: 'In Committee',
    currentStage: 1, // 0=Introduced, 1=House, 2=Senate, 3=Conference, 4=Signed
    chamber: 'House',
    sponsor: 'Eddie Day Pashinski',
    sponsorParty: 'D',
    sponsorDistrict: 'PA-121',
    cosponsors: { total: 12, democrat: 8, republican: 4 },
    introduced: 'Jan 15, 2024',
    lastAction: 'Referred to Transportation Committee',
    lastActionDate: 'Feb 20, 2024',
    summary: 'This bill allocates $500 million for road and bridge repairs across Pennsylvania, with priority given to rural and underserved areas. It establishes a competitive grant program for municipalities and creates oversight mechanisms for project delivery.',
    fullTextUrl: 'https://legiscan.com/PA/bill/HB1234/2024',
    votes: {
      house: {
        passed: true,
        yea: 118,
        nay: 82,
        date: 'Mar 15, 2024',
        breakdown: { demYea: 95, demNay: 6, repYea: 23, repNay: 76 }
      },
      senate: null // Not yet voted
    },
    paDelegation: [
      { name: 'Matt Cartwright', district: 'PA-8', party: 'D', vote: 'YEA' },
      { name: 'Dan Meuser', district: 'PA-9', party: 'R', vote: 'NAY' },
      { name: 'Susan Wild', district: 'PA-7', party: 'D', vote: 'YEA' },
      { name: 'Scott Perry', district: 'PA-10', party: 'R', vote: 'NAY' },
      { name: 'Madeleine Dean', district: 'PA-4', party: 'D', vote: 'YEA' },
    ],
    timeline: [
      { date: 'Feb 20, 2024', action: 'Referred to Transportation Committee' },
      { date: 'Feb 10, 2024', action: 'Passed House (118-82)' },
      { date: 'Jan 20, 2024', action: 'First reading' },
      { date: 'Jan 15, 2024', action: 'Introduced' },
    ],
    yourRep: {
      name: 'Matt Cartwright',
      position: 'Cosponsor',
      party: 'D',
      district: 'PA-8',
    },
    relatedCoverage: [
      {
        id: 1,
        title: 'Infrastructure Bill Advances with Bipartisan Support',
        source: 'AP News',
        bias: 'center',
        timeAgo: '2d ago',
      },
      {
        id: 2,
        title: 'What the Infrastructure Bill Means for NEPA',
        source: 'Times Leader',
        bias: 'lean-left',
        timeAgo: '3d ago',
      },
      {
        id: 3,
        title: 'GOP Divided on Infrastructure Spending',
        source: 'Fox News',
        bias: 'right',
        timeAgo: '5d ago',
      },
    ],
  },
  'hr-4521': {
    id: 'hr-4521',
    billNumber: 'H.R. 4521',
    title: 'Infrastructure Investment and Jobs Act',
    level: 'federal',
    status: 'In Senate Committee',
    currentStage: 2, // In Senate
    chamber: 'Senate',
    sponsor: 'Rep. DeFazio',
    sponsorParty: 'D',
    sponsorDistrict: 'OR-4',
    cosponsors: { total: 78, democrat: 52, republican: 26 },
    introduced: 'Jun 4, 2024',
    lastAction: 'Committee on Environment and Public Works',
    lastActionDate: 'Dec 26, 2024',
    summary: 'This bill provides $1.2 trillion in funding for infrastructure improvements including:\n\n- $550B for transportation (roads, bridges, rail)\n- $65B for broadband internet expansion\n- $55B for clean water infrastructure\n- $7.5B for electric vehicle charging\n- $21B for environmental remediation',
    fullTextUrl: 'https://congress.gov/bill/118th-congress/house-bill/4521',
    votes: {
      house: {
        passed: true,
        yea: 228,
        nay: 206,
        date: 'Nov 5, 2024',
        breakdown: { demYea: 215, demNay: 6, repYea: 13, repNay: 200 }
      },
      senate: null
    },
    paDelegation: [
      { name: 'Matt Cartwright', district: 'PA-8', party: 'D', vote: 'YEA' },
      { name: 'Dan Meuser', district: 'PA-9', party: 'R', vote: 'NAY' },
      { name: 'Susan Wild', district: 'PA-7', party: 'D', vote: 'YEA' },
      { name: 'Scott Perry', district: 'PA-10', party: 'R', vote: 'NAY' },
      { name: 'Madeleine Dean', district: 'PA-4', party: 'D', vote: 'YEA' },
      { name: 'Brian Fitzpatrick', district: 'PA-1', party: 'R', vote: 'YEA' },
      { name: 'Lloyd Smucker', district: 'PA-11', party: 'R', vote: 'NAY' },
      { name: 'John Fetterman', district: 'Senator', party: 'D', vote: 'PENDING' },
      { name: 'Bob Casey', district: 'Senator', party: 'D', vote: 'PENDING' },
    ],
    timeline: [
      { date: 'Dec 26, 2024', action: 'Referred to Senate Committee' },
      { date: 'Nov 5, 2024', action: 'Passed House (228-206)' },
      { date: 'Sep 15, 2024', action: 'Reported out of committee' },
      { date: 'Jun 4, 2024', action: 'Introduced' },
    ],
    yourRep: {
      name: 'Matt Cartwright',
      position: 'Cosponsor',
      party: 'D',
      district: 'PA-8',
    },
    relatedCoverage: [
      {
        id: 1,
        title: 'Infrastructure Bill Advances with Bipartisan Support',
        source: 'AP News',
        bias: 'center',
        timeAgo: '2d ago',
      },
      {
        id: 2,
        title: 'What the Infrastructure Bill Means for NEPA',
        source: 'Times Leader',
        bias: 'lean-left',
        timeAgo: '3d ago',
      },
    ],
  },
};

// Progress bar component
const LegislativeProgress = ({ currentStage, stages = STAGES }) => {
  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
        {stages.map((stage, idx) => {
          let bgColor = 'var(--border)';
          if (idx < currentStage) bgColor = 'var(--success)';
          else if (idx === currentStage) bgColor = '#F59E0B';

          return (
            <div
              key={stage}
              style={{
                flex: 1,
                height: '6px',
                background: bgColor,
                borderRadius: '3px',
              }}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-tertiary)' }}>
        {stages.map((stage, idx) => (
          <span
            key={stage}
            style={{
              color: idx === currentStage ? '#F59E0B' : 'var(--text-tertiary)',
              fontWeight: idx === currentStage ? 600 : 400,
            }}
          >
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
};

// Vote bar component
const VoteBar = ({ yea, nay, showLabels = true }) => {
  const total = yea + nay;
  if (total === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
      <div
        style={{
          flex: yea,
          background: '#22C55E',
          height: '20px',
          borderRadius: '4px 0 0 4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        {showLabels && `${yea} Yea`}
      </div>
      <div
        style={{
          flex: nay,
          background: '#EF4444',
          height: '20px',
          borderRadius: '0 4px 4px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        {showLabels && `${nay} Nay`}
      </div>
    </div>
  );
};

// Bias label component
const BiasLabel = ({ bias }) => {
  const biasStyles = {
    'left': { bg: '#1D4ED820', color: '#1D4ED8', text: 'Left' },
    'lean-left': { bg: '#3B82F620', color: '#3B82F6', text: 'Lean Left' },
    'center': { bg: '#6B728020', color: '#6B7280', text: 'Center' },
    'lean-right': { bg: '#F9731620', color: '#F97316', text: 'Lean Right' },
    'right': { bg: '#DC262620', color: '#DC2626', text: 'Right' },
  };

  const style = biasStyles[bias] || biasStyles.center;

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '9px',
      fontWeight: 600,
      background: style.bg,
      color: style.color,
    }}>
      {style.text}
    </span>
  );
};

export default function BillDetailScreen() {
  const { id } = useParams();
  const bill = MOCK_BILLS[id] || MOCK_BILLS['hr-4521'];
  const levelColor = LEVEL_COLORS[bill.level] || LEVEL_COLORS.state;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bill.billNumber}: ${bill.title}`,
          text: bill.summary.substring(0, 200) + '...',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  const handleFullText = () => {
    window.open(bill.fullTextUrl, '_blank');
  };

  // Calculate PA delegation vote totals
  const paYea = bill.paDelegation.filter(d => d.vote === 'YEA').length;
  const paNay = bill.paDelegation.filter(d => d.vote === 'NAY').length;

  return (
    <>
      <Header
        title="Bill Detail"
        subtitle="Legislation info"
        backTo="/stack"
        showSearch={false}
      />
      <Screen>
        {/* Bill header with progress */}
        <div style={{
          background: 'var(--bg-secondary)',
          margin: '0 -16px',
          padding: '20px 16px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{
            fontSize: '11px',
            color: '#F59E0B',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>
            {bill.status}
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '8px 0', color: 'var(--text-primary)' }}>
            {bill.billNumber}
          </h1>
          <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
            {bill.title}
          </div>

          <LegislativeProgress currentStage={bill.currentStage} />
        </div>

        {/* Quick Facts Grid */}
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Introduced</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{bill.introduced}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Last Action</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{bill.lastActionDate}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Sponsor</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {bill.sponsor} ({bill.sponsorParty}-{bill.sponsorDistrict?.split('-')[1] || ''})
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Cosponsors</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {bill.cosponsors.total} (D: {bill.cosponsors.democrat}, R: {bill.cosponsors.republican})
              </div>
            </div>
          </div>
        </Card>

        {/* Your Rep's Position */}
        {bill.yourRep && (
          <Card style={{ border: '1px solid var(--accent-purple)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              Your Representative
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: bill.yourRep.party === 'D'
                  ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)'
                  : 'linear-gradient(135deg, #B91C1C, #EF4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                color: 'white',
              }}>
                {bill.yourRep.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{bill.yourRep.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{bill.yourRep.district} · {bill.yourRep.party === 'D' ? 'Democrat' : 'Republican'}</div>
              </div>
              <div style={{
                background: '#DCFCE7',
                color: '#16A34A',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                {bill.yourRep.position.toUpperCase()}
              </div>
            </div>
          </Card>
        )}

        {/* Summary */}
        <Card>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Summary
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {bill.summary}
          </div>
          <button
            onClick={handleFullText}
            style={{
              marginTop: '12px',
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '13px',
              color: 'var(--accent-purple)',
              cursor: 'pointer',
            }}
          >
            Read full text →
          </button>
        </Card>

        {/* Vote History */}
        <Card>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Vote History
          </div>

          {/* House Vote */}
          {bill.votes.house && (
            <div style={{ borderBottom: bill.votes.senate ? '1px solid var(--border)' : 'none', paddingBottom: '12px', marginBottom: bill.votes.senate ? '12px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>House Vote</span>
                <span style={{
                  background: bill.votes.house.passed ? '#DCFCE7' : '#FEE2E2',
                  color: bill.votes.house.passed ? '#16A34A' : '#DC2626',
                  padding: '3px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  {bill.votes.house.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <VoteBar yea={bill.votes.house.yea} nay={bill.votes.house.nay} />
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                {bill.votes.house.date} · D: {bill.votes.house.breakdown.demYea}-{bill.votes.house.breakdown.demNay} | R: {bill.votes.house.breakdown.repYea}-{bill.votes.house.breakdown.repNay}
              </div>
            </div>
          )}

          {/* Senate Vote */}
          {bill.votes.senate ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Senate Vote</span>
                <span style={{
                  background: bill.votes.senate.passed ? '#DCFCE7' : '#FEE2E2',
                  color: bill.votes.senate.passed ? '#16A34A' : '#DC2626',
                  padding: '3px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  {bill.votes.senate.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <VoteBar yea={bill.votes.senate.yea} nay={bill.votes.senate.nay} />
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Senate Committee</span>
                <span style={{
                  background: '#FEF3C7',
                  color: '#92400E',
                  padding: '3px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  PENDING
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{bill.lastAction}</div>
            </div>
          )}
        </Card>

        {/* PA Delegation Breakdown */}
        <Card>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            PA Delegation Votes
          </div>

          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
            House & Senate ({bill.paDelegation.length} members)
          </div>
          <VoteBar yea={paYea} nay={paNay} />

          <div style={{ marginTop: '12px' }}>
            {bill.paDelegation.slice(0, 5).map((member, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: idx < 4 ? '1px solid var(--border)' : 'none',
                  fontSize: '12px',
                }}
              >
                <span style={{ color: 'var(--text-primary)' }}>
                  {member.name} ({member.party}-{member.district.replace('PA-', '')})
                </span>
                <span style={{
                  color: member.vote === 'YEA' ? 'var(--success)' : member.vote === 'NAY' ? 'var(--error)' : 'var(--text-tertiary)',
                  fontWeight: 600,
                }}>
                  {member.vote}
                </span>
              </div>
            ))}
          </div>
          {bill.paDelegation.length > 5 && (
            <button
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                fontSize: '12px',
                color: 'var(--accent-purple)',
                paddingTop: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              See all PA votes →
            </button>
          )}
        </Card>

        {/* Related Coverage */}
        {bill.relatedCoverage && bill.relatedCoverage.length > 0 && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Related Coverage
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                {bill.relatedCoverage.length} articles
              </span>
            </div>

            {bill.relatedCoverage.map((article, idx) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderBottom: idx < bill.relatedCoverage.length - 1 ? '1px solid var(--border)' : 'none',
                  padding: '12px 0',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  "{article.title}"
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <BiasLabel bias={article.bias} />
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {article.source} - {article.timeAgo}
                  </span>
                </div>
              </Link>
            ))}

            <button
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                fontSize: '13px',
                color: 'var(--accent-purple)',
                padding: '8px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              View All Coverage
            </button>
          </Card>
        )}

        {/* Bill Timeline */}
        <Card>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
            Bill History
          </div>
          <div style={{ position: 'relative', paddingLeft: '20px' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: '6px',
              top: '8px',
              bottom: '8px',
              width: '2px',
              background: 'var(--border)',
            }} />

            {bill.timeline.map((event, idx) => (
              <div key={idx} style={{ position: 'relative', marginBottom: idx < bill.timeline.length - 1 ? '16px' : 0 }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: '-17px',
                  top: '4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: idx === 0 ? levelColor : 'var(--bg-tertiary)',
                  border: `2px solid ${idx === 0 ? levelColor : 'var(--border)'}`,
                }} />
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>{event.date}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{event.action}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
          <Link
            to={bill.yourRep ? `/leaders/${bill.yourRep.name.toLowerCase().replace(/\s+/g, '-')}` : '#'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Contact Rep
          </Link>
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Share Bill
          </button>
        </div>

        <div style={{ height: '100px' }}></div>
      </Screen>
    </>
  );
}
