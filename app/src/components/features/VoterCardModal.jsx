import { useState } from 'react';

export default function VoterCardModal({ isOpen, onClose, user }) {
  const [flipped, setFlipped] = useState(false);

  if (!isOpen) return null;

  // Require user data - do NOT use fallback placeholder data
  if (!user || (!user.display_name && !user.email)) {
    return (
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}
      >
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '24px',
          borderRadius: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '12px' }}>
            Unable to load voter card
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Please log in to view your voter information
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              background: 'var(--accent-purple)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Parse display_name into parts for display
  const displayName = user.display_name || user.email?.split('@')[0] || 'User';
  const nameParts = displayName.includes(' ') ? displayName.split(' ') : [displayName];
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  // Generate initials from display_name
  const getInitials = () => {
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    // For single-word names (like usernames), just use first letter
    return displayName.charAt(0).toUpperCase();
  };

  // Extract user data - all from actual user object
  const displayData = {
    displayName: displayName,
    firstName: firstName,
    lastName: lastName,
    initials: getInitials(),
    zip: user.zip_code || user.zip || user.zipcode || '-----',
    party: user.party || 'I',
    precinct: user.precinct || `${user.city || 'Your City'}, PA`,
    voterId: user.voter_id || user.voter_hash?.substring(0, 12) || 'Pending',
    registrationDate: user.verified_at ? new Date(user.verified_at).toLocaleDateString() : 'Not verified',
    pollingPlace: user.polling_place || 'Check vote.pa.gov',
    address: user.address || `${user.city || ''}, PA ${user.zip_code || ''}`.trim(),
    streakDays: user.streak_days || 0,
    xpTotal: user.xp_total || 0,
    level: user.level || 1,
    registered: user.is_verified === true || user.is_verified === 1,
    congressionalDistrict: user.congressional_district,
    stateSenateDistrict: user.state_senate_district,
    stateHouseDistrict: user.state_house_district,
    county: user.county_name || 'Pennsylvania',
    schoolDistrict: user.school_district,
  };

  // Build districts dynamically from user data
  const districts = [];
  if (displayData.congressionalDistrict) {
    districts.push({ level: 'Federal', name: `U.S. House PA-${displayData.congressionalDistrict}`, rep: 'View representatives' });
  }
  districts.push({ level: 'Federal', name: 'U.S. Senate', rep: 'John Fetterman (D), Dave McCormick (R)' });
  if (displayData.stateHouseDistrict) {
    districts.push({ level: 'State', name: `PA House District ${displayData.stateHouseDistrict}`, rep: 'View representative' });
  }
  if (displayData.stateSenateDistrict) {
    districts.push({ level: 'State', name: `PA Senate District ${displayData.stateSenateDistrict}`, rep: 'View representative' });
  }
  if (displayData.county) {
    districts.push({ level: 'County', name: displayData.county, rep: 'County officials' });
  }
  if (displayData.schoolDistrict) {
    districts.push({ level: 'School', name: displayData.schoolDistrict, rep: 'School Board' });
  }

  // Party color
  const partyGradient = displayData.party === 'D'
    ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)'
    : displayData.party === 'R'
    ? 'linear-gradient(135deg, #B91C1C, #EF4444)'
    : 'linear-gradient(135deg, #7C3AED, #A78BFA)';

  const partyBorder = displayData.party === 'D'
    ? '3px solid #60A5FA'
    : displayData.party === 'R'
    ? '3px solid #F87171'
    : '3px solid #C4B5FD';

  const partyName = displayData.party === 'D' ? 'Democrat'
    : displayData.party === 'R' ? 'Republican'
    : displayData.party === 'L' ? 'Libertarian'
    : displayData.party === 'G' ? 'Green'
    : 'Independent';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        paddingTop: 'calc(60px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Close button at top */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 'calc(20px + env(safe-area-inset-top, 0px))',
          right: '20px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        <i className="fas fa-times" style={{ color: 'white', fontSize: '20px' }}></i>
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          perspective: '1000px',
        }}
      >
        {/* Card container - takes full available height */}
        <div
          onClick={() => setFlipped(!flipped)}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxHeight: '700px',
            cursor: 'pointer',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front of card */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #1E1E2E 0%, #2D2D44 100%)',
              borderRadius: '24px',
              border: '2px solid rgba(139, 92, 246, 0.4)',
              padding: '28px',
              boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header with LOCKED gradient logo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '6px',
                }}>
                  CIVIQ VOTER ID
                </div>
                {/* CIVIQ Logo - LOCKED gradient spec from variables.css */}
                <div
                  className="logo-gradient"
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                  }}
                >
                  CIVIQ
                </div>
              </div>
              <div style={{
                width: '64px',
                height: '64px',
                background: partyGradient,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 700,
                color: 'white',
                border: partyBorder,
              }}>
                {displayData.initials}
              </div>
            </div>

            {/* Name & Location */}
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
              {displayData.displayName}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              {displayData.precinct} · {displayData.zip}
            </div>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              gap: '24px',
              marginBottom: '20px',
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Party</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>{partyName}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Level</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#8B5CF6' }}>{displayData.level}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Streak</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#F59E0B' }}>{displayData.streakDays} days</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>XP</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#10B981' }}>{displayData.xpTotal.toLocaleString()}</div>
              </div>
            </div>

            {/* Your Districts Section */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px'
              }}>
                Your Districts
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {districts.map((d, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                  }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '5px',
                      background: d.level === 'Federal' ? '#64748B'
                        : d.level === 'State' ? '#8B5CF6'
                        : d.level === 'County' ? '#22C55E'
                        : d.level === 'School' ? '#3B82F6'
                        : '#F59E0B',
                      color: 'white',
                      minWidth: '56px',
                      textAlign: 'center',
                    }}>
                      {d.level.toUpperCase()}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
                        {d.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        {d.rep}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tap hint */}
            <div style={{
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.35)',
            }}>
              Tap to flip for voter details
            </div>
          </div>

          {/* Back of card */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, #1E1E2E 0%, #2D2D44 100%)',
              borderRadius: '24px',
              border: '2px solid rgba(139, 92, 246, 0.4)',
              padding: '28px',
              boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div
                className="logo-gradient"
                style={{ fontSize: '24px', fontWeight: 800 }}
              >
                CIVIQ
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Voter Details
              </div>
            </div>

            {/* Barcode area */}
            <div style={{
              background: 'white',
              height: '70px',
              borderRadius: '8px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              padding: '12px',
            }}>
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: Math.random() > 0.5 ? '2px' : '3px',
                    height: '100%',
                    background: '#000',
                  }}
                />
              ))}
            </div>

            {/* Voter Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', fontSize: '14px' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Voter ID</div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: '13px', fontFamily: 'monospace' }}>{displayData.voterId}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Verified</div>
                <div style={{ color: 'white', fontWeight: 600 }}>{displayData.registrationDate}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Polling Place</div>
                <div style={{ color: 'white', fontWeight: 600 }}>{displayData.pollingPlace}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Location</div>
                <div style={{ color: 'white', fontWeight: 600 }}>{displayData.address || 'Pennsylvania'}</div>
              </div>
            </div>

            {/* Registration Status */}
            <div style={{
              marginTop: 'auto',
              padding: '16px',
              background: displayData.registered ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: displayData.registered ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <i className={displayData.registered ? "fas fa-check-circle" : "fas fa-exclamation-circle"} style={{ color: displayData.registered ? '#22C55E' : '#EF4444', fontSize: '20px' }}></i>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: displayData.registered ? '#22C55E' : '#EF4444' }}>
                  {displayData.registered ? 'Verified Voter' : 'Not Verified'}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  {displayData.registered ? 'Registration confirmed' : 'Verify at vote.pa.gov'}
                </div>
              </div>
            </div>

            {/* XP badge */}
            <div style={{
              position: 'absolute',
              bottom: '28px',
              right: '28px',
              background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
              padding: '10px 16px',
              borderRadius: '24px',
              fontSize: '13px',
              fontWeight: 700,
              color: 'white',
            }}>
              {displayData.xpTotal.toLocaleString()} XP
            </div>

            {/* Tap hint */}
            <div style={{
              position: 'absolute',
              bottom: '28px',
              left: '28px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.35)',
            }}>
              Tap to flip
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
