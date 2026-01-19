import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Screen } from '../../components/layout';
import { Card, Button } from '../../components/ui';
import { VoterCardModal } from '../../components/features';
import { useAuth } from '../../context/AuthContext';
import './ProfileScreen.css';

// Calculate level from XP
function calculateLevel(xp) {
  if (xp >= 10000) return 5;
  if (xp >= 5000) return 4;
  if (xp >= 2000) return 3;
  if (xp >= 500) return 2;
  return 1;
}

// Get initials from name - handles single word usernames
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  // For single word (like username), take first letter only
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  // For full names, take first and last initial
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Format date for member since
function formatMemberSince(dateString) {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [voterCardOpen, setVoterCardOpen] = useState(false);

  // Map user fields from database schema
  const displayName = user?.display_name || user?.username || user?.email?.split('@')[0] || 'Guest';
  const email = user?.email || '';
  const zipCode = user?.zip_code || '';
  const city = user?.city || '';
  const district = user?.congressional_district ? `PA-${user.congressional_district}` : '';
  const memberSince = user?.created_at;
  const streakDays = user?.streak_days || 0;
  const totalXP = user?.xp_total || 0;
  const level = user?.level || calculateLevel(totalXP);

  // Reading balance percentages
  const readingBalance = user?.reading_balance || user?.readingBalance || {
    left: 33,
    center: 34,
    right: 33
  };

  // Voter registration info - map from database schema
  const isRegistered = user?.is_verified === true || user?.is_verified === 1;
  const partyMap = { D: 'Democrat', R: 'Republican', L: 'Libertarian', G: 'Green', I: 'Independent' };
  const partyAffiliation = user?.party ? partyMap[user.party] || user.party : 'Not specified';
  const votingDistrict = district || (user?.state_house_district ? `State House ${user.state_house_district}` : 'Not set');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSettingsClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <Header title="Profile" showSearch={false} />
      <Screen>
        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {getInitials(displayName)}
          </div>
          <h2 className="profile-name">{displayName}</h2>
          {email && <p className="profile-email">{email}</p>}
          {(city || zipCode || district) && (
            <p className="profile-location">
              <i className="fas fa-map-marker-alt"></i>
              {[city, zipCode, district].filter(Boolean).join(' · ')}
            </p>
          )}
          {memberSince && (
            <p className="profile-member-since">
              Member since {formatMemberSince(memberSince)}
            </p>
          )}
        </div>

        {/* Stats Section */}
        <Card>
          <div className="profile-stats-grid">
            <div className="profile-stat-item">
              <div className="profile-stat-value streak">{streakDays}</div>
              <div className="profile-stat-label">Streak</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-value xp">{totalXP.toLocaleString()}</div>
              <div className="profile-stat-label">XP</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-value level">{level}</div>
              <div className="profile-stat-label">Level</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-value balance">{readingBalance.center}%</div>
              <div className="profile-stat-label">Balanced</div>
            </div>
          </div>

          {/* Reading Balance Visualization */}
          <div className="reading-balance-section">
            <div className="reading-balance-title">Reading Balance</div>
            <div className="reading-balance-bar">
              <div
                className="balance-segment left"
                style={{ width: `${readingBalance.left}%` }}
              ></div>
              <div
                className="balance-segment center"
                style={{ width: `${readingBalance.center}%` }}
              ></div>
              <div
                className="balance-segment right"
                style={{ width: `${readingBalance.right}%` }}
              ></div>
            </div>
            <div className="reading-balance-labels">
              <span className="balance-label">
                <span className="balance-dot left"></span>
                Left {readingBalance.left}%
              </span>
              <span className="balance-label">
                <span className="balance-dot center"></span>
                Center {readingBalance.center}%
              </span>
              <span className="balance-label">
                <span className="balance-dot right"></span>
                Right {readingBalance.right}%
              </span>
            </div>
          </div>
        </Card>

        {/* Voter Registration Section */}
        <div className="profile-section-header">Voter Registration</div>
        <Card className="voter-registration-card">
          <div className="voter-reg-header">
            <span className="voter-reg-title">Registration Status</span>
            <span className={`voter-reg-status ${isRegistered ? 'registered' : 'not-registered'}`}>
              <i className={`fas ${isRegistered ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              {isRegistered ? 'Registered' : 'Not Registered'}
            </span>
          </div>

          <div className="voter-reg-details">
            <div className="voter-reg-item">
              <div className="voter-reg-item-label">Party</div>
              <div className="voter-reg-item-value">{partyAffiliation}</div>
            </div>
            <div className="voter-reg-item">
              <div className="voter-reg-item-label">District</div>
              <div className="voter-reg-item-value">{votingDistrict}</div>
            </div>
          </div>

          <div className="voter-card-link" onClick={() => setVoterCardOpen(true)}>
            <span className="voter-card-link-text">
              <i className="fas fa-id-card"></i>
              View Voter Card
            </span>
            <i className="fas fa-chevron-right"></i>
          </div>
        </Card>

        {/* Settings Shortcuts */}
        <div className="profile-section-header">Settings</div>
        <Card className="settings-menu" padding="compact">
          <div className="settings-item" onClick={() => handleSettingsClick('/profile/edit')}>
            <div className="settings-item-left">
              <div className="settings-item-icon">
                <i className="fas fa-user-edit"></i>
              </div>
              <span className="settings-item-text">Edit Profile</span>
            </div>
            <i className="fas fa-chevron-right"></i>
          </div>

          <div className="settings-item" onClick={() => handleSettingsClick('/settings/notifications')}>
            <div className="settings-item-left">
              <div className="settings-item-icon">
                <i className="fas fa-bell"></i>
              </div>
              <span className="settings-item-text">Notification Settings</span>
            </div>
            <i className="fas fa-chevron-right"></i>
          </div>

          <div className="settings-item" onClick={() => handleSettingsClick('/settings/privacy')}>
            <div className="settings-item-left">
              <div className="settings-item-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <span className="settings-item-text">Privacy Settings</span>
            </div>
            <i className="fas fa-chevron-right"></i>
          </div>

          <div className="settings-item" onClick={() => handleSettingsClick('/about')}>
            <div className="settings-item-left">
              <div className="settings-item-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <span className="settings-item-text">About CIVIQ</span>
            </div>
            <i className="fas fa-chevron-right"></i>
          </div>
        </Card>

        {/* Logout Button */}
        <div className="logout-section">
          <Button
            variant="secondary"
            fullWidth
            className="btn-logout"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
            Log Out
          </Button>
        </div>
      </Screen>

      {/* Voter Card Modal */}
      <VoterCardModal isOpen={voterCardOpen} onClose={() => setVoterCardOpen(false)} user={user} />
    </>
  );
}
