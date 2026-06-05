import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Trainer.css';

const TrainerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 4,
    activeCourses: 3,
    totalStudents: 45,
    activeStudents: 38,
    totalWorkshops: 6,
    upcomingWorkshops: 2,
    certificatesIssued: 12,
    pendingReviews: 5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalCourses: 4,
      activeCourses: 3,
      totalStudents: 45,
      activeStudents: 38,
      totalWorkshops: 6,
      upcomingWorkshops: 2,
      certificatesIssued: 12,
      pendingReviews: 5,
    });
    setLoading(false);
  }, []);

  if (!isAuthenticated) {
    return <div className="loading">Redirecting...</div>;
  }

  return (
    <div className="trainer-dashboard-container">
      <div className="trainer-header">
        <h1>Welcome, Trainer</h1>
        <p>Manage courses, workshops, and track student progress</p>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="trainer-stats-grid">
            <div className="stat-card">
              <div className="stat-icon"></div>
              <h3>Total Courses</h3>
              <p className="stat-number">{stats.totalCourses}</p>
              <button 
                onClick={() => navigate('/trainer-courses')}
                className="btn-view"
              >
                View Courses
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon"></div>
              <h3>Active Courses</h3>
              <p className="stat-number">{stats.activeCourses}</p>
              <button 
                onClick={() => navigate('/trainer-courses')}
                className="btn-view"
              >
                Manage
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon"></div>
              <h3>Total Students</h3>
              <p className="stat-number">{stats.totalStudents}</p>
              <button 
                onClick={() => navigate('/trainer-students')}
                className="btn-view"
              >
                View Students
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon"></div>
              <h3>Active Students</h3>
              <p className="stat-number">{stats.activeStudents}</p>
              <button 
                onClick={() => navigate('/trainer-students')}
                className="btn-view"
              >
                Progress
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon"></div>
              <h3>Total Workshops</h3>
              <p className="stat-number">{stats.totalWorkshops}</p>
              <button 
                onClick={() => navigate('/trainer-workshops')}
                className="btn-view"
              >
                View Workshops
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon"></div>
              <h3>Upcoming Workshops</h3>
              <p className="stat-number">{stats.upcomingWorkshops}</p>
              <button 
                onClick={() => navigate('/trainer-workshops')}
                className="btn-view"
              >
                Schedule
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon"></div>
              <h3>Certificates Issued</h3>
              <p className="stat-number">{stats.certificatesIssued}</p>
              <button 
                onClick={() => navigate('/trainer-certificates')}
                className="btn-view"
              >
                Manage
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon"></div>
              <h3>Pending Reviews</h3>
              <p className="stat-number">{stats.pendingReviews}</p>
              <button 
                onClick={() => navigate('/trainer-interviews')}
                className="btn-view"
              >
                Review
              </button>
            </div>
          </div>

          <div className="trainer-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="btn-action primary" onClick={() => navigate('/trainer-add-course')}>
                <span className="btn-icon">+</span> Add New Course
              </button>
              <button className="btn-action primary" onClick={() => navigate('/trainer-workshops')}>
                <span className="btn-icon"></span> Create Workshop
              </button>
              <button className="btn-action primary" onClick={() => navigate('/trainer-interviews')}>
                <span className="btn-icon"></span> Schedule Interview
              </button>
              <button className="btn-action primary" onClick={() => navigate('/trainer-profile')}>
                <span className="btn-icon"></span> My Profile
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrainerDashboard;

