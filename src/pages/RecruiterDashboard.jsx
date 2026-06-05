import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/RecruiterDashboard.css';

const RecruiterDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 2,
    activeJobs: 2,
    totalApplications: 12,
    pendingApplications: 5,
    totalInterviews: 3,
    upcomingInterviews: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (user?.role !== 'recruiter') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Show demo data immediately without API calls
    setStats({
      totalJobs: 2,
      activeJobs: 2,
      totalApplications: 12,
      pendingApplications: 5,
      totalInterviews: 3,
      upcomingInterviews: 1,
    });
    setLoading(false);
  }, []);

  if (!user || user.role !== 'recruiter') {
    return <div className="loading">Redirecting...</div>;
  }

  return (
    <div className="recruiter-dashboard-container">
      <div className="recruiter-header">
        <h1>Welcome, {user.name}! </h1>
        <p>Recruiter Dashboard - Overview & Quick Actions</p>
      </div>

      {loading ? (
        <div className="loading">Loading stats...</div>
      ) : (
        <>
          <div className="recruiter-stats-grid">
            <div className="stat-card">
              <div className="stat-icon"></div>
              <h3>Total Jobs Posted</h3>
              <p className="stat-number">{stats.totalJobs}</p>
              <button 
                onClick={() => navigate('/manage-jobs')}
                className="btn-view"
              >
                View All Jobs
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon">Success</div>
              <h3>Active Jobs</h3>
              <p className="stat-number">{stats.activeJobs}</p>
              <button 
                onClick={() => navigate('/manage-jobs')}
                className="btn-view"
              >
                Manage Jobs
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon">A</div>
              <h3>Total Applications</h3>
              <p className="stat-number">{stats.totalApplications}</p>
              <button 
                onClick={() => navigate('/applicants')}
                className="btn-view"
              >
                Review Apps
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon">Pending</div>
              <h3>Pending Reviews</h3>
              <p className="stat-number">{stats.pendingApplications}</p>
              <button 
                onClick={() => navigate('/applicants')}
                className="btn-view"
              >
                Action Required
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon"></div>
              <h3>Total Interviews</h3>
              <p className="stat-number">{stats.totalInterviews}</p>
              <button 
                onClick={() => navigate('/interviews')}
                className="btn-view"
              >
                View Schedule
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-icon"></div>
              <h3>Upcoming Interviews</h3>
              <p className="stat-number">{stats.upcomingInterviews}</p>
              <button 
                onClick={() => navigate('/interviews')}
                className="btn-view"
              >
                Schedule More
              </button>
            </div>
          </div>

          <div className="recruiter-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button 
                onClick={() => navigate('/post-job')}
                className="btn-action primary"
              >
                 Post New Job
              </button>
              <button 
                onClick={() => navigate('/manage-jobs')}
                className="btn-action secondary"
              >
                 Manage Jobs
              </button>
              <button 
                onClick={() => navigate('/applicants')}
                className="btn-action secondary"
              >
                 Review Applicants
              </button>
              <button 
                onClick={() => navigate('/search-students')}
                className="btn-action secondary"
              >
                Find Candidates
              </button>
              <button 
                onClick={() => navigate('/interviews')}
                className="btn-action secondary"
              >
                 Schedule Interviews
              </button>
              <button 
                onClick={() => navigate('/recruiter-analytics')}
                className="btn-action secondary"
              >
                 View Analytics
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecruiterDashboard;

