import React from 'react';

const CourseCard = ({ course, onView, onEdit, onDelete }) => {
  return (
    <div className="course-card">
      <div className="course-header">
        <h3>{course.title}</h3>
        <span className={`course-status ${course.status || 'active'}`}>
          {course.status || 'Active'}
        </span>
      </div>
      
      <p className="course-description">{course.description}</p>
      
      <div className="course-stats">
        <div className="stat">
          <span className="stat-label">Students</span>
          <span className="stat-value">{course.students || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Modules</span>
          <span className="stat-value">{course.modules || 0}</span>
        </div>
      </div>

      <div className="course-footer">
        <small className="course-date">{course.startDate || 'TBD'}</small>
        <div className="course-actions">
          {onView && (
            <button className="btn-small btn-view" onClick={() => onView(course)}>
              View
            </button>
          )}
          {onEdit && (
            <button className="btn-small btn-edit" onClick={() => onEdit(course)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="btn-small btn-delete" onClick={() => onDelete(course.id)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
