import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { Button, Card } from '../../components/ui';
import './QuizScreen.css';

// Placeholder quiz data - will be replaced with API calls
const QUIZ_DATA = {
  'civ-1': {
    id: 'civ-1',
    title: 'How Laws Are Made',
    xpPerQuestion: 20,
    questions: [
      {
        id: 1,
        question: 'What is the first step in the legislative process?',
        options: [
          'The President signs the bill',
          'A bill is introduced in Congress',
          'The Supreme Court reviews the bill',
          'Citizens vote on the bill'
        ],
        correct: 1,
        hint: 'Think about where legislation begins its journey.'
      },
      {
        id: 2,
        question: 'Which branch of government is responsible for making laws?',
        options: [
          'Executive Branch',
          'Judicial Branch',
          'Legislative Branch',
          'Administrative Branch'
        ],
        correct: 2,
        hint: 'Congress is part of which branch?'
      },
      {
        id: 3,
        question: 'What happens after both houses of Congress pass a bill?',
        options: [
          'It automatically becomes law',
          'It goes to the Supreme Court',
          'It goes to the President',
          'It goes back to committee'
        ],
        correct: 2,
        hint: 'The President has veto power over...'
      }
    ]
  },
  'bill-of-rights': {
    id: 'bill-of-rights',
    title: 'Bill of Rights',
    xpPerQuestion: 20,
    questions: [
      {
        id: 1,
        question: 'How many amendments are in the Bill of Rights?',
        options: [
          '5 amendments',
          '10 amendments',
          '15 amendments',
          '27 amendments'
        ],
        correct: 1,
        hint: 'The Bill of Rights was ratified in 1791.'
      },
      {
        id: 2,
        question: 'Which amendment protects freedom of speech?',
        options: [
          'First Amendment',
          'Second Amendment',
          'Fourth Amendment',
          'Fifth Amendment'
        ],
        correct: 0,
        hint: 'This amendment also covers freedom of religion and the press.'
      },
      {
        id: 3,
        question: 'The Fourth Amendment protects against:',
        options: [
          'Self-incrimination',
          'Cruel and unusual punishment',
          'Unreasonable searches and seizures',
          'Quartering of soldiers'
        ],
        correct: 2,
        hint: 'Think about privacy and warrants.'
      }
    ]
  },
  'know-your-reps': {
    id: 'know-your-reps',
    title: 'Know Your Reps',
    xpPerQuestion: 25,
    questions: [
      {
        id: 1,
        question: 'Who represents PA-8 in the U.S. House?',
        options: [
          'John Fetterman',
          'Matt Cartwright',
          'Bob Casey',
          'Josh Shapiro'
        ],
        correct: 1,
        hint: 'This representative has served since 2013.'
      },
      {
        id: 2,
        question: 'How many U.S. Senators does Pennsylvania have?',
        options: [
          '1',
          '2',
          '3',
          'It varies by population'
        ],
        correct: 1,
        hint: 'Every state has the same number of senators.'
      }
    ]
  }
};

// Default quiz for unknown IDs
const DEFAULT_QUIZ = QUIZ_DATA['civ-1'];

export default function QuizScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = QUIZ_DATA[id] || DEFAULT_QUIZ;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [streak] = useState(7); // Would come from user context

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correct;
    if (isCorrect) {
      setScore(score + 1);
      const questionXp = quiz.xpPerQuestion - (showHint ? 5 : 0);
      setXpEarned(xpEarned + questionXp);
    }
    setShowResult(true);
    setShowHint(false);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Quiz complete - navigate to results or back to learn
      navigate('/learn');
      return;
    }
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
  };

  const handleUseHint = () => {
    if (showResult || showHint) return;
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
  };

  return (
    <>
      <Header title={quiz.title} backTo="/learn" showSearch={false} />

      {/* Full-width progress bar */}
      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stats Bar */}
      <div className="quiz-stats-bar">
        <div className="quiz-stat">
          <div className="quiz-stat-value quiz-stat-correct">{score}</div>
          <div className="quiz-stat-label">CORRECT</div>
        </div>
        <div className="quiz-stat">
          <div className="quiz-stat-value quiz-stat-xp">+{xpEarned}</div>
          <div className="quiz-stat-label">XP EARNED</div>
        </div>
        <div className="quiz-stat">
          <div className="quiz-stat-value quiz-stat-streak">{streak}</div>
          <div className="quiz-stat-label">DAY STREAK</div>
        </div>
      </div>

      <Screen>
        {/* Question Card */}
        <div className="quiz-question-card">
          <div className="quiz-question-number">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
          <div className="quiz-question-text">
            {question.question}
          </div>
        </div>

        {/* Answer Options */}
        <div className="quiz-options">
          {question.options.map((option, index) => {
            let optionClass = 'quiz-option';

            if (showResult) {
              if (index === question.correct) {
                optionClass += ' quiz-option--correct';
              } else if (index === selectedAnswer && index !== question.correct) {
                optionClass += ' quiz-option--incorrect';
              }
            } else if (index === selectedAnswer) {
              optionClass += ' quiz-option--selected';
            }

            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <span className={`quiz-option-letter ${index === selectedAnswer && !showResult ? 'quiz-option-letter--selected' : ''} ${showResult && index === question.correct ? 'quiz-option-letter--correct' : ''} ${showResult && index === selectedAnswer && index !== question.correct ? 'quiz-option-letter--incorrect' : ''}`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="quiz-option-text">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Hint */}
        {!showResult && question.hint && (
          <div className="quiz-hint-container">
            {showHint ? (
              <div className="quiz-hint-revealed">
                <i className="fas fa-lightbulb"></i>
                <span>{question.hint}</span>
              </div>
            ) : (
              <button className="quiz-hint-btn" onClick={handleUseHint}>
                💡 Use a hint (-5 XP)
              </button>
            )}
          </div>
        )}

        {/* Result feedback */}
        {showResult && (
          <div className={`quiz-feedback ${selectedAnswer === question.correct ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect'}`}>
            <div className="quiz-feedback-header">
              <i className={`fas ${selectedAnswer === question.correct ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
              <span>{selectedAnswer === question.correct ? 'Correct!' : 'Incorrect'}</span>
              {selectedAnswer === question.correct && (
                <span className="quiz-feedback-xp">+{quiz.xpPerQuestion - (showHint ? 5 : 0)} XP</span>
              )}
            </div>
            {selectedAnswer !== question.correct && (
              <p className="quiz-feedback-answer">
                The correct answer is: {question.options[question.correct]}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="quiz-actions">
          {!showResult ? (
            <Button
              variant="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button variant="primary" fullWidth onClick={handleNext}>
              {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
            </Button>
          )}
        </div>
      </Screen>
    </>
  );
}
