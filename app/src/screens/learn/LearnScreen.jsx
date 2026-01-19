import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { Accordion, Button, Card } from '../../components/ui';
import './LearnScreen.css';

// Learning Paths Data - Pennsylvania Civic Education
const LEARNING_PATHS = {
  foundingDocuments: {
    id: 'founding-documents',
    title: 'Founding Documents',
    subtitle: 'Historical writings & foundations',
    icon: 'FD',
    gradient: 'linear-gradient(135deg, #64748B, #475569)',
    topics: [
      { id: 'constitution', title: 'The Constitution', description: 'Framework of American government', progress: 13, total: 20, xp: 100 },
      { id: 'declaration', title: 'Declaration of Independence', description: 'Founding principles & grievances', progress: 0, total: 12, xp: 60 },
      { id: 'bill-of-rights', title: 'Bill of Rights', description: 'First 10 amendments', progress: 4, total: 10, xp: 50 },
      { id: 'federalist-papers', title: 'Federalist Papers', description: 'Hamilton, Madison, Jay', progress: 0, total: 15, xp: 75 },
    ]
  },
  paGovernment: {
    id: 'pa-government',
    title: 'Pennsylvania Government',
    subtitle: 'State branches & structure',
    icon: 'PA',
    gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    topics: [
      { id: 'pa-executive', title: 'Executive Branch', description: 'Governor, Lt. Governor, Cabinet', progress: 8, total: 10, xp: 50 },
      { id: 'pa-legislative', title: 'General Assembly', description: 'Senate & House of Representatives', progress: 0, total: 12, xp: 60 },
      { id: 'pa-judicial', title: 'Judicial Branch', description: 'Supreme Court to local courts', progress: 5, total: 10, xp: 50 },
      { id: 'pa-districts', title: 'Congressional Districts', description: 'PA-8 and representation', progress: 6, total: 20, xp: 100 },
    ]
  },
  luzerneCounty: {
    id: 'luzerne-county',
    title: 'Luzerne County',
    subtitle: 'Your local government',
    icon: 'LC',
    gradient: 'linear-gradient(135deg, #22C55E, #16A34A)',
    topics: [
      { id: 'luzerne-council', title: 'County Council', description: '11-member legislative body', progress: 0, total: 8, xp: 40 },
      { id: 'luzerne-manager', title: 'County Manager', description: 'Chief administrative officer', progress: 0, total: 6, xp: 30 },
      { id: 'luzerne-officials', title: 'Elected Officials', description: 'Controller, DA, Sheriff, and more', progress: 0, total: 15, xp: 75 },
      { id: 'luzerne-services', title: 'County Services', description: 'What your county provides', progress: 0, total: 10, xp: 50 },
    ]
  },
  roleOfOfficials: {
    id: 'role-of-officials',
    title: 'Role of Officials',
    subtitle: 'Responsibilities & jurisdictions',
    icon: 'RO',
    gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    topics: [
      { id: 'federal-officials', title: 'Federal Officials', description: 'President, Congress, SCOTUS roles', progress: 3, total: 15, xp: 75 },
      { id: 'state-officials', title: 'State Officials', description: 'Governor, legislators, AG, auditor', progress: 0, total: 12, xp: 60 },
      { id: 'local-officials', title: 'Local Officials', description: 'Mayor, council, school board, sheriff', progress: 0, total: 10, xp: 50 },
    ]
  },
  structureOfGov: {
    id: 'structure-of-government',
    title: 'Structure of Government',
    subtitle: 'Three branches & their powers',
    icon: 'SG',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    topics: [
      { id: 'executive-branch', title: 'Executive Branch', description: 'Enforcement, administration, veto', progress: 10, total: 10, xp: 50, completed: true },
      { id: 'legislative-branch', title: 'Legislative Branch', description: 'Lawmaking, House vs Senate', progress: 10, total: 10, xp: 50, completed: true },
      { id: 'judicial-branch', title: 'Judicial Branch', description: 'Courts, interpretation, review', progress: 5, total: 10, xp: 50 },
      { id: 'checks-balances', title: 'Checks & Balances', description: 'How branches limit each other', progress: 0, total: 8, xp: 40 },
    ]
  },
};

