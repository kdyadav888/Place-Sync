import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    completedAssignments: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // API call to fetch stats
      setStats({
        totalCourses: 5,
        activeCourses: 3,
        totalStudents: 125,
        completedAssignments: 87,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="trainer-dashboard">
      <div className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <p>Welcome back! Here's an overview of your teaching activities.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Total Courses</h3>
            <p className="stat-number">{stats.totalCourses}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Active Courses</h3>
            <p className="stat-number">{stats.activeCourses}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Total Students</h3>
            <p className="stat-number">{stats.totalStudents}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">S</div>
          <div className="stat-content">
            <h3>Assignments Completed</h3>
            <p className="stat-number">{stats.completedAssignments}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => navigate('/trainer/add-course')} className="btn btn-primary">
             Add New Course
          </button>
          <button onClick={() => navigate('/trainer/my-courses')} className="btn btn-secondary">
             My Courses
          </button>
          <button onClick={() => navigate('/trainer/workshops')} className="btn btn-secondary">
             Workshops
          </button>
          <button onClick={() => navigate('/trainer/mock-interviews')} className="btn btn-secondary">
             Mock Interviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;

