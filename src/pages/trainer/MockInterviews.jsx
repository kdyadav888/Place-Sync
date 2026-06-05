import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewCard from '../../components/trainer/InterviewCard';
import '../../styles/Trainer.css';

const MockInterviews = () => {
  const navigate = useNavigate();
  const defaultInterviews = [
    {
      id: 1,
      studentName: 'Arjun Mehta',
      studentEmail: 'arjun@example.com',
      time: 'Feb 8, 2024 - 2:00 PM',
      role: 'Full Stack Developer',
      status: 'scheduled'
    },
    {
      id: 2,
      studentName: 'Priya Singh',
      studentEmail: 'priya@example.com',
      time: 'Feb 9, 2024 - 3:30 PM',
      role: 'Frontend Engineer',
      status: 'scheduled'
    },
    {
      id: 3,
      studentName: 'Raj Kumar',
      studentEmail: 'raj@example.com',
      time: 'Feb 7, 2024 - 10:00 AM',
      role: 'Backend Developer',
      status: 'completed'
    },
    {
      id: 4,
      studentName: 'Neha Patel',
      studentEmail: 'neha@example.com',
      time: 'Feb 6, 2024 - 4:00 PM',
      role: 'Full Stack Developer',
      status: 'completed'
    }
  ];

  // Initialize state from localStorage or use default
  const [interviews, setInterviews] = useState(() => {
    const saved = localStorage.getItem('interviews');
    return saved ? JSON.parse(saved) : defaultInterviews;
  });

  // Save to localStorage whenever interviews change
  useEffect(() => {
    localStorage.setItem('interviews', JSON.stringify(interviews));
  }, [interviews]);

  const handleCancel = (interviewId) => {
    setInterviews(interviews.filter(i => i.id !== interviewId));
  };

  return (
    <div className="trainer-interviews-container">
      <div className="page-header glass-effect">
        <div>
          <h1>Mock Interviews</h1>
          <p>Schedule and conduct mock interviews with students</p>
        </div>
        <button 
          className="btn-action primary"
          onClick={() => navigate('/trainer-schedule-interview')}
        >
          <span className="btn-icon"></span> Schedule Interview
        </button>
      </div>

      <div className="filter-section glass-effect">
        <label>Filter by Status:</label>
        <select className="filter-select">
          <option value="all">All Interviews</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="interviews-grid">
        {interviews.length > 0 ? (
          interviews.map(interview => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onView={(interview) => alert(`Interview with ${interview.studentName}\nEmail: ${interview.studentEmail}\nRole: ${interview.role}\nTime: ${interview.time}`)}
              onReschedule={(interview) => alert(`Reschedule interview with ${interview.studentName}\nThis feature will be available soon!`)}
              onCancel={handleCancel}
            />
          ))
        ) : (
          <div className="empty-state glass-effect">
            <p>No interviews scheduled. Schedule your first interview!</p>
            <button className="btn-action primary" onClick={() => navigate('/trainer-schedule-interview')}>
              <span className="btn-icon"></span> Schedule Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterviews;

