import React, { useState, useEffect } from 'react';
import Toast from '../components/Toast';
import '../styles/RecruiterDashboard.css';

const Interviews = () => {
  const demoInterviews = [
    {
      id: 1,
      candidateName: 'Rajesh Kumar',
      position: 'Senior Full Stack Developer',
      date: '2026-05-15',
      time: '10:30',
      interviewer: 'John Smith',
      notes: 'Round 1: Technical Assessment',
      status: 'Scheduled',
    },
    {
      id: 2,
      candidateName: 'Priya Singh',
      position: 'Senior Full Stack Developer',
      date: '2026-05-16',
      time: '14:00',
      interviewer: 'Sarah Johnson',
      notes: 'Round 2: HR Round',
      status: 'Scheduled',
    },
    {
      id: 3,
      candidateName: 'Arjun Patel',
      position: 'Senior Full Stack Developer',
      date: '2026-05-10',
      time: '11:00',
      interviewer: 'Mike Davis',
      notes: 'Round 3: Final Round',
      status: 'Completed',
    },
  ];

  const [interviews, setInterviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    candidateName: '',
    position: '',
    date: '',
    time: '',
    interviewer: '',
    notes: '',
  });

  // Load interviews from localStorage on mount
  useEffect(() => {
    const localInterviews = JSON.parse(localStorage.getItem('localInterviews') || '[]');
    
    // Load both demo and local interviews
    const allInterviews = [...demoInterviews, ...localInterviews];
    setInterviews(allInterviews);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddInterview = (e) => {
    e.preventDefault();

    if (!formData.candidateName || !formData.position || !formData.date || !formData.time) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    const newInterview = {
      ...formData,
      id: Date.now(),
      status: 'Scheduled',
    };

    // Save to localStorage
    const localInterviews = JSON.parse(localStorage.getItem('localInterviews') || '[]');
    localInterviews.push(newInterview);
    localStorage.setItem('localInterviews', JSON.stringify(localInterviews));

    setInterviews([...interviews, newInterview]);
    setFormData({ candidateName: '', position: '', date: '', time: '', interviewer: '', notes: '' });
    setShowForm(false);
    setToast({ message: ` Interview scheduled with ${formData.candidateName}!`, type: 'success' });
  };

  const handleDeleteInterview = (id) => {
    const interview = interviews.find(i => i.id === id);
    const updated = interviews.filter(i => i.id !== id);
    setInterviews(updated);
    
    // Update localStorage
    const localInterviews = JSON.parse(localStorage.getItem('localInterviews') || '[]');
    const updatedLocal = localInterviews.filter(i => i.id !== id);
    localStorage.setItem('localInterviews', JSON.stringify(updatedLocal));
    
    setToast({ message: ` Interview with ${interview.candidateName} deleted!`, type: 'success' });
  };

  const handleCompleteInterview = (id) => {
    const updated = interviews.map(i =>
      i.id === id ? { ...i, status: 'Completed' } : i
    );
    setInterviews(updated);
    
    // Update localStorage
    const localInterviews = JSON.parse(localStorage.getItem('localInterviews') || '[]');
    const updatedLocal = localInterviews.map(i =>
      i.id === id ? { ...i, status: 'Completed' } : i
    );
    localStorage.setItem('localInterviews', JSON.stringify(updatedLocal));
    
    const interview = interviews.find(i => i.id === id);
    setToast({ message: ` Interview with ${interview.candidateName} marked as completed!`, type: 'success' });
  };

  const upcomingInterviews = interviews.filter(i => i.status === 'Scheduled');
  const completedInterviews = interviews.filter(i => i.status === 'Completed');

  return (
    <div className="interviews-container">
      <div className="interviews-header">
        <div>
          <h1> Interview Schedule</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '5px' }}>
            Manage and track candidate interviews
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn-create"
        >
          + Schedule Interview
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddInterview} className="interview-form">
          <div className="form-row">
            <div className="form-group">
              <label>Candidate Name *</label>
              <input
                type="text"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Interview Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Interview Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Interviewer Name</label>
            <input
              type="text"
              name="interviewer"
              value={formData.interviewer}
              onChange={handleChange}
              placeholder="e.g., Sarah Johnson"
            />
          </div>

          <div className="form-group">
            <label>Interview Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., Round 1: Technical Assessment"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
               Schedule Interview
            </button>
            <button 
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ candidateName: '', position: '', date: '', time: '', interviewer: '', notes: '' });
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {interviews.length === 0 ? (
        <div className="no-data">
          <p>No interviews scheduled yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Schedule Your First Interview
          </button>
        </div>
      ) : (
        <>
          {upcomingInterviews.length > 0 && (
            <>
              <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--text)' }}>
                 Upcoming Interviews ({upcomingInterviews.length})
              </h2>
              <div className="interviews-list">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="interview-item">
                    <div className="interview-info">
                      <h3>{interview.candidateName}</h3>
                      <p className="position"> {interview.position}</p>
                      <p className="datetime">
                         {new Date(interview.date).toLocaleDateString('en-IN')} at {interview.time}
                      </p>
                      {interview.interviewer && (
                        <p className="interviewer"> Interviewer: {interview.interviewer}</p>
                      )}
                      {interview.notes && (
                        <p className="notes"> {interview.notes}</p>
                      )}
                      <span className="status-badge" style={{ backgroundColor: '#3b82f6', marginTop: '10px' }}>
                        {interview.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                      <button
                        onClick={() => handleCompleteInterview(interview.id)}
                        className="btn-small"
                      >
                         Mark Complete
                      </button>
                      <button
                        onClick={() => handleDeleteInterview(interview.id)}
                        className="btn-small danger"
                      >
                         Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {completedInterviews.length > 0 && (
            <>
              <h2 style={{ marginTop: '40px', marginBottom: '20px', color: 'var(--text)' }}>
                 Completed Interviews ({completedInterviews.length})
              </h2>
              <div className="interviews-list">
                {completedInterviews.map((interview) => (
                  <div key={interview.id} className="interview-item" style={{ opacity: 0.8 }}>
                    <div className="interview-info">
                      <h3>{interview.candidateName}</h3>
                      <p className="position"> {interview.position}</p>
                      <p className="datetime">
                         {new Date(interview.date).toLocaleDateString('en-IN')} at {interview.time}
                      </p>
                      {interview.interviewer && (
                        <p className="interviewer"> Interviewer: {interview.interviewer}</p>
                      )}
                      {interview.notes && (
                        <p className="notes"> {interview.notes}</p>
                      )}
                      <span className="status-badge" style={{ backgroundColor: '#10b981', marginTop: '10px' }}>
                        {interview.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteInterview(interview.id)}
                      className="btn-small danger"
                    >
                       Delete
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Interviews;

