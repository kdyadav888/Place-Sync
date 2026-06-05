import React, { useState, useEffect } from 'react';

const StudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      // API call to fetch student progress
      setStudents([
        { id: 1, name: 'Amit Kumar', course: 'React Basics', progress: 85, status: 'on-track', lastActive: '2026-05-15' },
        { id: 2, name: 'Priya Singh', course: 'React Basics', progress: 92, status: 'excellent', lastActive: '2026-05-15' },
        { id: 3, name: 'Rajesh Patel', course: 'Web Development', progress: 45, status: 'at-risk', lastActive: '2026-05-10' },
        { id: 4, name: 'Neha Verma', course: 'React Basics', progress: 78, status: 'on-track', lastActive: '2026-05-14' },
      ]);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-progress-container">
      <div className="page-header">
        <h1>Student Progress</h1>
      </div>

      {loading ? (
        <div className="loading">Loading student progress...</div>
      ) : (
        <div className="students-table">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${student.progress}%` }} />
                    </div>
                    <span className="progress-text">{student.progress}%</span>
                  </td>
                  <td>
                    <span className={`status-badge ${student.status}`}>{student.status}</span>
                  </td>
                  <td>{new Date(student.lastActive).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-small btn-secondary">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
