import React, { useState, useEffect } from 'react';

const MockInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      // API call to fetch mock interviews
      setInterviews([
        { id: 1, studentName: 'Amit Kumar', date: '2026-05-20', time: '10:00 AM', status: 'scheduled', rating: null },
        { id: 2, studentName: 'Priya Singh', date: '2026-05-15', time: '2:00 PM', status: 'completed', rating: 4.5 },
        { id: 3, studentName: 'Rajesh Patel', date: '2026-05-18', time: '11:00 AM', status: 'cancelled', rating: null },
      ]);
    } catch (error) {
      console.error('Error loading interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mock-interviews-container">
      <div className="page-header">
        <h1>Mock Interviews</h1>
        <button className="btn btn-primary"> Schedule Interview</button>
      </div>

      {loading ? (
        <div className="loading">Loading interviews...</div>
      ) : (
        <div className="interviews-list">
          {interviews.map((interview) => (
            <div key={interview.id} className="interview-card">
              <div className="interview-header">
                <h3>{interview.studentName}</h3>
                <span className={`status-badge ${interview.status}`}>{interview.status}</span>
              </div>
              <div className="interview-info">
                <p> {new Date(interview.date).toLocaleDateString()}</p>
                <p> {interview.time}</p>
                {interview.rating && <p> Rating: {interview.rating}/5</p>}
              </div>
              <div className="interview-actions">
                <button className="btn btn-secondary btn-small">View Details</button>
                <button className="btn btn-secondary btn-small">Reschedule</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockInterviews;

