import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    publicProfile: true,
    twoFactorAuth: false,
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      // API call to save settings
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="settings-container">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      {saved && <div className="success-message">Settings saved successfully!</div>}

      <div className="settings-sections">
        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-item">
            <div className="setting-label">
              <label>Enable Notifications</label>
              <p className="setting-description">Receive notifications about your courses and students</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => handleToggle('notifications')}
              className="toggle-checkbox"
            />
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <label>Email Alerts</label>
              <p className="setting-description">Receive email notifications for important updates</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailAlerts}
              onChange={() => handleToggle('emailAlerts')}
              className="toggle-checkbox"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Privacy</h2>
          <div className="setting-item">
            <div className="setting-label">
              <label>Public Profile</label>
              <p className="setting-description">Allow others to view your trainer profile</p>
            </div>
            <input
              type="checkbox"
              checked={settings.publicProfile}
              onChange={() => handleToggle('publicProfile')}
              className="toggle-checkbox"
            />
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <label>Two-Factor Authentication</label>
              <p className="setting-description">Add an extra layer of security to your account</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={() => handleToggle('twoFactorAuth')}
              className="toggle-checkbox"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Account</h2>
          <div className="setting-item">
            <button onClick={handleSave} className="btn btn-primary">
              Save Settings
            </button>
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
