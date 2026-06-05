import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import Toast from '../components/Toast';
import '../styles/RecruiterDashboard.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { updateProfile } = useProfileUpdate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState(user?.resume || '');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    resume: user?.resume || '',
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        resume: user.resume || '',
      });
      setResumePreview(user.resume || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setToast({ message: 'Please upload a PDF or DOC/DOCX file', type: 'error' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setToast({ message: 'File size must be less than 5MB', type: 'error' });
        return;
      }

      setResumeFile(file);
      
      // Create a preview/name display
      const fileName = file.name;
      setResumePreview(fileName);
      setFormData({ ...formData, resume: fileName });
      
      setToast({ message: ` Resume selected: ${fileName}`, type: 'success' });
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumePreview('');
    setFormData({ ...formData, resume: '' });
    setToast({ message: 'Resume removed', type: 'success' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      await updateProfile(formData, {
        resumeFile,
        onSuccess: (updatedUser) => {
          setResumeFile(null);
          setToast({ message: ' Profile updated successfully!', type: 'success' });
          setShowSuccessModal(true);
          
          setTimeout(() => {
            setShowSuccessModal(false);
            navigate('/recruiter-dashboard');
          }, 2500);
        },
        onError: (error) => {
          setToast({ message: error, type: 'error' });
        },
      });
    } catch (error) {
      console.error('Profile update error:', error);
      setToast({ message: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <div className="recruiter-header">
        <h1>Edit Profile</h1>
        <p>Update your profile information</p>
      </div>

      {isLoading ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          fontSize: '16px',
          color: '#666'
        }}>
          Loading your profile information...
        </div>
      ) : !user ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          fontSize: '16px',
          color: '#d32f2f',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          border: '1px solid #ef5350'
        }}>
          Error: Unable to load profile. Please try refreshing the page.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            disabled
            style={{ background: '#f0f0f0', cursor: 'not-allowed' }}
          />
          <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
            Email cannot be changed
          </small>
        </div>

        <div className="form-group">
          <label>Institute Name</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g., TechCorp India"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., +91 9876543210"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Bangalore, India"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself, your experience, and what you're looking for..."
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label> Resume Upload</label>
          <div style={{
            border: '2px dashed #1976d2',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            <input
              type="file"
              id="resume-input"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              style={{ display: 'none' }}
            />
            <label 
              htmlFor="resume-input" 
              style={{ 
                cursor: 'pointer', 
                display: 'block',
                fontSize: '14px'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}></div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Click to upload or drag and drop
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                PDF, DOC or DOCX (Max 5MB)
              </div>
            </label>
          </div>
          
          {resumePreview && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#e8f5e9',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}></span>
                <span style={{ fontSize: '14px', color: '#2e7d32' }}>
                  {resumePreview}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveResume}
                style={{
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button"
            onClick={() => navigate('/recruiter-dashboard')}
            className="btn-secondary"
          >
             Cancel
          </button>
        </div>
      </form>
      )}
      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            maxWidth: '400px',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              color: '#4CAF50'
            }}>
              
            </div>
            <h2 style={{ margin: '0 0 12px 0', color: '#333' }}>
              Profile Updated Successfully!
            </h2>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              Your changes have been saved. Redirecting to dashboard...
            </p>
          </div>
          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default EditProfile;

