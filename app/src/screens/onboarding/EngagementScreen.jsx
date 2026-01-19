import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout';
import { Button, Card } from '../../components/ui';

const TOPICS = [
  { id: 'elections', label: 'Elections', icon: 'fa-vote-yea' },
  { id: 'legislation', label: 'Legislation', icon: 'fa-file-alt' },
  { id: 'local', label: 'Local Government', icon: 'fa-building' },
  { id: 'education', label: 'Education', icon: 'fa-graduation-cap' },
  { id: 'environment', label: 'Environment', icon: 'fa-leaf' },
  { id: 'healthcare', label: 'Healthcare', icon: 'fa-heartbeat' },
  { id: 'economy', label: 'Economy', icon: 'fa-chart-line' },
  { id: 'justice', label: 'Criminal Justice', icon: 'fa-balance-scale' },
];

export default function EngagementScreen() {
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const toggleTopic = (topicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleContinue = () => {
    // TODO: Save preferences
    console.log('Preferences:', { selectedTopics, notificationsEnabled });
    navigate('/home');
  };

  return (
    <Screen noNav>
      <div style={{ marginTop: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
          Customize Your Experience
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          Select topics you're interested in to personalize your feed.
        </p>

        <div className="section-header">
          <span className="section-title">Topics</span>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            {selectedTopics.length} selected
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '32px'
        }}>
          {TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic.id);
            return (
              <button
                key={topic.id}
                onClick={() => toggleTopic(topic.id)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected
                    ? '2px solid var(--accent-purple)'
                    : '1px solid var(--border)',
                  background: isSelected
                    ? 'rgba(139, 92, 246, 0.1)'
                    : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <i
                  className={`fas ${topic.icon}`}
                  style={{
                    fontSize: '24px',
                    color: isSelected ? 'var(--accent-purple)' : 'var(--text-secondary)',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                ></i>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}>
                  {topic.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="section-header">
          <span className="section-title">Notifications</span>
        </div>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                Enable Notifications
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Stay informed about elections and civic events
              </p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              style={{
                width: '48px',
                height: '28px',
                borderRadius: '14px',
                background: notificationsEnabled
                  ? 'var(--accent-purple)'
                  : 'var(--bg-tertiary)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '12px',
                background: 'white',
                position: 'absolute',
                top: '2px',
                left: notificationsEnabled ? '22px' : '2px',
                transition: 'left 0.2s'
              }}></div>
            </button>
          </div>
        </Card>

        <div style={{ marginTop: '32px' }}>
          <Button variant="primary" fullWidth onClick={handleContinue}>
            Get Started
          </Button>
          <button
            onClick={handleContinue}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '12px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </Screen>
  );
}
