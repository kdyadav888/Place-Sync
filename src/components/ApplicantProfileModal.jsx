import React from 'react';
import '../styles/JobDetailModal.css';

const JobDetailModal = ({ job, onClose, onApply, isApplied, onSave, isSaved }) => {
  if (!job) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="job-detail-overlay" onClick={handleOverlayClick}>
      <div className="job-detail-modal">
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>Close</button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h1>{job.title}</h1>
            <span className={`job-type-badge-large ${job.jobType?.toLowerCase().replace('-', '-')}`}>
              {job.jobType}
            </span>
          </div>
          <p className="modal-company">{job.company}</p>
        </div>

        {/* Quick Info Section */}
        <div className="modal-quick-info">
          <div className="info-card">
            <span className="info-label">Location</span>
            <span className="info-value">{job.location}</span>
          </div>
          <div className="info-card">
            <span className="info-label"> Salary</span>
            <span className="info-value">
              ₹{job.salary?.min?.toLocaleString()} - ₹{job.salary?.max?.toLocaleString()}
            </span>
          </div>
          <div className="info-card">
            <span className="info-label"> Experience</span>
            <span className="info-value">{job.experience}</span>
          </div>
          <div className="info-card">
            <span className="info-label"> Deadline</span>
            <span className="info-value">
              {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="modal-content">
          {/* Description */}
          {job.description && (
            <section className="content-section">
              <h3> Job Description</h3>
              <p>{job.description}</p>
            </section>
          )}

          {/* Requirements */}
          {job.requirements && (
            <section className="content-section">
              <h3> Requirements</h3>
              <ul className="requirements-list">
                {(Array.isArray(job.requirements) 
                  ? job.requirements 
                  : job.requirements.split(',')).map((req, idx) => (
                  <li key={idx}>{req.trim()}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <section className="content-section">
              <h3> Required Skills</h3>
              <div className="skills-grid">
                {(Array.isArray(job.skills) 
                  ? job.skills 
                  : job.skills.split(',')).map((skill, idx) => (
                  <span key={idx} className="skill-tag-large">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Benefits */}
          {job.benefits && (
            <section className="content-section">
              <h3> Benefits</h3>
              <ul className="benefits-list">
                {(Array.isArray(job.benefits) 
                  ? job.benefits 
                  : job.benefits.split(',')).map((benefit, idx) => (
                  <li key={idx}>{benefit.trim()}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button
            className={`btn-apply-large ${isApplied ? 'applied' : ''}`}
            onClick={() => {
              onApply(job._id);
              onClose();
            }}
            disabled={isApplied}
          >
            {isApplied ? 'Already Applied' : 'Apply Now'}
          </button>
          <button
            className={`btn-save-large ${isSaved ? 'saved' : ''}`}
            onClick={() => onSave(job._id)}
          >
            {isSaved ? 'Heart Saved' : ' Save Job'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;



