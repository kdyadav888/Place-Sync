import React from 'react';
import '../styles/JobManagementCard.css';

const JobManagementCard = ({ 
  job, 
  onEdit, 
  onDelete, 
  onViewApplicants,
  onToggleStatus 
}) => {
  const isActive = job.isActive !== false;

  return (
    <div className={`job-management-card ${isActive ? 'active' : 'inactive'}`}>
      {/* Status Badge */}
      <div className="job-status-badge">
        <span className={`status-indicator ${isActive ? 'active' : 'inactive'}`}>
          {isActive ? ' Active' : ' Inactive'}
        </span>
      </div>

      {/* Header */}
      <div className="job-management-header">
        <div className="job-management-title-section">
          <h3>{job.title}</h3>
          <p className="job-management-company">{job.company}</p>
        </div>
        <div className="job-management-meta">
          <span className={`job-type-small ${job.jobType?.toLowerCase().replace('-', '-')}`}>
            {job.jobType}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="job-management-info">
        <div className="info-item">
          <span className="info-icon">L</span>
          <span className="info-text">{job.location}</span>
        </div>
        <div className="info-item">
          <span className="info-icon"></span>
          <span className="info-text">
            {job.salary?.min?.toLocaleString()} - {job.salary?.max?.toLocaleString()}
          </span>
        </div>
        <div className="info-item">
          <span className="info-icon"></span>
          <span className="info-text">{job.applicantCount || 0} Applicants</span>
        </div>
        <div className="info-item">
          <span className="info-icon"></span>
          <span className="info-text">
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="job-management-description">
        {job.description?.substring(0, 100)}...
      </p>

      {/* Actions */}
      <div className="job-management-actions">
        <button 
          className="btn-action btn-view-applicants"
          onClick={() => onViewApplicants(job._id)}
          title="View applicants"
        >
           View Applicants
        </button>
        <button 
          className="btn-action btn-edit"
          onClick={() => onEdit(job._id)}
          title="Edit job"
        >
          Edit
        </button>
        <button 
          className={`btn-action btn-toggle-status ${isActive ? 'deactivate' : 'activate'}`}
          onClick={() => onToggleStatus(job._id)}
          title={isActive ? 'Deactivate' : 'Activate'}
        >
          {isActive ? ' Close' : ' Reopen'}
        </button>
        <button 
          className="btn-action btn-delete"
          onClick={() => onDelete(job._id)}
          title="Delete job"
        >
           Delete
        </button>
      </div>

      {/* Stats Footer */}
      <div className="job-management-stats">
        <div className="stat">
          <span className="stat-label">Posted:</span>
          <span className="stat-value">
            {new Date(job.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
        {job.deadline && (
          <div className="stat">
            <span className="stat-label">Deadline:</span>
            <span className="stat-value">
              {new Date(job.deadline).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobManagementCard;

