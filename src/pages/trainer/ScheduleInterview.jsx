import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Trainer.css';

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    time: '',
    role: 'Full Stack Developer',
    status: 'scheduled'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.studentEmail || !formData.time || !formData.role) {
      alert('Please fill all required fields!');
      return;
    }

    // Get existing interviews from localStorage
    const storedInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
    
    // Create new interview with unique ID
    const newInterview = {
      id: Date.now(),
      studentName: formData.studentName,
      studentEmail: formData.studentEmail,
      time: formData.time,
      role: formData.role,
      status: formData.status
    };

    // Add to existing interviews
    storedInterviews.push(newInterview);
    
    // Save to localStorage
    localStorage.setItem('interviews', JSON.stringify(storedInterviews));
    
    alert('Interview scheduled successfully!');
    navigate('/trainer-interviews');
  };

  return (
    <div className="trainer-schedule-interview-container">
      <div className="page-header glass-effect">
        <button className="btn-back" onClick={() => navigate('/trainer-interviews')}>
           Back to Interviews
        </button>
        <h1>Schedule New Interview</h1>
      </div>

      <form onSubmit={handleSubmit} className="course-form glass-effect">
        <div className="form-row">
          <div className="form-group">
            <label>Student Name *</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Student Email *</label>
            <input
              type="email"
              name="studentEmail"
              value={formData.studentEmail}
              onChange={handleChange}
              placeholder="e.g., john@example.com"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Interview Time *</label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="e.g., Feb 15, 2024 - 2:00 PM"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Role / Position *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/trainer-interviews')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-action primary">
            Schedule Interview
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleInterview;

