import { useRef, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import './CandidateCompareScreen.css';

// Mock race data (would come from API based on election/race ID)
const MOCK_RACES = {
  'wb-council-a': {
    id: 'wb-council-a',
    title: 'WB City Council - District A',
    type: 'Primary',
    date: 'May 20, 2025',
    candidates: [
      {
        id: 'john-murphy',
        name: 'John Murphy',
        party: 'D',
        positions: {
          economy: {
            headline: 'Tax Incentives',
            text: 'Downtown revitalization through business tax breaks and development zones',
            detail: 'Voted for 2022 TIF district'
          },
          housing: {
            headline: 'Rehab Focus',
            text: 'Rehabilitate vacant properties, first-time homeowner assistance programs',
            detail: '500 units rehabbed 2018-22'
          },
          infrastructure: {
            headline: 'Roads & Water',
            text: 'Prioritize road repairs, upgrade aging water system infrastructure',
            detail: 'Secured $2M state grant'
          },
          safety: {
            headline: 'Community Policing',
            text: 'Expand beat officers, strengthen police-community relations',
            detail: 'Police union endorsed'
          }
        },
        experience: {
          years: '8 Years',
          primary: 'City Council (2014-2022)',
          details: ['School Board (2010-14)', 'Finance Committee Chair', 'Lifelong WB resident']
        },
        endorsements: [
          { icon: 'M', name: 'Mayor Williams' },
          { icon: 'P', name: 'Police Benevolent Assn' },
          { icon: 'T', name: 'Times Leader' }
        ],
        moreEndorsements: 4,
        funding: {
          total: '$45K',
          breakdown: ['65% Individual donors', '25% PACs', '10% Self-funded']
        }
      },
      {
        id: 'maria-rodriguez',
        name: 'Maria Rodriguez',
        party: 'D',
        positions: {
          economy: {
            headline: 'Worker First',
            text: 'Living wage mandate, worker co-op support, union partnerships',
            detail: 'Endorsed by SEIU Local 668'
          },
          housing: {
            headline: 'Rent Control',
            text: 'Strong tenant protections, affordable housing fund, anti-displacement measures',
            detail: 'Led tenant rights coalition'
          },
          infrastructure: {
            headline: 'Green Transit',
            text: 'Bike lanes, public transit expansion, green infrastructure projects',
            detail: 'Climate action plan author'
          },
          safety: {
            headline: 'Reform & Invest',
            text: 'Mental health responders, civilian oversight board, youth programs',
            detail: 'Led reform task force'
          }
        },
        experience: {
          years: '5 Years',
          primary: 'Nonprofit Executive Director',
          details: ['Community organizer', 'Housing advocacy', 'First-gen American']
        },
        endorsements: [
          { icon: 'T', name: 'Teachers Union' },
          { icon: 'S', name: 'SEIU Local 668' },
          { icon: 'P', name: 'Progressive Dems of PA' }
        ],
        moreEndorsements: 6,
        funding: {
          total: '$28K',
          breakdown: ['85% Small donors (<$50)', '12% Unions', '3% Other']
        }
      },
      {
        id: 'thomas-kelly',
        name: 'Thomas Kelly',
        party: 'D',
        positions: {
          economy: {
            headline: 'Pro-Business',
            text: 'Small business grants, reduce regulations, streamline permits',
            detail: 'Chamber of Commerce member'
          },
          housing: {
            headline: 'Market Solutions',
            text: 'Blight enforcement, property tax reform, incentivize development',
            detail: 'Opposes rent control'
          },
          infrastructure: {
            headline: 'Efficiency',
            text: 'Public-private partnerships, efficient spending, competitive bidding',
            detail: 'Cut costs 15% as board chair'
          },
          safety: {
            headline: 'Full Funding',
            text: 'Restore police budget, new equipment, recruit more officers',
            detail: 'FOP-endorsed'
          }
        },
        experience: {
          years: '15 Years',
          primary: 'Small Business Owner',
          details: ['Chamber VP 2018-22', 'Rotary Club President', "Kelly's Auto since 2009"]
        },
        endorsements: [
          { icon: 'C', name: 'Chamber of Commerce' },
          { icon: 'R', name: 'Realtors Association' },
          { icon: 'B', name: 'Building Trades Council' }
        ],
        moreEndorsements: 2,
        funding: {
          total: '$62K',
          breakdown: ['40% Self-funded', '35% Business donors', '25% Individual']
        }
      }
    ],
    coverage: [
      { id: 1, headline: 'City Council Candidates Square Off in Forum', source: "Citizens' Voice", timeAgo: '1d ago' },
      { id: 2, headline: 'What\'s at Stake in the District A Race', source: 'Times Leader', timeAgo: '3d ago' },
      { id: 3, headline: 'Housing Crisis Takes Center Stage', source: 'WBRE', timeAgo: '5d ago' }
    ]
  }
};

// Get initials from name
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
};