// Quick Quizzes Data
const QUICK_QUIZZES = [
  {
    id: 'know-your-reps',
    abbr: 'KR',
    title: 'Know Your Reps',
    xp: 25,
    questions: 5,
    sampleQuestions: [
      'Who represents PA-8 in the U.S. House?',
      'Which party does Senator Fetterman belong to?',
      'What district is Eddie Day Pashinski from?',
    ]
  },
  {
    id: 'pa-voting-rights',
    abbr: 'VR',
    title: 'PA Voting Rights',
    xp: 25,
    questions: 5,
    sampleQuestions: [
      'When do polls open in Pennsylvania?',
      'What ID is required to vote in PA?',
      'How do you request a mail-in ballot?',
    ]
  },
  {
    id: 'campaign-finance',
    abbr: 'CF',
    title: 'Campaign Finance',
    xp: 35,
    questions: 5,
    sampleQuestions: [
      'What is a PAC?',
      "What's the max individual donation to a candidate?",
      'Where can you find FEC filings?',
    ]
  },
  {
    id: 'luzerne-county-gov',
    abbr: 'LG',
    title: 'Luzerne County Government',
    xp: 30,
    questions: 5,
    sampleQuestions: [
      'How many members are on Luzerne County Council?',
      'Who is the current Luzerne County Manager?',
      'Where is the county courthouse located?',
    ]
  },
  {
    id: 'pa-constitution',
    abbr: 'PC',
    title: 'PA Constitution Basics',
    xp: 40,
    questions: 5,
    sampleQuestions: [
      "What year was PA's current constitution adopted?",
      'How many articles are in the PA Constitution?',
      'What makes PA unique among state constitutions?',
    ]
  },
];

// Badges Data
const BADGES = [
  { id: 'streak-7', icon: 'fa-solid fa-fire', label: 'STREAK', sublabel: '7', earned: true, gradient: 'linear-gradient(180deg, #F59E0B, #D97706)', shadow: 'rgba(245, 158, 11, 0.4)' },
  { id: 'founding-docs', icon: 'fa-solid fa-scroll', label: 'FOUNDER', sublabel: 'DOCS', earned: true, gradient: 'linear-gradient(180deg, #3B82F6, #1D4ED8)', shadow: 'rgba(59, 130, 246, 0.4)' },
  { id: 'first-vote', icon: 'fa-solid fa-check-to-slot', label: 'CIVIC', sublabel: 'VOTED', earned: true, gradient: 'linear-gradient(180deg, #22C55E, #16A34A)', shadow: 'rgba(34, 197, 94, 0.4)' },
  { id: 'perfect-week', icon: 'fa-solid fa-calendar-check', label: '7/7 DAYS', earned: false },
  { id: 'town-hall', icon: 'fa-solid fa-comments', label: 'ENGAGED', earned: false },
  { id: 'pa-expert', icon: 'fa-solid fa-building-columns', label: 'PA EXPERT', earned: false },
];

// Progress bar component for topics
function ProgressBar({ progress, total, completed }) {
  const percentage = (progress / total) * 100;
  let color = '#64748B';
  if (completed) color = 'var(--success)';
  else if (percentage > 60) color = '#64748B';
  else if (percentage > 30) color = '#F59E0B';
  else if (percentage > 0) color = '#DC2626';

  return (
    <div className="progress-mini">
      <div
        className="progress-mini-fill"
        style={{ width: `${percentage}%`, background: completed ? 'var(--success)' : color }}
      />
    </div>
  );
}

