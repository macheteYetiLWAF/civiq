import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Personalize() {
  const [selectedLevel, setSelectedLevel] = useState('engaged')
  const [selectedTopics, setSelectedTopics] = useState(['Healthcare', 'Environment', 'Local Issues'])

  const topics = ['Healthcare', 'Economy', 'Education', 'Environment', 'Immigration', 'Criminal Justice', 'Local Issues', 'Foreign Policy']

  const toggleTopic = (topic) => {
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic])
  }

  return (
    <>
      <div className="back-header">
        <Link to="/welcome" className="back-button">&lt;</Link>
        <span className="header-title">Personalize Your Experience</span>
      </div>

      <div className="content">
        <div className="progress-bar">
          <div className="progress-step active"></div>
          <div className="progress-step active"></div>
          <div className="progress-step active"></div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>How politically engaged are you?</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>We'll tailor content density to match your style</div>
        </div>

        {/* Engagement Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card" onClick={() => setSelectedLevel('casual')} style={{ cursor: 'pointer', border: selectedLevel === 'casual' ? '2px solid var(--accent)' : '2px solid transparent' }}>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>Casual Observer</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Headlines and key takeaways without overwhelming detail.</div>
          </div>

          <div className="card" onClick={() => setSelectedLevel('engaged')} style={{ cursor: 'pointer', border: selectedLevel === 'engaged' ? '2px solid var(--accent)' : '2px solid transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: 600 }}>Engaged Citizen</span>
              <span style={{ background: 'var(--accent)', color: 'white', padding: '2px 6px', borderRadius: 'var(--radius-full)', fontSize: '9px', fontWeight: 600 }}>RECOMMENDED</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Bias breakdowns, source analysis, and election updates.</div>
          </div>

          <div className="card" onClick={() => setSelectedLevel('power')} style={{ cursor: 'pointer', border: selectedLevel === 'power' ? '2px solid var(--accent)' : '2px solid transparent' }}>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>Power User</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Everything: multi-dimensional bias, bill tracking, voting records.</div>
          </div>
        </div>

        {/* Topics */}
        <div style={{ marginTop: '28px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>What topics interest you most?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {topics.map(topic => (
              <button key={topic} onClick={() => toggleTopic(topic)} className={`btn ${selectedTopics.includes(topic) ? 'btn-secondary' : 'btn-outline'}`} style={{ padding: '8px 14px', fontSize: '12px' }}>
                {topic}
              </button>
            ))}
          </div>
        </div>

        <Link to="/stack" className="btn btn-gradient btn-full" style={{ padding: '14px', marginTop: '24px' }}>
          Start Exploring
        </Link>
      </div>
    </>
  )
}
