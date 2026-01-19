import { useState } from 'react';
import { Header, Screen } from '../../components/layout';
import { Card } from '../../components/ui';

function ToggleSwitch({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: '48px',
        height: '28px',
        borderRadius: '14px',
        background: value ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '12px',
        background: 'white',
        position: 'absolute',
        top: '2px',
        left: value ? '22px' : '2px',
        transition: 'left 0.2s'
      }}></div>
    </button>
  );
}

function SettingItem({ icon, title, subtitle, toggle, value, onChange, onClick }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 0',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <i className={`fas ${icon}`} style={{ fontSize: '14px', color: 'var(--accent-purple)' }}></i>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 500 }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{subtitle}</div>
        )}
      </div>
      {toggle ? (
        <ToggleSwitch value={value} onChange={onChange} />
      ) : (
        <i className="fas fa-chevron-right" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}></i>
      )}
    </div>
  );
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    electionReminders: true,
    darkMode: true,
    biometricLogin: false,
    locationServices: true
  });

  const updateSetting = (key) => (value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Header title="Settings" showSearch={false} />
      <Screen>
        <div className="section-header">
          <span className="section-title">Notifications</span>
        </div>
        <Card>
          <SettingItem
            icon="fa-bell"
            title="Push Notifications"
            subtitle="Receive alerts on your device"
            toggle
            value={settings.notifications}
            onChange={updateSetting('notifications')}
          />
          <div style={{ borderTop: '1px solid var(--border)' }}></div>
          <SettingItem
            icon="fa-calendar-check"
            title="Election Reminders"
            subtitle="Get reminded about upcoming elections"
            toggle
            value={settings.electionReminders}
            onChange={updateSetting('electionReminders')}
          />
        </Card>

        <div className="section-header">
          <span className="section-title">Preferences</span>
        </div>
        <Card>
          <SettingItem
            icon="fa-moon"
            title="Dark Mode"
            subtitle="Use dark theme"
            toggle
            value={settings.darkMode}
            onChange={updateSetting('darkMode')}
          />
          <div style={{ borderTop: '1px solid var(--border)' }}></div>
          <SettingItem
            icon="fa-map-marker-alt"
            title="Location Services"
            subtitle="Enable location-based features"
            toggle
            value={settings.locationServices}
            onChange={updateSetting('locationServices')}
          />
        </Card>

        <div className="section-header">
          <span className="section-title">Security</span>
        </div>
        <Card>
          <SettingItem
            icon="fa-fingerprint"
            title="Biometric Login"
            subtitle="Use Face ID or fingerprint"
            toggle
            value={settings.biometricLogin}
            onChange={updateSetting('biometricLogin')}
          />
          <div style={{ borderTop: '1px solid var(--border)' }}></div>
          <SettingItem
            icon="fa-key"
            title="Change Password"
            onClick={() => console.log('Change password clicked')}
          />
        </Card>

        <div className="section-header">
          <span className="section-title">Account</span>
        </div>
        <Card>
          <SettingItem
            icon="fa-user-edit"
            title="Edit Profile"
            onClick={() => console.log('Edit profile clicked')}
          />
          <div style={{ borderTop: '1px solid var(--border)' }}></div>
          <SettingItem
            icon="fa-download"
            title="Download My Data"
            onClick={() => console.log('Download data clicked')}
          />
          <div style={{ borderTop: '1px solid var(--border)' }}></div>
          <SettingItem
            icon="fa-trash"
            title="Delete Account"
            onClick={() => console.log('Delete account clicked')}
          />
        </Card>

        <div className="section-header">
          <span className="section-title">About</span>
        </div>
        <Card>
          <SettingItem
            icon="fa-info-circle"
            title="About CIVIQ"
            subtitle="Version 1.0.0"
            onClick={() => console.log('About clicked')}
          />
          <div style={{ borderTop: '1px solid var(--border)' }}></div>
          <SettingItem
            icon="fa-file-contract"
            title="Privacy Policy"
            onClick={() => console.log('Privacy policy clicked')}
          />
          <div style={{ borderTop: '1px solid var(--border)' }}></div>
          <SettingItem
            icon="fa-question-circle"
            title="Help & Support"
            onClick={() => console.log('Help clicked')}
          />
        </Card>

        <button
          style={{
            width: '100%',
            padding: '14px',
            marginTop: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--accent-red)',
            background: 'transparent',
            color: 'var(--accent-red)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={() => console.log('Sign out clicked')}
        >
          Sign Out
        </button>
      </Screen>
    </>
  );
}