// Issue section component
const IssueSection = ({ title, issueKey, candidates, scrollRef, onScroll }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (onScroll) onScroll(el.scrollLeft);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  // Sync scroll position from parent
  useEffect(() => {
    if (scrollRef.current !== null && sectionRef.current) {
      sectionRef.current.scrollLeft = scrollRef.current;
    }
  });

  return (
    <div className="compare-issue-section">
      <div className="compare-issue-header">{title}</div>
      <div className="compare-issue-scroll" ref={sectionRef}>
        {candidates.map((candidate) => {
          const position = candidate.positions[issueKey];
          return (
            <div key={candidate.id} className="compare-policy-box">
              <div className="compare-policy-label">Position</div>
              <div className="compare-policy-headline">{position.headline}</div>
              <div className="compare-policy-text">{position.text}</div>
              <div className="compare-policy-detail">{position.detail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Experience section
const ExperienceSection = ({ candidates, scrollRef, onScroll }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (onScroll) onScroll(el.scrollLeft);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  useEffect(() => {
    if (scrollRef.current !== null && sectionRef.current) {
      sectionRef.current.scrollLeft = scrollRef.current;
    }
  });

  return (
    <div className="compare-issue-section">
      <div className="compare-issue-header">Experience</div>
      <div className="compare-issue-scroll" ref={sectionRef}>
        {candidates.map((candidate) => (
          <div key={candidate.id} className="compare-policy-box">
            <div className="compare-policy-headline">{candidate.experience.years}</div>
            <div className="compare-policy-text" style={{ marginTop: '4px' }}>{candidate.experience.primary}</div>
            {candidate.experience.details.map((detail, idx) => (
              <div key={idx} className="compare-policy-detail">{detail}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Endorsements section
const EndorsementsSection = ({ candidates, scrollRef, onScroll }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (onScroll) onScroll(el.scrollLeft);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  useEffect(() => {
    if (scrollRef.current !== null && sectionRef.current) {
      sectionRef.current.scrollLeft = scrollRef.current;
    }
  });

  return (
    <div className="compare-issue-section">
      <div className="compare-issue-header">Key Endorsements</div>
      <div className="compare-issue-scroll" ref={sectionRef}>
        {candidates.map((candidate) => (
          <div key={candidate.id} className="compare-policy-box">
            {candidate.endorsements.map((endorsement, idx) => (
              <div key={idx} className="compare-endorsement-item">
                <div className="compare-endorsement-icon">{endorsement.icon}</div>
                <div className="compare-endorsement-name">{endorsement.name}</div>
              </div>
            ))}
            {candidate.moreEndorsements > 0 && (
              <div className="compare-policy-detail" style={{ marginTop: '8px' }}>
                +{candidate.moreEndorsements} more endorsements
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Funding section
const FundingSection = ({ candidates, scrollRef, onScroll }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (onScroll) onScroll(el.scrollLeft);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  useEffect(() => {
    if (scrollRef.current !== null && sectionRef.current) {
      sectionRef.current.scrollLeft = scrollRef.current;
    }
  });

  return (
    <div className="compare-issue-section">
      <div className="compare-issue-header">Campaign Funding</div>
      <div className="compare-issue-scroll" ref={sectionRef}>
        {candidates.map((candidate) => (
          <div key={candidate.id} className="compare-policy-box" style={{ textAlign: 'center' }}>
            <div className="compare-funding-amount">{candidate.funding.total}</div>
            <div className="compare-policy-text">Total Raised</div>
            <div className="compare-funding-breakdown">
              {candidate.funding.breakdown.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CandidateCompareScreen() {
  const { raceId } = useParams();
  const race = MOCK_RACES[raceId] || MOCK_RACES['wb-council-a'];
  const headerScrollRef = useRef(null);
  const scrollPosition = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrolling = useRef(false);

  const handleHeaderScroll = (e) => {
    if (isScrolling.current) return;
    const scrollLeft = e.target.scrollLeft;
    scrollPosition.current = scrollLeft;

    // Update active dot
    const scrollWidth = e.target.scrollWidth - e.target.clientWidth;
    const scrollPercent = scrollWidth > 0 ? scrollLeft / scrollWidth : 0;
    setActiveIndex(scrollPercent < 0.5 ? 0 : 1);
  };

  const handleSectionScroll = (scrollLeft) => {
    if (isScrolling.current) return;
    isScrolling.current = true;
    scrollPosition.current = scrollLeft;

    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = scrollLeft;
    }

    // Update active dot
    if (headerScrollRef.current) {
      const scrollWidth = headerScrollRef.current.scrollWidth - headerScrollRef.current.clientWidth;
      const scrollPercent = scrollWidth > 0 ? scrollLeft / scrollWidth : 0;
      setActiveIndex(scrollPercent < 0.5 ? 0 : 1);
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 10);
  };

  const handleDotClick = (index) => {
    if (headerScrollRef.current) {
      const scrollTarget = index === 0 ? 0 : headerScrollRef.current.scrollWidth - headerScrollRef.current.clientWidth;
      headerScrollRef.current.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header
        title="Compare"
        subtitle="Side by side"
        backTo="/leaders"
        showSearch={false}
      />

      {/* Race Header */}
      <div className="compare-race-header">
        <div className="compare-race-title">{race.title}</div>
        <div className="compare-race-meta">{race.type} - {race.date} - {race.candidates.length} candidates</div>
      </div>

      {/* Sticky Candidate Header */}
      <div className="compare-candidate-header-wrapper">
        <div
          className="compare-candidate-header-scroll"
          ref={headerScrollRef}
          onScroll={handleHeaderScroll}
        >
          {race.candidates.map((candidate) => (
            <div key={candidate.id} className="compare-candidate-header-item">
              <div className={`compare-candidate-avatar compare-candidate-avatar--${candidate.party === 'D' ? 'dem' : candidate.party === 'R' ? 'rep' : 'ind'}`}>
                {getInitials(candidate.name)}
              </div>
              <div className="compare-candidate-name">{candidate.name}</div>
              <span className={`compare-party-badge compare-party-badge--${candidate.party}`}>
                {candidate.party}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="compare-pagination-dots">
          <div
            className={`compare-pagination-dot ${activeIndex === 0 ? 'active' : ''}`}
            onClick={() => handleDotClick(0)}
          />
          <div
            className={`compare-pagination-dot ${activeIndex === 1 ? 'active' : ''}`}
            onClick={() => handleDotClick(1)}
          />
        </div>
        <div className="compare-scroll-hint">
          <span>Swipe to see all candidates</span>
          <span style={{ fontSize: '12px' }}>→</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <Screen style={{ paddingTop: 0 }}>
        <IssueSection
          title="Economy & Jobs"
          issueKey="economy"
          candidates={race.candidates}
          scrollRef={scrollPosition}
          onScroll={handleSectionScroll}
        />

        <IssueSection
          title="Housing"
          issueKey="housing"
          candidates={race.candidates}
          scrollRef={scrollPosition}
          onScroll={handleSectionScroll}
        />

        <IssueSection
          title="Infrastructure"
          issueKey="infrastructure"
          candidates={race.candidates}
          scrollRef={scrollPosition}
          onScroll={handleSectionScroll}
        />

        <IssueSection
          title="Public Safety"
          issueKey="safety"
          candidates={race.candidates}
          scrollRef={scrollPosition}
          onScroll={handleSectionScroll}
        />

        <ExperienceSection
          candidates={race.candidates}
          scrollRef={scrollPosition}
          onScroll={handleSectionScroll}
        />

        <EndorsementsSection
          candidates={race.candidates}
          scrollRef={scrollPosition}
          onScroll={handleSectionScroll}
        />

        <FundingSection
          candidates={race.candidates}
          scrollRef={scrollPosition}
          onScroll={handleSectionScroll}
        />

        {/* Coverage */}
        <div className="compare-coverage-card">
          <div className="compare-coverage-title">Coverage</div>
          {race.coverage.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="compare-coverage-item"
            >
              <div className="compare-coverage-headline">"{article.headline}"</div>
              <div className="compare-coverage-meta">{article.source} - {article.timeAgo}</div>
            </Link>
          ))}
        </div>

        <div style={{ height: '100px' }}></div>
      </Screen>
    </>
  );
}
