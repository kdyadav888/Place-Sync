import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const RecruiterAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    jobsPosted: 0,
    totalViews: 0,
    totalApplications: 0,
    acceptanceRate: 0,
    topJob: null,
  });
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    // Show demo analytics data immediately
    setAnalytics({
      jobsPosted: 2,
      totalViews: 1250,
      totalApplications: 12,
      acceptanceRate: 75,
      topJob: {
        title: 'Senior Full Stack Developer',
        location: 'Bangalore, India',
        views: 850,
        applicantCount: 8,
      },
    });
    setLoading(false);
  }, []);

  return (
    <div className="recruiter-analytics-container">
      <h1> Analytics</h1>

      {loading ? (
        <div className="loading">Loading analytics...</div>
      ) : (
        <>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Jobs Posted</h3>
              <p className="number">{analytics.jobsPosted}</p>
            </div>
            <div className="analytics-card">
              <h3>Total Views</h3>
              <p className="number">{analytics.totalViews}</p>
            </div>
            <div className="analytics-card">
              <h3>Total Applications</h3>
              <p className="number">{analytics.totalApplications}</p>
            </div>
            <div className="analytics-card">
              <h3>Acceptance Rate</h3>
              <p className="number">{analytics.acceptanceRate}%</p>
            </div>
          </div>

          {analytics.topJob && (
            <div className="top-job-section">
              <h2>Top Performing Job</h2>
              <div className="top-job-card">
                <h3>{analytics.topJob.title}</h3>
                <p className="location">{analytics.topJob.location}</p>
                <p> {analytics.topJob.views || 0} views</p>
                <p>{analytics.topJob.applicantCount || 0} applications</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecruiterAnalytics;