// Topic Item component for nested accordion content
function TopicItem({ topic, onClick }) {
  return (
    <div className="nested-item" onClick={() => onClick(topic)}>
      <div style={{ flex: 1 }}>
        <div className="nested-item-title">{topic.title}</div>
        <div className="nested-item-desc">{topic.description}</div>
        <ProgressBar progress={topic.progress} total={topic.total} completed={topic.completed} />
      </div>
      <div className="nested-item-progress">
        {topic.completed ? (
          <span style={{ color: 'var(--success)' }}>
            <i className="fas fa-check"></i>
          </span>
        ) : (
          <span>{topic.progress}/{topic.total}</span>
        )}
      </div>
      <div className="nested-item-xp">+{topic.xp} XP</div>
    </div>
  );
}

// Learning Path Accordion with nested topics
function LearningPathAccordion({ path, onTopicClick }) {
  return (
    <Accordion
      titleElement={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="category-icon"
            style={{ background: path.gradient }}
          >
            {path.icon}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{path.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{path.subtitle}</div>
          </div>
        </div>
      }
    >
      <div className="nested-accordion">
        {path.topics.map((topic) => (
          <TopicItem
            key={topic.id}
            topic={topic}
            onClick={onTopicClick}
          />
        ))}
      </div>
    </Accordion>
  );
}

// Quick Quiz Accordion
function QuizAccordion({ quiz, onStartQuiz }) {
  return (
    <Accordion
      titleElement={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="quiz-abbr">{quiz.abbr}</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{quiz.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
              +{quiz.xp} pts - {quiz.questions} questions
            </div>
          </div>
        </div>
      }
    >
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Sample questions:
      </div>
      {quiz.sampleQuestions.map((q, idx) => (
        <div key={idx} className="sample-question">
          <i className="fas fa-circle" style={{ fontSize: '4px', marginTop: '6px' }}></i>
          {q}
        </div>
      ))}
      <Button
        variant="primary"
        fullWidth
        onClick={() => onStartQuiz(quiz)}
        className="quiz-start-btn"
      >
        Start Quiz
      </Button>
    </Accordion>
  );
}

// Badge Shield Component
function BadgeShield({ badge }) {
  if (badge.earned) {
    return (
      <div className="badge-shield-container">
        <div
          className="badge-shield"
          style={{
            background: badge.gradient,
            boxShadow: `0 4px 12px ${badge.shadow}, inset 0 1px 0 rgba(255,255,255,0.2)`
          }}
        >
          <i className={badge.icon}></i>
          {badge.sublabel && <div className="badge-shield-sublabel">{badge.sublabel}</div>}
        </div>
        <div className="badge-ribbon" style={{ background: badge.shadow?.replace('0.4', '1') || '#B45309' }}></div>
        <div className="badge-shield-label">{badge.label}</div>
      </div>
    );
  }

  return (
    <div className="badge-shield-container locked">
      <div className="badge-shield badge-shield-locked">
        <i className={badge.icon}></i>
        <i className="fa-solid fa-lock badge-lock-icon"></i>
      </div>
      <div className="badge-shield-label">{badge.label}</div>
    </div>
  );
}

// Stats Display
function StatsDisplay() {
  return (
    <div className="stats-hero">
      <div className="stats-row">
        <div className="stat-card stat-card-streak">
          <div className="stat-value">7</div>
          <div className="stat-label">Day Streak</div>
          <div className="stat-sublabel">Personal best: 14</div>
        </div>
        <div className="stat-card stat-card-level">
          <div className="stat-header">
            <span className="stat-level-label">Level</span>
            <span className="stat-level-value">4</span>
            <span className="stat-points">1,240 <span className="stat-pts">pts</span></span>
          </div>
          <div className="level-progress">
            <div className="level-progress-fill" style={{ width: '83%' }}></div>
          </div>
          <div className="level-progress-info">
            <span>83% to Level 5</span>
            <span>260 pts needed</span>
          </div>
        </div>
      </div>
      <div className="stats-summary">
        <div className="summary-item">
          <div className="summary-value">47</div>
          <div className="summary-label">Quizzes Completed</div>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <div className="summary-value">82%</div>
          <div className="summary-label">Accuracy Rate</div>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <div className="summary-value">3</div>
          <div className="summary-label">Badges Earned</div>
        </div>
      </div>
    </div>
  );
}

export default function LearnScreen() {
  const navigate = useNavigate();

  const handleTopicClick = (topic) => {
    navigate(`/quiz/${topic.id}`);
  };

  const handleStartQuiz = (quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  return (
    <>
      <Header
        title="Learn"
        showSearch={false}
      />
      <Screen>
        {/* Stats Hero Section */}
        <StatsDisplay />

        {/* Learning Paths Section */}
        <div className="section-header section-header-knowledge">
          <i className="fas fa-book-open"></i>
          Learning Paths
        </div>

        <div className="learning-paths">
          {Object.entries(LEARNING_PATHS).map(([key, path]) => (
            <LearningPathAccordion
              key={key}
              path={path}
              onTopicClick={handleTopicClick}
            />
          ))}
        </div>

        {/* Quick Quizzes Section */}
        <div className="section-header section-header-quizzes">
          <i className="fas fa-bolt"></i>
          Quick Quizzes
        </div>

        <div className="quick-quizzes">
          {QUICK_QUIZZES.slice(0, 2).map((quiz) => (
            <QuizAccordion
              key={quiz.id}
              quiz={quiz}
              onStartQuiz={handleStartQuiz}
            />
          ))}
        </div>

        {/* View All Quizzes Link */}
        <button
          onClick={() => navigate('/quizzes')}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          View All Quizzes ({QUICK_QUIZZES.length})
        </button>

        {/* Special Features Row - 3 icons: Ghost Advisory, Timeline, All Quizzes */}
        <div className="feature-row">
          {/* Ghost Advisory Panel */}
          <div
            className="feature-card"
            onClick={() => navigate('/ghost')}
          >
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }}>
              GAP
            </div>
            <div className="feature-title">Ghost Advisory</div>
            <div className="feature-desc">Historical perspectives</div>
          </div>

          {/* Historical Timeline */}
          <div
            className="feature-card"
            onClick={() => navigate('/timeline')}
          >
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }}>
              <i className="fa-solid fa-timeline"></i>
            </div>
            <div className="feature-title">Timeline</div>
            <div className="feature-desc">US history 1450-present</div>
          </div>

          {/* All Quizzes */}
          <div
            className="feature-card"
            onClick={() => navigate('/quizzes')}
          >
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' }}>
              <i className="fa-solid fa-list-check"></i>
            </div>
            <div className="feature-title">All Quizzes</div>
            <div className="feature-desc">Full curriculum</div>
          </div>
        </div>

        {/* Daily Challenge CTA */}
        <div className="daily-challenge">
          <div className="daily-challenge-content">
            <div className="daily-challenge-title">Daily Challenge</div>
            <div className="daily-challenge-desc">Complete any quiz to earn bonus pts and maintain your streak</div>
          </div>
          <div className="daily-challenge-xp">+60</div>
        </div>

        {/* Badges Section */}
        <div className="section-header section-header-badges">
          <i className="fas fa-award"></i>
          Badges
        </div>

        <Card className="badges-container">
          <div className="badges-header">
            <span className="badges-title">Achievements</span>
            <a href="#" className="badges-view-all">View All</a>
          </div>
          <div className="badges-grid">
            {BADGES.map((badge) => (
              <BadgeShield key={badge.id} badge={badge} />
            ))}
          </div>
        </Card>

        {/* Extra padding at bottom for fixed PA Facts ticker + nav */}
        <div style={{ height: '100px' }}></div>
      </Screen>
    </>
  );
}
