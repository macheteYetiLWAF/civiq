import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

export default function Media() {
  return (
    <>
      <Header />

      {/* Reading Stats */}
      <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>47</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Articles Read</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--xp-gold)' }}>7</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Day Streak</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>12</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Sources</div>
          </div>
        </div>
      </div>

      <div className="content" style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', marginTop: '16px' }}>Source Categories</div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>TV</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Networks</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>CNN, MSNBC, Fox News</div>
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>&gt;</span>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>NP</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Newspapers</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>NYT, WSJ, WaPo</div>
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>&gt;</span>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>PC</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Podcasts</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Political commentary</div>
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>&gt;</span>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>OD</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Official Documents</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Government sources</div>
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>&gt;</span>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>SJ</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Scientific Journals</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Peer-reviewed research</div>
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>&gt;</span>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
