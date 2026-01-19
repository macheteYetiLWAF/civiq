import { useState, useEffect } from 'react';

const PA_FACTS = [
  "Pennsylvania has 67 counties, the 3rd most of any U.S. state",
  "PA was the 2nd state to ratify the U.S. Constitution in 1787",
  "Philadelphia served as the nation's capital from 1790 to 1800",
  "Pennsylvania is known as the 'Keystone State' for its central role",
  "PA has the highest number of covered bridges in the U.S.",
  "The first daily newspaper in America was published in Philadelphia in 1784",
  "PA's state motto is 'Virtue, Liberty, and Independence'",
  "Pennsylvania has more than 120 state parks",
  "The first computer (ENIAC) was built at the University of Pennsylvania",
  "PA is the only original colony not bordered by the Atlantic Ocean",
];

export default function PAFactTicker({ position = 'top' }) {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % PA_FACTS.length);
        setIsAnimating(false);
      }, 500);
    }, 30000); // Rotate every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentFactIndex((prev) => (prev + 1) % PA_FACTS.length);
  };

  // Fixed position at bottom, above nav bar
  // Nav is approx 46px high + safe area inset
  const navHeight = 46;

  const containerStyle = {
    position: 'fixed',
    bottom: `calc(${navHeight}px + env(safe-area-inset-bottom, 0px))`,
    left: 0,
    right: 0,
    background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.95), rgba(16, 185, 129, 0.85))',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderTop: '1px solid rgba(16, 185, 129, 0.5)',
    borderBottom: '1px solid var(--border)',
    zIndex: 50,
  };

  return (
    <div style={containerStyle}>
      <div style={{
        background: '#10B981',
        color: 'white',
        fontSize: '10px',
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}>
        PA FACT
      </div>
      <div style={{
        fontSize: '13px',
        color: 'white',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
        opacity: isAnimating ? 0 : 1,
        transition: 'opacity 0.3s ease',
        fontWeight: 500,
      }}>
        {PA_FACTS[currentFactIndex]}
      </div>
      <button
        onClick={handleNext}
        style={{
          fontSize: '12px',
          color: 'white',
          fontWeight: 700,
          background: 'rgba(0,0,0,0.2)',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 10px',
          borderRadius: '4px',
        }}
      >
        Next
      </button>
    </div>
  );
}
