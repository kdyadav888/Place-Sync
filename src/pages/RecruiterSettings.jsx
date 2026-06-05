import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const RecruiterSettings = () => {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    applicationNotifications: true,
    messageNotifications: true,
    weeklyReports: true,
    visibility: 'public',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(' Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recruiter-settings-container">
      <h1> Settings</h1>

      {message && <div className="message">{message}</div>}

      <div className="settings-section">
        <h2>Notifications</h2>
        <div className="setting-item">
          <label>Email Notifications</label>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
          />
        </div>
        <div className="setting-item">
          <label>Application Notifications</label>
          <input
            type="checkbox"
            checked={settings.applicationNotifications}
            onChange={() => handleToggle('applicationNotifications')}
          />
        </div>
        <div className="setting-item">
          <label>Message Notifications</label>
          <input
            type="checkbox"
            checked={settings.messageNotifications}
            onChange={() => handleToggle('messageNotifications')}
          />
        </div>
        <div className="setting-item">
          <label>Weekly Reports</label>
          <input
            type="checkbox"
            checked={settings.weeklyReports}
            onChange={() => handleToggle('weeklyReports')}
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>Privacy</h2>
        <div className="setting-item">
          <label>Profile Visibility</label>
          <select name="visibility" value={settings.visibility} onChange={handleChange}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="connections">Connections Only</option>
          </select>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary" disabled={loading}>
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};

export default RecruiterSettings;

