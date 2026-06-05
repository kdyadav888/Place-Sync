import React from 'react';

const InterviewCard = ({ interview, onView, onReschedule, onCancel }) => {
  return (
    <div className="interview-card">
      <div className="interview-header">
        <h3>{interview.studentName}</h3>
        <span className={`interview-status ${interview.status || 'scheduled'}`}>
          {interview.status || 'Scheduled'}
        </span>
      </div>
      
      <div className="interview-info">
        <div className="info-row">
          <span className="info-label">Email:</span>
          <span className="info-value">{interview.studentEmail || 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Time:</span>
          <span className="info-value">{interview.time || 'TBD'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Role:</span>
          <span className="info-value">{interview.role || 'General'}</span>
        </div>
      </div>

      <div className="interview-footer">
        <div className="interview-actions">
          {onView && (
            <button className="btn-small btn-view" onClick={() => onView(interview)}>
              View
            </button>
          )}
          {onReschedule && (
            <button className="btn-small btn-edit" onClick={() => onReschedule(interview)}>
              Reschedule
            </button>
          )}
          {onCancel && (
            <button className="btn-small btn-delete" onClick={() => onCancel(interview.id)}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
