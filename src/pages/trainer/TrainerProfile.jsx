import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Trainer.css';

const TrainerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dr. Sample Trainer',
    email: 'trainer@example.com',
    specialization: 'Web Development',
    experience: '10 years',
    bio: 'Expert trainer with passion for teaching',
    contact: '+91-9876543210',
    rating: 4.8,
    reviewsCount: 127,
  });

  const handleSave = () => {
    // Save profile
    setIsEditing(false);
  };

  return (
    <div className="trainer-profile-container">
      <div className="profile-header">
        <button className="btn-back" onClick={() => navigate('/trainer-dashboard')}>
           Back to Dashboard
        </button>
      </div>

      <div className="profile-section glass-effect">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={profile.name} />
            ) : (
              <span className="avatar-placeholder">{profile.name.charAt(0)}</span>
            )}
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p className="specialization">{profile.specialization}</p>
            <div className="rating">
              <span className="stars"> {profile.rating}</span>
              <span className="reviews">({profile.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="btn-edit"
            onClick={() => setIsEditing(!isEditing)}
          >
            <span className="btn-icon">{isEditing ? '' : ''}</span> {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="profile-form glass-effect">
          <h2>Edit Profile</h2>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Specialization</label>
            <input 
              type="text" 
              value={profile.specialization}
              onChange={(e) => setProfile({...profile, specialization: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              className="form-input"
              rows="4"
            />
          </div>
          <button className="btn-save" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      ) : (
        <div className="profile-details glass-effect">
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{profile.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Experience:</span>
            <span className="detail-value">{profile.experience}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Contact:</span>
            <span className="detail-value">{profile.contact}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Bio:</span>
            <span className="detail-value">{profile.bio}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;

