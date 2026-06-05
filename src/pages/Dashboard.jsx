import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, jobsAPI, connectionsAPI, messagesAPI } from '../utils/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    applications: 0,
    savedJobs: 0,
    connections: 0,
    messages: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user) return;

        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [applicationsRes, savedJobsRes, connectionsRes, messagesRes] = await Promise.all([
          applicationsAPI.getAll(headers),
          jobsAPI.getSaved(headers),
          connectionsAPI.getAll(headers),
          messagesAPI.getConversations(headers),
        ]);

        const applicationsData = await applicationsRes.json();
        const savedJobsData = await savedJobsRes.json();
        const connectionsData = await connectionsRes.json();
        const messagesData = await messagesRes.json();

        setStats({
          applications: applicationsData.applications?.length || 0,
          savedJobs: savedJobsData.jobs?.length || 0,
          connections: connectionsData.connections?.length || 0,
          messages: messagesData.conversations?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user]);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <p>Role: {user.role}</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-icon">A</div>
          <div className="card-content">
            <h3>Applications</h3>
            <p className="card-stat">{stats.applications}</p>
          </div>
          <button
            onClick={() => navigate('/applications')}
            className="btn-view-applications"
          >
            View All
          </button>
        </div>

        <div className="card">
          <div className="card-icon"></div>
          <div className="card-content">
            <h3>Saved Jobs</h3>
            <p className="card-stat">{stats.savedJobs}</p>
          </div>
          <button
            onClick={() => navigate('/saved-jobs')}
            className="btn-view-jobs"
          >
            View All
          </button>
        </div>

        <div className="card">
          <div className="card-icon"></div>
          <div className="card-content">
            <h3>Connections</h3>
            <p className="card-stat">{stats.connections}</p>
          </div>
          <button
            onClick={() => navigate('/connections')}
            className="btn-nav"
          >
            View All
          </button>
        </div>

        <div className="card">
          <div className="card-icon">M</div>
          <div className="card-content">
            <h3>Messages</h3>
            <p className="card-stat">{stats.messages}</p>
          </div>
          <button
            onClick={() => navigate('/messages')}
            className="btn-nav"
          >
            View All
          </button>
        </div>
      </div>

      {user.role === 'recruiter' && (
        <div className="recruiter-section">
          <h2>Recruiter Actions</h2>
          <button onClick={() => navigate('/jobs')} className="btn-create">
            Create Job Posting
          </button>
        </div>
      )}

      {user.role === 'student' && (
        <div className="student-section">
          <h2>Student Actions</h2>
          <button onClick={() => navigate('/jobs')} className="btn-create">
            Browse Jobs
          </button>
        </div>
      )}

      {user.role === 'admin' && (
        <div className="admin-section">
          <h2>Admin Panel</h2>
          <button onClick={() => navigate('/admin')} className="btn-create">
            Go to Admin Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


