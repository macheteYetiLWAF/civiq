import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { useAuth } from '../../context/AuthContext';

// Bias colors
const BIAS_COLORS = {
  left: '#2563EB',
  center: '#8B5CF6',
  right: '#DC2626',
};

export default function RebalanceScreen() {
  const { user } = useAuth();
  const [nudgesEnabled, setNudgesEnabled] = useState(true);
  const [weeklyReportEnabled, setWeeklyReportEnabled] = useState(true);

  // User's reading balance (from user object or defaults)
  const readingBalance = user?.reading_balance || {
    left: 18,
    center: 45,
    right: 37,
  };

  // Calculate which side needs more reading
  const getImbalanceInfo = () => {
    const { left, right } = readingBalance;
    const diff = Math.abs(left - right);

    if (diff <= 10) {
      return {
        type: 'balanced',
        message: 'Well Balanced',
        detail: 'Your reading habits are relatively balanced. Keep it up!',
        color: '#10B981',
      };
    } else if (right > left) {
      return {
        type: 'right',
        message: 'Slight Right Lean Detected',
        detail: `You're reading ${(right / left).toFixed(1)}x more right-leaning sources than left. This can create blind spots.`,
        color: '#F59E0B',
        suggestion: 'left',
      };
    } else {
      return {
        type: 'left',
        message: 'Slight Left Lean Detected',
        detail: `You're reading ${(left / right).toFixed(1)}x more left-leaning sources than right. This can create blind spots.`,
        color: '#F59E0B',
        suggestion: 'right',
      };
    }
  };

  const imbalance = getImbalanceInfo();

  // Static topic breakdowns (would come from API in production)
  const topicBreakdowns = [
    { topic: 'Economy', articles: 12, left: 15, center: 35, right: 50 },
    { topic: 'Healthcare', articles: 8, left: 25, center: 50, right: 25 },
    { topic: 'Immigration', articles: 6, left: 10, center: 30, right: 60 },
    { topic: 'Climate', articles: 5, left: 40, center: 35, right: 25 },
  ];

  // Suggested articles for balance
  const suggestedArticles = imbalance.suggestion === 'left' ? [
    {
      id: 1,
      title: 'The Economic Case for Immigration Reform',
      source: 'The Atlantic',
      bias: 'Lean Left',
      xp: 10,
    },
    {
      id: 2,
      title: 'Why Unions Are Making a Comeback',
      source: 'Mother Jones',
      bias: 'Left',
      xp: 10,
    },
    {
      id: 3,
      title: 'Climate Policy: What Actually Works',
      source: 'Vox',
      bias: 'Lean Left',
      xp: 10,
    },
  ] : [
    {
      id: 1,
      title: 'The Case for Limited Government',
      source: 'National Review',
      bias: 'Right',
      xp: 10,
    },
    {
      id: 2,
      title: 'Free Market Solutions to Healthcare',
      source: 'The Wall Street Journal',
      bias: 'Lean Right',
      xp: 10,
    },
    {
      id: 3,
      title: 'Immigration Policy: A Conservative View',
      source: 'The Federalist',
      bias: 'Right',
      xp: 10,
    },
  ];

  // 7-Day Challenge progress (would come from API)
  const challengeProgress = {
    left: 1,
    center: 2,
    right: 3,
    goal: 3,
  };

  const getBiasLabelStyle = (bias) => {
    const styles = {
      'Left': { background: 'rgba(37, 99, 235, 0.2)', color: '#2563EB' },
      'Lean Left': { background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' },
      'Center': { background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' },
      'Lean Right': { background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' },
      'Right': { background: 'rgba(220, 38, 38, 0.2)', color: '#DC2626' },
    };
    return styles[bias] || styles['Center'];
  };

  return (
    <>
      <Header title="Rebalance" showBack subtitle="Reading balance" />
      <Screen>
        {/* Current Balance Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '16px',
          border: '1px solid var(--border)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
              Your Reading Balance
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Last 30 days · 47 articles
            </div>
          </div>

          {/* Large bias bar */}
          <div style={{
            height: '40px',
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'flex',
            marginBottom: '12px',
          }}>
            <div style={{
              width: `${readingBalance.left}%`,
              background: BIAS_COLORS.left,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
            }}>
              {readingBalance.left}%
            </div>
            <div style={{
              width: `${readingBalance.center}%`,
              background: BIAS_COLORS.center,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
            }}>
              {readingBalance.center}%
            </div>
            <div style={{
              width: `${readingBalance.right}%`,
              background: BIAS_COLORS.right,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
            }}>
              {readingBalance.right}%
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}>
            <span>Left</span>
            <span>Center</span>
            <span>Right</span>
          </div>
        </div>

        {/* Reading Patterns Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: '16px',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}>
            Your Reading Patterns
          </div>

          {/* Imbalance indicator */}
          <div style={{
            background: imbalance.type === 'balanced' ? 'rgba(16, 185, 129, 0.1)' : '#FEF3C7',
            borderLeft: `3px solid ${imbalance.color}`,
            padding: '12px',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            marginBottom: '16px',
          }}>
            <div style={{
              fontSize: '13px',
              color: imbalance.type === 'balanced' ? '#059669' : '#92400E',
              fontWeight: 600,
            }}>
              {imbalance.message}
            </div>
            <div style={{
              fontSize: '12px',
              color: imbalance.type === 'balanced' ? '#10B981' : '#B45309',
              marginTop: '4px',
            }}>
              {imbalance.detail}
            </div>
          </div>

          {/* Topic breakdowns */}
          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>
            By Topic
          </div>

          {topicBreakdowns.map((topic, idx) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                marginBottom: '4px',
              }}>
                <span>{topic.topic}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{topic.articles} articles</span>
              </div>
              <div style={{
                height: '8px',
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'flex',
              }}>
                <div style={{ width: `${topic.left}%`, background: BIAS_COLORS.left }}></div>
                <div style={{ width: `${topic.center}%`, background: BIAS_COLORS.center }}></div>
                <div style={{ width: `${topic.right}%`, background: BIAS_COLORS.right }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Articles Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: '16px',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              Suggested for Balance
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
              {imbalance.suggestion === 'left' ? 'Left-leaning' : 'Right-leaning'} perspectives
            </span>
          </div>

          {suggestedArticles.map((article, idx) => (
            <Link
              key={article.id}
              to={`/media`}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                borderBottom: idx < suggestedArticles.length - 1 ? '1px solid var(--border)' : 'none',
                padding: '12px 0',
              }}
            >
              <div style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                "{article.title}"
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                marginTop: '6px',
              }}>
                <span style={{
                  ...getBiasLabelStyle(article.bias),
                  fontSize: '9px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}>
                  {article.bias}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  {article.source}
                </span>
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--accent)',
                marginTop: '6px',
              }}>
                +{article.xp} XP for balanced reading
              </div>
            </Link>
          ))}
        </div>

        {/* 7-Day Challenge Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--accent), #7C3AED)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: '16px',
          color: 'white',
        }}>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
            7-Day Balance Challenge
          </div>
          <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '12px' }}>
            Read 3 articles from each perspective this week
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.2)',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>
                {challengeProgress.left}/{challengeProgress.goal}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>Left</div>
            </div>
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.2)',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>
                {challengeProgress.center}/{challengeProgress.goal}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>Center</div>
            </div>
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.2)',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>
                {challengeProgress.right >= challengeProgress.goal ? `${challengeProgress.right}/${challengeProgress.goal} ✓` : `${challengeProgress.right}/${challengeProgress.goal}`}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>Right</div>
            </div>
          </div>

          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            Reward: "Balanced Reader" badge + 200 XP
          </div>
        </div>

        {/* Settings Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          marginBottom: '20px',
        }}>
          {/* Rebalancing Nudges */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>Rebalancing Nudges</div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Suggest diverse perspectives
              </div>
            </div>
            <button
              onClick={() => setNudgesEnabled(!nudgesEnabled)}
              style={{
                width: '44px',
                height: '24px',
                background: nudgesEnabled ? 'var(--accent)' : 'var(--bg-tertiary)',
                borderRadius: '12px',
                position: 'relative',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                background: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                right: nudgesEnabled ? '2px' : '22px',
                transition: 'right 0.2s',
              }}></div>
            </button>
          </div>

          {/* Weekly Report */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>Weekly Balance Report</div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Email summary on Sundays
              </div>
            </div>
            <button
              onClick={() => setWeeklyReportEnabled(!weeklyReportEnabled)}
              style={{
                width: '44px',
                height: '24px',
                background: weeklyReportEnabled ? 'var(--accent)' : 'var(--bg-tertiary)',
                borderRadius: '12px',
                position: 'relative',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                background: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                right: weeklyReportEnabled ? '2px' : '22px',
                transition: 'right 0.2s',
              }}></div>
            </button>
          </div>
        </div>

        <div style={{ height: '80px' }}></div>
      </Screen>
    </>
  );
}
