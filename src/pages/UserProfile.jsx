import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  
  const { user, token, updateUser } = useAuth();
  const { updateProfile } = useProfileUpdate();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [userId, token, user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');

      // Check if viewing own profile
      const isOwnProfile = user && (userId === user?.id || userId === user?._id || userId === user?.name);
      
      if (isOwnProfile && user) {
        // Use current user data from context
        setProfile(user);
        setFormData(user);
        setResumePreview(user.resume || '');
        if (user.avatar && user.avatar !== '') {
          setAvatarPreview(user.avatar);
        } else {
          setAvatarPreview('');
        }
      } else if (token) {
        // Fetch other user's profile with authorization
        const response = await fetch(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          setProfile(data.user);
          setFormData(data.user);
          setResumePreview(data.user.resume || '');
          if (data.user.avatar && data.user.avatar !== '') {
            setAvatarPreview(data.user.avatar);
          } else {
            setAvatarPreview('');
          }
        } else {
          setError(data.message || 'Profile not found');
        }
      } else {
        setError('Please log in to view this profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleArrayChange = (fieldName, index, property, value) => {
    const newArray = [...(formData[fieldName] || [])];
    if (!newArray[index]) {
      newArray[index] = {};
    }
    newArray[index][property] = value;
    setFormData({
      ...formData,
      [fieldName]: newArray,
    });
  };

  const handleAddArrayItem = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: [...(formData[fieldName] || []), {}],
    });
  };

  const handleRemoveArrayItem = (fieldName, index) => {
    const newArray = formData[fieldName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [fieldName]: newArray,
    });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF or DOC/DOCX file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setResumeFile(file);
      setResumePreview(file.name);
      setError('');
      setSaveSuccess(' Resume selected: ' + file.name);
      setTimeout(() => setSaveSuccess(''), 2000);
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumePreview('');
    setFormData({ ...formData, resume: '' });
    setSaveSuccess('Resume removed');
    setTimeout(() => setSaveSuccess(''), 2000);
  };

  const saveAvatarToDb = async (file) => {
    try {
      setSaving(true);
      const formDataToSend = new FormData();
      formDataToSend.append('avatar', file);

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setProfile(data.user);
        setFormData(data.user);
        setAvatarFile(null);
        // Set avatar preview from the database response
        if (data.user.avatar && data.user.avatar !== '') {
          setAvatarPreview(data.user.avatar);
        } else {
          setAvatarPreview('');
        }
        
        // If this is the current user's profile, update the context
        const isOwnProfile = user?.id === userId || user?._id === userId;
        if (isOwnProfile) {
          updateUser(data.user);
        }
        
        setSaveSuccess(' Profile photo updated successfully');
        setTimeout(() => setSaveSuccess(''), 2000);
      } else {
        setError(data.message || 'Failed to update avatar');
      }
    } catch (error) {
      console.error('Error saving avatar:', error);
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
      setShowAvatarOptions(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
        // Save avatar to database after preview is created
        saveAvatarToDb(file);
      };
      reader.readAsDataURL(file);
      setError('');
      setSaveSuccess(' Uploading profile photo...');
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/users/${userId}/avatar`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Set avatar to empty string to show placeholder
        setProfile({ ...profile, avatar: '' });
        setFormData({ ...formData, avatar: '' });
        setAvatarFile(null);
        setAvatarPreview('');
        
        // If this is the current user's profile, update the context
        const isOwnProfile = user?.id === userId || user?._id === userId;
        if (isOwnProfile) {
          updateUser({ ...user, avatar: '' });
        }
        
        setSaveSuccess(' Profile photo removed');
        setTimeout(() => setSaveSuccess(''), 2000);
      } else {
        setError(data.message || 'Failed to remove avatar');
      }
    } catch (error) {
      console.error('Error removing avatar:', error);
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaveSuccess('');
    
    try {
      // Prepare form data for API call
      const dataToSend = {
        name: formData.name || '',
        company: formData.company || '',
        phone: formData.phone || '',
        location: formData.location || '',
        bio: formData.bio || '',
        skills: formData.skills && Array.isArray(formData.skills) ? formData.skills : [],
        experience: formData.experience && Array.isArray(formData.experience) ? formData.experience : [],
        education: formData.education && Array.isArray(formData.education) ? formData.education : [],
      };

      await updateProfile(dataToSend, {
        userId,
        resumeFile,
        avatarFile,
        isFormData: !!resumeFile || !!avatarFile,
        onSuccess: (updatedUser) => {
          setProfile(updatedUser);
          setFormData(updatedUser);
          setResumePreview(updatedUser.resume || '');
          
          // Set avatar preview
          if (updatedUser.avatar && updatedUser.avatar !== '') {
            setAvatarPreview(updatedUser.avatar);
          } else {
            setAvatarPreview('');
          }
          
          // If this is the current user's profile, update the context
          const isOwnProfile = user?.id === userId || user?._id === userId;
          if (isOwnProfile) {
            updateUser(updatedUser);
          }
          
          setResumeFile(null);
          setAvatarFile(null);
          setIsEditing(false);
          setSaveSuccess(' Profile updated successfully!');
          setTimeout(() => setSaveSuccess(''), 3000);
        },
        onError: (error) => {
          setError(` ${error}`);
        },
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(' Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!profile || error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          borderRadius: '12px',
          backgroundColor: 'var(--card-bg)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '12px' }}>Profile Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            {error || 'The profile you are looking for does not exist or you do not have permission to view it.'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0a66c2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user && (userId === user?.id || userId === user?._id || userId === user?.name);
  const handleSendConnection = async () => {
    if (!token) return navigate('/login');
    try {
      const response = await fetch('/api/connections/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetId: userId }),
      });
      if (response.ok) {
        alert('Connection request sent!');
      } else {
        const d = await response.json();
        alert(d.message || 'Failed to send request');
      }
    } catch (err) {
      console.error('Error sending connection request:', err);
      alert('Network error. Try again later.');
    }
  };

  return (
    <div className="profile-container">
      {saveSuccess && (
        <div style={{
          padding: '12px 16px',
          margin: '16px 0',
          borderRadius: '6px',
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          border: '1px solid #4caf50',
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000
        }}>
          {saveSuccess}
        </div>
      )}
      
      {error && (
        <div style={{
          padding: '12px 16px',
          margin: '16px 0',
          borderRadius: '6px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          border: '1px solid #ef5350',
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
      
      <div className="profile-header">
        <div className="avatar-section">
          <div className="avatar-wrapper">
            {(avatarPreview || profile.avatar) && (profile.avatar || avatarPreview) ? (
              <img 
                src={avatarPreview || profile.avatar} 
                alt={profile.name} 
                className="profile-avatar" 
                onClick={() => isOwnProfile && setShowAvatarOptions(!showAvatarOptions)}
                style={isOwnProfile ? { cursor: 'pointer' } : {}}
              />
            ) : (
              <div 
                className="profile-avatar profile-avatar-placeholder"
                onClick={() => isOwnProfile && setShowAvatarOptions(!showAvatarOptions)}
                style={isOwnProfile ? { cursor: 'pointer' } : {}}
              >
                <span className="avatar-placeholder-text">{profile.name?.charAt(0)?.toUpperCase() || ''}</span>
              </div>
            )}
            
            {isOwnProfile && (
              <div className="avatar-hover-overlay" onClick={() => setShowAvatarOptions(!showAvatarOptions)}>
                <div className="avatar-edit-hint">
                  <span style={{ fontSize: '24px', marginBottom: '4px' }}></span>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>Click to Edit</span>
                </div>
              </div>
            )}
            
            {saving && (
              <div className="avatar-loading-overlay">
                <div className="spinner"></div>
              </div>
            )}
          </div>
          
          {isOwnProfile && showAvatarOptions && (
            <div className="avatar-options-container">
              <div className="avatar-options-buttons">
                <label className="avatar-menu-item avatar-upload-label">
                  <span> Upload Photo</span>
                  <input
                    type="file"
                    id="avatar-input"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                
                <button
                  className="avatar-menu-item avatar-remove-btn"
                  onClick={handleRemoveAvatar}
                  disabled={saving}
                >
                  <span> Remove Photo</span>
                </button>
                
                <button
                  className="avatar-menu-item avatar-close-btn"
                  onClick={() => setShowAvatarOptions(false)}
                >
                  <span> Cancel</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-info">
          <h1>{profile.name}</h1>
          <p className="profile-role">{profile.role === 'recruiter' ? 'Recruiter' : 'Student'}</p>
          {profile.company && <p className="profile-company">@ {profile.company}</p>}
          {profile.location && <p className="profile-location"> {profile.location}</p>}
          {profile.email && <p className="profile-email"> {profile.email}</p>}
          {profile.phone && <p className="profile-phone"> {profile.phone}</p>}
        </div>

        {isOwnProfile && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-edit-profile"
          >
            {isEditing ? ' Cancel' : ' Edit Profile'}
          </button>
        )}
        {!isOwnProfile && (
          <button onClick={handleSendConnection} className="btn-connect">
             Connect
          </button>
        )}
      </div>

      {isEditing && isOwnProfile ? (
        <div className="edit-form-container">
          <h3>Edit Profile</h3>

          <div className="edit-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Institute</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your institute name"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="form-input"
                placeholder="City, State, Country"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                className="form-input"
                placeholder="Tell us about yourself"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Skills (comma-separated or enter individually)</label>
              <div className="skills-input-container">
                <div className="skills-chips">
                  {(formData.skills || []).map((skill, idx) => (
                    <div key={idx} className="skill-chip">
                      <span>{skill}</span>
                      <button
                        type="button"
                        className="skill-chip-remove"
                        onClick={() => {
                          const newSkills = formData.skills.filter((_, i) => i !== idx);
                          setFormData({
                            ...formData,
                            skills: newSkills
                          });
                        }}
                        title="Remove skill"
                      >
                        
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add skill (press Enter or comma)"
                  className="form-input skills-input"
                  onKeyDown={(e) => {
                    const value = e.target.value.trim();
                    if ((e.key === 'Enter' || e.key === ',') && value) {
                      e.preventDefault();
                      // Handle both comma and Enter key
                      const skillsToAdd = value.split(',').map(s => s.trim()).filter(s => s);
                      const existingSkills = formData.skills || [];
                      const updatedSkills = [...new Set([...existingSkills, ...skillsToAdd])]; // Remove duplicates
                      setFormData({
                        ...formData,
                        skills: updatedSkills
                      });
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label> Resume Upload</label>
              <div className="resume-upload-zone">
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
                <label htmlFor="resume-input" className="resume-upload-label">
                  <span className="resume-upload-icon"></span>
                  <div className="resume-upload-text">Click to upload or drag and drop</div>
                  <div className="resume-upload-hint">PDF, DOC or DOCX (Max 5MB)</div>
                </label>
              </div>
              
              {resumePreview && (
                <div className="resume-preview">
                  <div className="resume-preview-info">
                    <span className="resume-preview-check"></span>
                    <span className="resume-preview-name">{resumePreview}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="btn-remove-resume"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {profile.role === 'student' && (
              <>
                {/* Experience Section */}
                <div className="form-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0, color: 'var(--text)', fontSize: '1.1rem', fontWeight: '700' }}>Work Experience</h4>
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('experience')}
                      className="btn-add-item"
                    >
                      + Add Experience
                    </button>
                  </div>
                  {(formData.experience || []).map((exp, i) => (
                    <div key={i} className="experience-item">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Job Title</label>
                          <input
                            type="text"
                            value={exp.title || ''}
                            onChange={(e) => handleArrayChange('experience', i, 'title', e.target.value)}
                            className="form-input"
                            placeholder="e.g., Software Engineer"
                          />
                        </div>
                        <div className="form-group">
                          <label>Company</label>
                          <input
                            type="text"
                            value={exp.company || ''}
                            onChange={(e) => handleArrayChange('experience', i, 'company', e.target.value)}
                            className="form-input"
                            placeholder="e.g., Tech Corp"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Duration</label>
                          <input
                            type="text"
                            value={exp.duration || ''}
                            onChange={(e) => handleArrayChange('experience', i, 'duration', e.target.value)}
                            className="form-input"
                            placeholder="e.g., Jan 2020 - Dec 2021"
                          />
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <input
                            type="text"
                            value={exp.description || ''}
                            onChange={(e) => handleArrayChange('experience', i, 'description', e.target.value)}
                            className="form-input"
                            placeholder="Brief description"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem('experience', i)}
                        className="btn-remove-item"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Education Section */}
                <div className="form-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0, color: 'var(--text)', fontSize: '1.1rem', fontWeight: '700' }}>Education</h4>
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('education')}
                      className="btn-add-item"
                    >
                      + Add Education
                    </button>
                  </div>
                  {(formData.education || []).map((edu, i) => (
                    <div key={i} className="education-item">
                      <div className="form-row">
                        <div className="form-group">
                          <label>School/University</label>
                          <input
                            type="text"
                            value={edu.school || ''}
                            onChange={(e) => handleArrayChange('education', i, 'school', e.target.value)}
                            className="form-input"
                            placeholder="e.g., MIT"
                          />
                        </div>
                        <div className="form-group">
                          <label>Degree</label>
                          <input
                            type="text"
                            value={edu.degree || ''}
                            onChange={(e) => handleArrayChange('education', i, 'degree', e.target.value)}
                            className="form-input"
                            placeholder="e.g., Bachelor's"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Field of Study</label>
                          <input
                            type="text"
                            value={edu.field || ''}
                            onChange={(e) => handleArrayChange('education', i, 'field', e.target.value)}
                            className="form-input"
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                        <div className="form-group">
                          <label>Year</label>
                          <input
                            type="text"
                            value={edu.year || ''}
                            onChange={(e) => handleArrayChange('education', i, 'year', e.target.value)}
                            className="form-input"
                            placeholder="e.g., 2020"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem('education', i)}
                        className="btn-remove-item"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="form-actions">
              <button onClick={handleSave} className="btn-save" disabled={saving}>
                {saving ? 'Pending Saving...' : ' Save Changes'}
              </button>
              <button onClick={() => setIsEditing(false)} className="btn-cancel" disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          {profile.role === 'student' && (
            <>
              <button
                className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                onClick={() => setActiveTab('experience')}
              >
                Experience
              </button>
              <button
                className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                onClick={() => setActiveTab('education')}
              >
                Education
              </button>
            </>
          )}
        </div>
      )}

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            {profile.bio && (
              <div className="profile-section">
                <h3>About</h3>
                <p>{profile.bio}</p>
              </div>
            )}

            {profile.resume && (
              <div className="profile-section">
                <h3> Resume</h3>
                <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-view-resume" style={{
                  display: 'inline-block',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}>
                   View Resume
                </a>
              </div>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <div className="profile-section">
                <h3>Skills</h3>
                <div className="skills-list">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="profile-section">
              <h3>Contact Information</h3>
              <div className="contact-info">
                {profile.email && <p> {profile.email}</p>}
                {profile.phone && <p> {profile.phone}</p>}
                {profile.location && <p> {profile.location}</p>}
              </div>
            </div>

            <div className="profile-section">
              <h3>Member Since</h3>
              <p>{new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        )}

        {activeTab === 'experience' && profile.role === 'student' && (
          <div className="experience-section">
            <h3>Work Experience</h3>
            {profile.experience && profile.experience.length > 0 ? (
              <div className="experience-list">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="experience-item">
                    <h4>{exp.title}</h4>
                    <p className="company">{exp.company}</p>
                    <p className="duration"> {exp.duration}</p>
                    {exp.description && <p className="description">{exp.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p>No experience added yet</p>
            )}
          </div>
        )}

        {activeTab === 'education' && profile.role === 'student' && (
          <div className="education-section">
            <h3>Education</h3>
            {profile.education && profile.education.length > 0 ? (
              <div className="education-list">
                {profile.education.map((edu, i) => (
                  <div key={i} className="education-item">
                    <h4>{edu.degree} in {edu.field}</h4>
                    <p className="school">{edu.school}</p>
                    {edu.year && <p className="year"> {edu.year}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p>No education added yet</p>
            )}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default UserProfile;




