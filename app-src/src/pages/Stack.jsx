import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { news } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Stack() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('voices')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (activeTab === 'voices') {
      loadNews()
    }
  }, [activeTab, user])

  async function loadNews() {
    try {
      setLoading(true)
      setError(null)
      const data = await news.getFeed({
        state: user?.state_code,
        level: 'all',
        limit: 15
      })
      setArticles(data.articles || [])
    } catch (err) {
      console.error('Failed to load news:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Get level color
  function getLevelColor(level) {
    switch (level) {
      case 'federal': return 'var(--gov-federal)'
      case 'state': return 'var(--gov-state)'
      case 'local': return 'var(--gov-local)'
      default: return 'var(--bg-tertiary)'
    }
  }

  // Format time ago
  function timeAgo(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  function ArticleCard({ article }) {
    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="card">
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '80px',
              height: '60px',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              flexShrink: 0
            }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>
                {article.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                {article.source} - {timeAgo(article.published_at)}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <span style={{
              background: getLevelColor(article.level),
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              textTransform: 'capitalize'
            }}>
              {article.level}
            </span>
            {article.bias && article.bias !== 'center' && (
              <span style={{
                background: 'var(--bg-tertiary)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                color: 'var(--text-secondary)',
                textTransform: 'capitalize'
              }}>
                {article.bias.replace('-', ' ')}
              </span>
            )}
          </div>
        </div>
      </a>
    )
  }

  return (
    <>
      <Header />

      {/* User Stats Header */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{user?.streak_days || 0}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--xp-gold)' }}>Day Streak</div>
                <div style={{ fontSize: '12px', color: 'var(--xp-gold)' }}>+{user?.xp_total || 0} XP</div>
              </div>
            </div>
            <div style={{ flex: 1, maxWidth: '120px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Reading Balance</div>
              <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ flex: 35, background: 'var(--bias-left)' }}></div>
                <div style={{ flex: 20, background: 'var(--accent)' }}></div>
                <div style={{ flex: 45, background: 'var(--bias-right)' }}></div>
              </div>
            </div>
            <Link to="/media" style={{ textDecoration: 'none', color: 'var(--accent)', fontSize: '11px', fontWeight: 600 }}>
              Rebalance
            </Link>
          </div>
        </div>
      </div>

      {/* Main Tabs - VOICES, Elections, Bills */}
      <div style={{ padding: '0 16px 12px' }}>
        <div className="toggle-container">
          <button className={`toggle-option ${activeTab === 'voices' ? 'active' : ''}`} onClick={() => setActiveTab('voices')}>Voices</button>
          <button className={`toggle-option ${activeTab === 'elections' ? 'active' : ''}`} onClick={() => setActiveTab('elections')}>Elections</button>
          <button className={`toggle-option ${activeTab === 'bills' ? 'active' : ''}`} onClick={() => setActiveTab('bills')}>Bills</button>
        </div>
      </div>

      <div className="content" style={{ flex: 1 }}>
        {activeTab === 'voices' && (
          <>
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                <div style={{ fontSize: '14px' }}>Loading news...</div>
              </div>
            )}

            {error && !loading && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--danger)' }}>
                <div style={{ fontSize: '14px' }}>{error}</div>
                <button onClick={loadNews} className="btn btn-outline" style={{ marginTop: '16px' }}>
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && articles.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                <div style={{ fontSize: '14px' }}>No news articles available.</div>
              </div>
            )}

            {!loading && !error && articles.map((article, i) => (
              <ArticleCard key={i} article={article} />
            ))}
          </>
        )}

        {activeTab === 'elections' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#128499;</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Next Election</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>May 20, 2025</div>
            <div style={{ fontSize: '14px', marginTop: '4px' }}>PA Primary Election</div>
          </div>
        )}

        {activeTab === 'bills' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#128220;</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Bill Tracker</div>
            <div style={{ fontSize: '14px' }}>Track legislation that matters to you</div>
          </div>
        )}
      </div>

      <BottomNav />
    </>
  )
}
