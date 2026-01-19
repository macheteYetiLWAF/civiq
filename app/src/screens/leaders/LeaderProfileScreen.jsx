import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { Card, BiasLabel } from '../../components/ui';
import { getOfficials } from '../../services/api';

// Format currency for display (e.g., $1.8M, $340K)
function formatCurrency(amount) {
  if (amount >= 1000000) {
    return '$' + (amount / 1000000).toFixed(1) + 'M';
  } else if (amount >= 1000) {
    return '$' + Math.round(amount / 1000) + 'K';
  }
  return '$' + amount.toLocaleString();
}

// Format vote date for display (e.g., "Dec 2024")
function formatVoteDate(dateStr) {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()] + ' ' + date.getFullYear();
}

// Slug to ID mapping for static links
const SLUG_TO_ID = {
  'matt-cartwright': 23,
  'john-fetterman': 21,
  'dave-mccormick': 22,
  'josh-shapiro': 24,
  'austin-davis': 25,
  'eddie-pashinski': 6,
  'bridget-kosierowski': 8,
  'marty-flynn': 26,
  'paige-cognetti': 12,
  'george-brown': 13,
};

export default function LeaderProfileScreen() {
  const { id } = useParams();
  const [leader, setLeader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeader() {
      try {
        setLoading(true);
        const data = await getOfficials();

        if (!data.success) {
          throw new Error('Failed to load officials');
        }

        // Resolve ID - could be numeric ID or slug
        const numericId = SLUG_TO_ID[id] || parseInt(id, 10);

        // Find the leader across all levels
        const allOfficials = [
          ...(data.officials?.federal || []),
          ...(data.officials?.state || []),
          ...(data.officials?.local || []),
        ];

        const found = allOfficials.find(o => o.id === numericId);

        if (!found) {
          throw new Error('Leader not found');
        }

        setLeader(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeader();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header title="Loading..." backTo="/leaders" showSearch={false} />
        <Screen>
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px' }}></i>
          </div>
        </Screen>
      </>
    );
  }

  if (error || !leader) {
    return (
      <>
        <Header title="Not Found" backTo="/leaders" showSearch={false} />
        <Screen>
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '24px', marginBottom: '12px' }}></i>
            <p>{error || 'Leader not found'}</p>
          </div>
        </Screen>
      </>
    );
  }

  // Parse name for initials
  const initials = leader.name
    .replace(/^(Rep\.|Sen\.|Gov\.|Lt\. Gov\.|Mayor)\s+/i, '')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2);

  const partyLabel = leader.party === 'D' ? 'Democrat' : leader.party === 'R' ? 'Republican' : 'Independent';
  const biasDirection = leader.leanScore < -0.3 ? 'left' : leader.leanScore > 0.3 ? 'right' : 'center';

  return (
    <>
      <Header title={leader.name.replace(/^(Rep\.|Sen\.|Gov\.|Lt\. Gov\.|Mayor)\s+/i, '')} subtitle={leader.displayRole} backTo="/leaders" showSearch={false} />
      <Screen>
        {/* Profile Header */}
        <div className="placeholder-screen" style={{ minHeight: 'auto', marginBottom: '24px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: leader.party === 'D'
                ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                : leader.party === 'R'
                ? 'linear-gradient(135deg, #EF4444, #B91C1C)'
                : 'linear-gradient(135deg, #64748B, #475569)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '16px'
            }}
          >
            {initials}
          </div>
          <h2 style={{ marginBottom: '4px' }}>{leader.name}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {leader.displayRole}
          </p>
          {leader.leanScore !== null && (
            <BiasLabel score={leader.leanScore} showScore />
          )}
        </div>

        {/* Overview */}
        <div className="section-header">
          <span className="section-title">Overview</span>
        </div>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Party</span>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>{partyLabel}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>In Office Since</span>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>{leader.termStart}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Years Served</span>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>{leader.yearsServed} years</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Next Election</span>
            <span style={{
              fontWeight: 600,
              fontSize: '13px',
              color: leader.upForElection ? 'var(--warning)' : 'inherit'
            }}>
              {leader.nextElection}
              {leader.upForElection && ' (Up)'}
            </span>
          </div>
          {leader.district && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>District</span>
              <span style={{ fontWeight: 600, fontSize: '13px' }}>{leader.district}</span>
            </div>
          )}
        </Card>

        {/* Voting Record / Ratings */}
        {(leader.partyVotePct || leader.approvalRating || leader.lcvScore) && (
          <>
            <div className="section-header">
              <span className="section-title">Ratings & Voting</span>
            </div>
            <Card>
              {leader.partyVotePct && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Party Line Votes</span>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{leader.partyVotePct}%</span>
                </div>
              )}
              {leader.approvalRating && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Approval Rating</span>
                  <span style={{
                    fontWeight: 600,
                    fontSize: '13px',
                    color: leader.approvalRating >= 50 ? 'var(--success)' : 'var(--error)'
                  }}>
                    {leader.approvalRating}%
                  </span>
                </div>
              )}
              {leader.lcvScore !== null && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>LCV Environment Score</span>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{leader.lcvScore}%</span>
                </div>
              )}
            </Card>
          </>
        )}

        {/* Recent Votes */}
        {leader.votingRecords && leader.votingRecords.length > 0 && (
          <>
            <div className="section-header">
              <span className="section-title">Recent Votes</span>
            </div>
            <Card>
              {leader.votingRecords.map((vote, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: idx < leader.votingRecords.length - 1 ? '1px solid var(--border)' : 'none'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{vote.billName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      {vote.billNumber} - {formatVoteDate(vote.voteDate)}
                    </div>
                  </div>
                  <span style={{
                    background: vote.vote === 'YEA' ? '#DCFCE7' : vote.vote === 'NAY' ? '#FEE2E2' : 'var(--bg-tertiary)',
                    color: vote.vote === 'YEA' ? '#16A34A' : vote.vote === 'NAY' ? '#DC2626' : 'var(--text-secondary)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '10px',
                    fontWeight: 600
                  }}>
                    {vote.vote}
                  </span>
                </div>
              ))}
              <a
                href="#"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'var(--accent)',
                  padding: '8px 0',
                  textDecoration: 'none',
                  borderTop: '1px solid var(--border)',
                  marginTop: '4px'
                }}
              >
                View Full Voting Record
              </a>
            </Card>
          </>
        )}

        {/* Campaign Finance */}
        {leader.campaignFinance && (
          <>
            <div className="section-header">
              <span className="section-title">{leader.campaignFinance.cycleYear} Campaign Funding</span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{leader.campaignFinance.source}</span>
            </div>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Individual Contributions</span>
                <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--success)' }}>
                  {formatCurrency(leader.campaignFinance.individualContributions)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>PAC Contributions</span>
                <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--warning)' }}>
                  {formatCurrency(leader.campaignFinance.pacContributions)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Small Donors (&lt;$200)</span>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                  {formatCurrency(leader.campaignFinance.smallDonors)}
                </span>
              </div>
              {leader.campaignFinance.topSector && (
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Top Sector: {leader.campaignFinance.topSector}</span>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>
                    {formatCurrency(leader.campaignFinance.topSectorAmount)}
                  </span>
                </div>
              )}
            </Card>
          </>
        )}

        {/* Bio / Credentials */}
        {leader.credentials && (
          <>
            <div className="section-header">
              <span className="section-title">Background</span>
            </div>
            <Card>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                {leader.credentials}
              </p>
            </Card>
          </>
        )}

        {/* Contact / Links */}
        {(leader.website || leader.twitter) && (
          <>
            <div className="section-header">
              <span className="section-title">Connect</span>
            </div>
            <Card>
              {leader.website && (
                <a
                  href={leader.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: leader.twitter ? '12px' : 0,
                    textDecoration: 'none',
                    color: 'var(--text-primary)'
                  }}
                >
                  <i className="fas fa-globe" style={{ color: 'var(--accent-purple)', width: '20px' }}></i>
                  <span style={{ fontSize: '13px' }}>Official Website</span>
                  <i className="fas fa-external-link-alt" style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-tertiary)' }}></i>
                </a>
              )}
              {leader.twitter && (
                <a
                  href={`https://twitter.com/${leader.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textDecoration: 'none',
                    color: 'var(--text-primary)'
                  }}
                >
                  <i className="fab fa-twitter" style={{ color: '#1DA1F2', width: '20px' }}></i>
                  <span style={{ fontSize: '13px' }}>{leader.twitter}</span>
                  <i className="fas fa-external-link-alt" style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-tertiary)' }}></i>
                </a>
              )}
            </Card>
          </>
        )}

        {/* Bottom spacer */}
        <div style={{ height: '80px' }}></div>
      </Screen>
    </>
  );
}
