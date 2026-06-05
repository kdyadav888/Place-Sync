import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../utils/api';
import Toast from '../components/Toast';
import '../styles/Jobs.css';

const ApplicationForms = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  
  const { token } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getAll({ Authorization: `Bearer ${token}` });

      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    
    try {
      const response = await applicationsAPI.withdraw(appId, { Authorization: `Bearer ${token}` });
      const data = await response.json().catch(() => null);

      if (response.ok) {
        setApplications(applications.map(app => 
          app._id === appId ? { ...app, status: 'Withdrawn' } : app
        ));
        setToast({ message: 'Application withdrawn successfully', type: 'success' });
      } else {
        const msg = data?.message || `Failed to withdraw (status ${response.status})`;
        setToast({ message: `${msg}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
      setToast({ message: 'Error withdrawing application. Please try again.', type: 'error' });
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': 'P',
      'Reviewed': 'R',
      'Accepted': 'A',
      'Rejected': 'X',
      'Withdrawn': 'W',
    };
    return icons[status] || 'A';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Pending: '#f59e0b',
      Reviewed: '#3b82f6',
      Accepted: '#10b981',
      Rejected: '#ef4444',
      Withdrawn: '#6b7280',
    };
    return statusColors[status] || '#6b7280';
  };

  const filteredApplications =
    filter === 'all'
      ? applications
      : applications.filter((app) => app.status === filter);

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <div className="saved-jobs-container">
      <div className="saved-header">
        <h1>My Applications</h1>
        <p>{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
          onClick={() => setFilter('Pending')}
        >
          Pending Pending
        </button>
        <button
          className={`filter-btn ${filter === 'Reviewed' ? 'active' : ''}`}
          onClick={() => setFilter('Reviewed')}
        >
          Reviewed
        </button>
        <button
          className={`filter-btn ${filter === 'Accepted' ? 'active' : ''}`}
          onClick={() => setFilter('Accepted')}
        >
           Accepted
        </button>
        <button
          className={`filter-btn ${filter === 'Rejected' ? 'active' : ''}`}
          onClick={() => setFilter('Rejected')}
        >
           Rejected
        </button>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="no-saved-jobs">
          <p> No applications found</p>
        </div>
      ) : (
        <div className="saved-jobs-list">
          {filteredApplications.map((app) => (
            <div key={app._id} className="job-card">
              <div className="job-header">
                <div>
                  <h3>{app.job?.title}</h3>
                  <p className="job-company">@ {app.job?.company}</p>
                </div>
                <div className="job-badges">
                  <span 
                    className="job-type"
                    style={{ backgroundColor: getStatusColor(app.status) }}
                  >
                    {getStatusIcon(app.status)} {app.status}
                  </span>
                </div>
              </div>

              <div className="job-details">
                <span> {app.job?.location}</span>
                <span> {app.job?.experience || 'Not specified'}</span>
                {app.job?.salary && (
                  <span> ₹{app.job.salary.min?.toLocaleString()} - ₹{app.job.salary.max?.toLocaleString()}</span>
                )}
              </div>

              <div className="job-details">
                <span> Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                {app.reviewedAt && (
                  <span>Reviewed: {new Date(app.reviewedAt).toLocaleDateString()}</span>
                )}
              </div>

              {app.feedback && (
                <div className="app-feedback">
                  <strong>Feedback:</strong> {app.feedback}
                </div>
              )}

              <p className="job-description">{app.job?.description?.substring(0, 150)}...</p>

              {app.job?.skills && app.job.skills.length > 0 && (
                <div className="job-skills">
                  {app.job.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              )}

              <div className="job-actions">
                {app.status === 'Pending' && (
                  <button 
                    className="btn-remove"
                    onClick={() => handleWithdrawApplication(app._id)}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default ApplicationForms;



