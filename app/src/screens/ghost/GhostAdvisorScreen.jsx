import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { Card } from '../../components/ui';

// Historical advisors data
const ADVISORS = {
  lincoln: {
    id: 'lincoln',
    name: 'Abraham Lincoln',
    emoji: '🎩',
    gradient: 'linear-gradient(135deg, #1E3A5F, #2D5A87)',
    intro: 'A nation that invests in its roads and rails invests in its unity.',
    quote: '"The legitimate object of government is to do for a community of people whatever they need to have done." — 1854',
  },
  jefferson: {
    id: 'jefferson',
    name: 'Thomas Jefferson',
    emoji: '📜',
    gradient: 'linear-gradient(135deg, #5D4E37, #8B7355)',
    intro: 'The government closest to the people governs best.',
    quote: '"I hold it that a little rebellion now and then is a good thing." — 1787',
  },
  franklin: {
    id: 'franklin',
    name: 'Benjamin Franklin',
    emoji: '🔔',
    gradient: 'linear-gradient(135deg, #4A5568, #718096)',
    intro: 'An investment in knowledge pays the best interest.',
    quote: '"We must, indeed, all hang together or, most assuredly, we shall all hang separately." — 1776',
  },
  roosevelt: {
    id: 'roosevelt',
    name: 'Theodore Roosevelt',
    emoji: '🌹',
    gradient: 'linear-gradient(135deg, #2D5016, #4A7C23)',
    intro: 'The only man who never makes mistakes is the man who never does anything.',
    quote: '"Speak softly and carry a big stick; you will go far." — 1900',
  },
  mlk: {
    id: 'mlk',
    name: 'Martin Luther King Jr.',
    emoji: '⚖️',
    gradient: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
    intro: 'Injustice anywhere is a threat to justice everywhere.',
    quote: '"The arc of the moral universe is long, but it bends toward justice." — 1965',
  },
};

// Advisor avatar component
function AdvisorAvatar({ advisor, size = 56, selected = false }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: advisor.gradient,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.43,
        border: selected ? '3px solid var(--accent)' : '3px solid transparent',
        flexShrink: 0,
      }}
    >
      {advisor.emoji}
    </div>
  );
}

// Chat message component
function ChatMessage({ advisor, content, isUser = false }) {
  if (isUser) {
    return (
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', justifyContent: 'flex-end' }}>
        <div style={{
          background: 'var(--accent)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          maxWidth: '80%',
        }}>
          <div style={{ fontSize: '14px', color: 'white' }}>{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
      <AdvisorAvatar advisor={advisor} size={40} />
      <div style={{
        flex: 1,
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        padding: '12px',
        border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '6px' }}>
          {advisor.name}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {content}
        </div>
        {advisor.quote && (
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px', fontStyle: 'italic' }}>
            {advisor.quote}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GhostAdvisorScreen() {
  const [searchParams] = useSearchParams();
  const topicTitle = searchParams.get('topic') || 'Current Political Issue';
  const topicSubtitle = searchParams.get('subtitle') || 'Discuss with historical advisors';

  const [selectedAdvisor, setSelectedAdvisor] = useState(ADVISORS.lincoln);
  const [messages, setMessages] = useState([
    { advisor: ADVISORS.lincoln, content: ADVISORS.lincoln.intro, isUser: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { content: inputValue, isUser: true }]);

    // Simulate advisor response (in production, this would call an AI API)
    setTimeout(() => {
      const responses = [
        `A thoughtful question. In my time, we faced similar challenges...`,
        `This reminds me of the debates we had in ${selectedAdvisor.id === 'lincoln' ? '1858' : '1787'}...`,
        `The principles of our founding remain relevant. Consider how this affects the common citizen.`,
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { advisor: selectedAdvisor, content: response, isUser: false }]);
    }, 1000);

    setInputValue('');
  };

  const handleAdvisorSelect = (advisor) => {
    setSelectedAdvisor(advisor);
    setMessages([{ advisor, content: advisor.intro, isUser: false }]);
  };

  const suggestedQuestions = [
    `What would ${selectedAdvisor.name.split(' ')[1]} say?`,
    'Bipartisan lessons?',
    'State vs. federal role?',
  ];

  return (
    <>
      <Header
        title="Ghost Panel"
        subtitle="BETA"
        backTo="/learn"
        showSearch={false}
      />

      {/* Context Card */}
      <div style={{
        padding: '12px 20px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>DISCUSSING</div>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>{topicTitle}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{topicSubtitle}</div>
      </div>

      {/* Advisor Selection */}
      <div style={{
        padding: '12px 20px',
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        background: 'var(--bg-tertiary)',
      }}>
        {Object.values(ADVISORS).map(advisor => (
          <div
            key={advisor.id}
            onClick={() => handleAdvisorSelect(advisor)}
            style={{ textAlign: 'center', flexShrink: 0, cursor: 'pointer' }}
          >
            <AdvisorAvatar advisor={advisor} selected={selectedAdvisor.id === advisor.id} />
            <div style={{
              fontSize: '10px',
              color: selectedAdvisor.id === advisor.id ? 'var(--accent)' : 'var(--text-tertiary)',
              marginTop: '4px',
              fontWeight: selectedAdvisor.id === advisor.id ? 600 : 400,
            }}>
              {advisor.name.split(' ').pop()}
            </div>
          </div>
        ))}
      </div>

      <Screen>
        {/* Chat messages */}
        <div style={{ marginTop: '12px' }}>
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              advisor={msg.advisor}
              content={msg.content}
              isUser={msg.isUser}
            />
          ))}
        </div>

        {/* Historical context card */}
        <Card style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--accent-purple)' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--accent-purple)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}>
            Historical Context
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Understanding history helps us navigate present challenges. {selectedAdvisor.name} faced
            similar questions about the role of government in their era.
          </div>
        </Card>

        {/* Suggested questions */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
            SUGGESTED QUESTIONS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInputValue(q)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: '100px' }}></div>
      </Screen>

      {/* Input Area */}
      <div style={{
        position: 'fixed',
        bottom: '70px',
        left: 0,
        right: 0,
        padding: '12px 20px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${selectedAdvisor.name.split(' ').pop()}...`}
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: '14px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              width: '40px',
              height: '40px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
