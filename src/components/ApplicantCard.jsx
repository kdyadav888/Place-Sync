import React, { useState } from 'react';
import '../styles/ApplicantCard.css';

const ApplicantCard = ({
  application,
  onStatusChange,
  getStatusColor,
  getStatusIcon,
  onViewProfile,
  onScheduleInterview,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  if (!application || !application.applicant) {
    return null;
  }

  const { applicant, job, status, appliedAt, coverLetter, skills, experience, resume } = application;

  const handleStatusChange = (newStatus) => {
    onStatusChange(application._id, newStatus);
  };

  return (
    <div className={`applicant-card-modern applicant-status-${status?.toLowerCase().replace(' ', '-')}`}>
      {/* Header Section */}
      <div className="applicant-card-header">
        <div style={{ flex: 1 }}>
          <h3 className="applicant-name" style={{ margin: '0 0 8px 0' }}>
            {applicant.name}
          </h3>
          {experience && (
            <p className="applicant-position" style={{ margin: '0 0 8px 0', color: 'var(--text-light)' }}>
              📊 {experience} experience
            </p>
          )}
          {applicant.location && (
            <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              📍 {applicant.location}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div className="applicant-status-badge">
            <span 
              className={`status-badge status-${status?.toLowerCase().replace(' ', '-')}`}
            >
              {status}
            </span>
          </div>
          {job && (
            <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'right' }}>
              Applied for: <strong>{job.title || job}</strong>
            </p>
          )}
          {appliedAt && (
            <p style={{ margin: '0', fontSize: '0.8rem', color: 'var(--text-light)' }}>
              📅 {new Date(appliedAt).toLocaleDateString('en-IN')}
            </p>
          )}
        </div>
      </div>

      {/* Contact & Skills Info Grid */}
      {(applicant.email || applicant.phone || skills?.length > 0) && (
        <div className="applicant-info-grid">
          {applicant.email && (
            <div className="info-card">
              <span className="info-label">✉️ Email</span>
              <a href={`mailto:${applicant.email}`} className="file-link">
                {applicant.email}
              </a>
            </div>
          )}
          {applicant.phone && (
            <div className="info-card">
              <span className="info-label">📱 Phone</span>
              <span className="info-value">{applicant.phone}</span>
            </div>
          )}
          {skills && skills.length > 0 && (
            <div className="info-card">
              <span className="info-label">🛠️ Skills</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {skills.slice(0, 4).map((skill, idx) => (
                  <span 
                    key={idx} 
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(26, 155, 138, 0.15)',
                      color: 'var(--primary-accent)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span 
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(26, 155, 138, 0.15)',
                      color: 'var(--primary-accent)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    +{skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cover Letter Section */}
      {showDetails && coverLetter && (
        <div className="applicant-cover-letter">
          <div className="cover-letter-header">
            <span className="cover-letter-label">📄 Cover Letter</span>
          </div>
          <p className="cover-letter-preview" style={{ maxHeight: 'none' }}>
            {coverLetter}
          </p>
        </div>
      )}

      {/* Resume Section */}
      {resume && (
        <div style={{ padding: '12px 14px', background: 'rgba(26, 155, 138, 0.02)', borderRadius: '8px' }}>
          <span className="info-label">📋 Resume</span>
          <div style={{ marginTop: '4px' }}>
            <a href={`/uploads/resumes/${resume}`} className="file-link" target="_blank" rel="noopener noreferrer">
              {resume}
            </a>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="applicant-actions-modern" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <select 
          value={status} 
          onChange={(e) => handleStatusChange(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1.5px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            fontWeight: '600',
            cursor: 'pointer',
            flex: 1,
            transition: 'all var(--transition-fast)',
          }}
          className="status-dropdown"
        >
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
        
        <button 
          onClick={() => setShowDetails(!showDetails)}
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1.5px solid var(--primary-accent)',
            background: showDetails ? 'var(--primary-accent)' : 'transparent',
            color: showDetails ? 'white' : 'var(--primary-accent)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => {
            if (!showDetails) {
              e.target.style.background = 'rgba(26, 155, 138, 0.1)';
            }
          }}
          onMouseOut={(e) => {
            if (!showDetails) {
              e.target.style.background = 'transparent';
            }
          }}
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>

        <button 
          onClick={() => onScheduleInterview(application)}
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1.5px solid var(--success)',
            background: 'transparent',
            color: 'var(--success)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(16, 185, 129, 0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          📅 Interview
        </button>
      </div>
    </div>
  );
};

export default ApplicantCard;



