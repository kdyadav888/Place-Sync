import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // API call to fetch profile
      setProfile(user);
      setFormData(user || {});
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      // API call to save profile
      setProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (!profile) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="trainer-profile">
      <div className="profile-header">
        <h1>Trainer Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary">
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="profile-edit-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              disabled
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              className="form-input"
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Expertise</label>
            <input
              type="text"
              name="expertise"
              value={formData.expertise || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., Web Development, Machine Learning"
            />
          </div>
          <div className="form-actions">
            <button onClick={handleSave} className="btn btn-primary">
              Save Changes
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-display">
          <div className="profile-card">
            <h2>{profile.name}</h2>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-bio">{profile.bio}</p>
            <p className="profile-expertise">{profile.expertise}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
