import React, { useState, useEffect } from 'react';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      // API call to fetch assignments
      setAssignments([
        { id: 1, title: 'React Component Task', course: 'React Basics', dueDate: '2026-05-20', submissions: 32, pending: 13 },
        { id: 2, title: 'Build a Todo App', course: 'React Basics', dueDate: '2026-05-25', submissions: 28, pending: 17 },
        { id: 3, title: 'API Integration', course: 'Web Development', dueDate: '2026-05-18', submissions: 25, pending: 7 },
      ]);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assignments-container">
      <div className="page-header">
        <h1>Assignments</h1>
        <button className="btn btn-primary"> Create Assignment</button>
      </div>

      {loading ? (
        <div className="loading">Loading assignments...</div>
      ) : (
        <div className="assignments-list">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-card">
              <div className="assignment-header">
                <h3>{assignment.title}</h3>
                <span className="course-badge">{assignment.course}</span>
              </div>
              <div className="assignment-info">
                <p> Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                <p>Submitted: {assignment.submissions}</p>
                <p>Pending: {assignment.pending}</p>
              </div>
              <div className="assignment-actions">
                <button className="btn btn-secondary btn-small">Review</button>
                <button className="btn btn-secondary btn-small">View Submissions</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assignments;

