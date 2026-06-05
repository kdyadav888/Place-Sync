import React from 'react';

const WorkshopCard = ({ workshop, onView, onEdit, onDelete }) => {
  return (
    <div className="workshop-card">
      <div className="workshop-header">
        <h3>{workshop.title}</h3>
        <span className={`workshop-status ${workshop.status || 'upcoming'}`}>
          {workshop.status || 'Upcoming'}
        </span>
      </div>
      
      <p className="workshop-description">{workshop.description}</p>
      
      <div className="workshop-details">
        <div className="detail-item">
          <span className="detail-label">Date</span>
          <span className="detail-text">{workshop.date || 'TBD'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Capacity</span>
          <span className="detail-text">{workshop.capacity || 0}</span>
        </div>
      </div>

      <div className="workshop-footer">
        <small className="workshop-type">{workshop.type || 'General'}</small>
        <div className="workshop-actions">
          {onView && (
            <button className="btn-small btn-view" onClick={() => onView(workshop)}>
              View
            </button>
          )}
          {onEdit && (
            <button className="btn-small btn-edit" onClick={() => onEdit(workshop)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="btn-small btn-delete" onClick={() => onDelete(workshop.id)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
