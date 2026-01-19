import { useParams, Link } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { Card } from '../../components/ui';

// Government level colors
const LEVEL_COLORS = {
  local: '#F59E0B',
  state: '#8B5CF6',
  federal: '#64748B',
};

// Bias colors
const BIAS_COLORS = {
  left: '#3B82F6',
  'lean-left': '#60A5FA',
  center: '#10B981',
  'lean-right': '#F87171',
  right: '#EF4444',
};

// Mock voice/article data
const MOCK_VOICES = {
  'default': {
    id: '1',
    title: 'Local Infrastructure Bill Gains Support',
    source: 'Times Leader',
    sourceId: 'times-leader',
    sourceBias: 'center',
    author: 'Sarah Johnson',
    publishedAt: '2024-12-15T10:30:00Z',
    tier: 'local',
    image: null,
    content: `
      The Wilkes-Barre City Council is considering a new infrastructure bill that would allocate $2.3 million for road repairs and bridge maintenance throughout the city.

      Councilmember Eddie Day Pashinski, who sponsored the legislation, says the funding is critical for public safety. "Our roads have been neglected for too long," Pashinski said at Tuesday's council meeting. "This investment will create jobs and make our streets safer for everyone."

      The bill has gained bipartisan support, with both Democratic and Republican council members expressing approval. If passed, construction could begin as early as spring 2025.

      Local business owners have also voiced support, citing the poor road conditions as a deterrent for customers. "People don't want to drive down Main Street when there are potholes everywhere," said downtown shop owner Maria Santos.

      The council will vote on the measure at their next session on January 8th.
    `,
    relatedLeaders: [
      { id: 'eddie-pashinski', name: 'Eddie Day Pashinski', role: 'State Rep', party: 'D' },
    ],
    relatedBills: [
      { id: 'hb-1234', number: 'HB 1234', title: 'Infrastructure Investment Act' },
    ],
    tags: ['infrastructure', 'local-government', 'wilkes-barre'],
  },
};

export default function VoiceDetailScreen() {
  const { id } = useParams();
  const voice = MOCK_VOICES[id] || MOCK_VOICES['default'];
  const levelColor = LEVEL_COLORS[voice.tier] || LEVEL_COLORS.local;
  const biasColor = BIAS_COLORS[voice.sourceBias] || BIAS_COLORS.center;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getBiasLabel = (bias) => {
    const labels = {
      'left': 'Left',
      'lean-left': 'Lean Left',
      'center': 'Center',
      'lean-right': 'Lean Right',
      'right': 'Right',
    };
    return labels[bias] || 'Unknown';
  };

  return (
    <>
      <Header
        title="Article"
        subtitle={voice.source}
        backTo="/stack"
        showSearch={false}
      />
      <Screen>
        {/* Article header */}
        <div style={{ marginBottom: '20px' }}>
          {/* Tags row */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '4px 8px',
              borderRadius: '4px',
              background: `${levelColor}20`,
              color: levelColor,
            }}>
              {voice.tier}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '4px 8px',
              borderRadius: '4px',
              background: `${biasColor}20`,
              color: biasColor,
            }}>
              {getBiasLabel(voice.sourceBias)}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}>
            {voice.title}
          </h1>

          {/* Meta info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to={`/source/${voice.sourceId}`}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              {voice.source}
            </Link>
            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
              {voice.author && `By ${voice.author} · `}
              {formatDate(voice.publishedAt)}
            </span>
          </div>
        </div>

        {/* Bias indicator */}
        <Card style={{ background: `${biasColor}10`, border: `1px solid ${biasColor}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: biasColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <i className="fas fa-balance-scale" style={{ color: 'white', fontSize: '14px' }}></i>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Source Bias: {getBiasLabel(voice.sourceBias)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Balance your news diet with diverse perspectives
              </div>
            </div>
            <Link to="/media" style={{ fontSize: '11px', color: biasColor }}>
              Find more →
            </Link>
          </div>
        </Card>

        {/* Article content */}
        <div style={{
          marginTop: '20px',
          fontSize: '15px',
          lineHeight: 1.8,
          color: 'var(--text-primary)',
        }}>
          {voice.content.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: '16px' }}>
              {paragraph.trim()}
            </p>
          ))}
        </div>

        {/* Related leaders */}
        {voice.relatedLeaders?.length > 0 && (
          <Card>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Leaders Mentioned
            </div>
            {voice.relatedLeaders.map((leader) => (
              <Link
                key={leader.id}
                to={`/leaders/${leader.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: leader.party === 'D'
                    ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)'
                    : 'linear-gradient(135deg, #B91C1C, #EF4444)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'white',
                }}>
                  {leader.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{leader.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{leader.role}</div>
                </div>
                <i className="fas fa-chevron-right" style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}></i>
              </Link>
            ))}
          </Card>
        )}

        {/* Related bills */}
        {voice.relatedBills?.length > 0 && (
          <Card>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Related Legislation
            </div>
            {voice.relatedBills.map((bill) => (
              <Link
                key={bill.id}
                to={`/bills/${bill.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <i className="fas fa-file-alt" style={{ color: 'var(--accent-purple)', fontSize: '14px' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{bill.number}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{bill.title}</div>
                </div>
                <i className="fas fa-chevron-right" style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}></i>
              </Link>
            ))}
          </Card>
        )}

        {/* Tags */}
        {voice.tags?.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {voice.tags.map((tag, idx) => (
                <span key={idx} style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-secondary)',
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share/save actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button style={{
            flex: 1,
            padding: '14px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            <i className="fas fa-bookmark" style={{ marginRight: '8px' }}></i>
            Save
          </button>
          <button style={{
            flex: 1,
            padding: '14px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            <i className="fas fa-share" style={{ marginRight: '8px' }}></i>
            Share
          </button>
        </div>

        <div style={{ height: '100px' }}></div>
      </Screen>
    </>
  );
}
