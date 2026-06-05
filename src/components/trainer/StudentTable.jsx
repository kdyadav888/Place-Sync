import React from 'react';

const StudentTable = ({ students, onViewProfile, onSendMessage, onRemove, onProfileClick }) => {
  return (
    <div className="student-table-container">
      {students && students.length > 0 ? (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="student-row">
                <td className="cell-name">
                  <div className="student-info">
                    <div className="student-avatar" onClick={() => onProfileClick && onProfileClick(student)} style={{ cursor: 'pointer' }}>
                      {student.avatar ? (
                        <img src={student.avatar} alt={student.name} />
                      ) : (
                        <span>{student.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="student-name">{student.name}</span>
                  </div>
                </td>
                <td className="cell-email">{student.email}</td>
                <td className="cell-date">{student.joinedDate || 'N/A'}</td>
                <td className="cell-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${student.progress || 0}%` }}></div>
                  </div>
                  <span className="progress-text">{student.progress || 0}%</span>
                  <div className="progress-details">
                    <small>Attendance: {student.attendance || 0}%</small>
                    <small>Videos: {student.videosCompleted || 0}/{student.totalVideos || 0}</small>
                  </div>
                </td>
                <td className="cell-status">
                  <span className={`status-badge ${student.status || 'active'}`}>
                    {student.status || 'Active'}
                  </span>
                </td>
                <td className="cell-actions">
                  <div className="action-buttons">
                    {onViewProfile && (
                      <button className="btn-action btn-view" onClick={() => onViewProfile(student)} title="View Profile">
                        View
                      </button>
                    )}
                    {onSendMessage && (
                      <button className="btn-action btn-message" onClick={() => onSendMessage(student)} title="Send Message">
                        Message
                      </button>
                    )}
                    {onRemove && (
                      <button className="btn-action btn-delete" onClick={() => onRemove(student.id)} title="Remove">
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>No students yet</p>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
