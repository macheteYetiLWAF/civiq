import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

export default function Learn() {
  return (
    <>
      <Header />

      {/* XP Progress */}
      <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Level 4 Constituent</span>
          <span style={{ fontSize: '12px', color: 'var(--xp-gold)' }}>1,250 XP</span>
        </div>
        <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: '65%', height: '100%', background: 'var(--xp-gold)' }}></div>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>750 XP to Level 5</div>
      </div>

      <div className="content" style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', marginTop: '16px' }}>Daily Challenges</div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Civics Quiz</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Test your knowledge</div>
            </div>
            <span style={{ background: 'var(--xp-gold)', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>+50 XP</span>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Read 3 Articles</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>1 of 3 complete</div>
            </div>
            <span style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>+25 XP</span>
          </div>
        </div>

        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', marginTop: '24px' }}>Courses</div>

        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>Understanding Your Local Government</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>5 lessons - 15 min</div>
          <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: '40%', height: '100%', background: 'var(--accent)' }}></div>
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>How Bills Become Laws</div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>8 lessons - 25 min</div>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
