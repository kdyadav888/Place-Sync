import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import '../styles/RecruiterDashboard.css';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingJob, setTogglingJob] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'inactive'
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const demoJobs = [
    {
      _id: 'demo1',
      title: 'Senior Full Stack Developer - MERN Stack',
      company: 'TechVision India Pvt Ltd',
      location: 'Bangalore, Karnataka, India',
      jobType: 'Full-time',
      description: 'Join our innovative team as a Senior Full Stack Developer and work on cutting-edge technologies',
      salary: { min: 1200000, max: 1800000, currency: 'INR' },
      isActive: true,
      applicantCount: 12,
      createdAt: new Date(),
    },
    {
      _id: 'demo2',
      title: 'React Frontend Engineer',
      company: 'Infosys Limited',
      location: 'Hyderabad, Telangana, India',
      jobType: 'Full-time',
      description: 'Build stunning user interfaces with React and modern JavaScript frameworks',
      salary: { min: 800000, max: 1200000, currency: 'INR' },
      isActive: true,
      applicantCount: 8,
      createdAt: new Date(),
    },
    {
      _id: 'demo3',
      title: 'Node.js Backend Developer',
      company: 'TCS (Tata Consultancy Services)',
      location: 'Pune, Maharashtra, India',
      jobType: 'Full-time',
      description: 'Develop robust backend systems using Node.js and microservices architecture',
      salary: { min: 900000, max: 1400000, currency: 'INR' },
      isActive: true,
      applicantCount: 15,
      createdAt: new Date(),
    },
    {
      _id: 'demo4',
      title: 'Java Developer',
      company: 'HCL Technologies',
      location: 'Gurgaon, Haryana, India',
      jobType: 'Full-time',
      description: 'Work with Java, Spring Boot and contribute to enterprise applications',
      salary: { min: 700000, max: 1100000, currency: 'INR' },
      isActive: true,
      applicantCount: 20,
      createdAt: new Date(),
    },
  ];

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Get job status overrides from localStorage
      const jobStatusOverrides = JSON.parse(localStorage.getItem('jobStatusOverrides') || '{}');
      
      // Try to fetch from API first
      let apiJobs = [];
      if (user?._id) {
        try {
          // Ensure recruiterId is a string
          const recruiterId = typeof user._id === 'object' ? user._id.toString() : user._id;
          
          const response = await fetch(`/api/jobs?recruiter=${recruiterId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.jobs && data.jobs.length > 0) {
              // Apply status overrides to API jobs
              apiJobs = data.jobs.map(job => ({
                ...job,
                isActive: jobStatusOverrides[job._id] !== undefined ? jobStatusOverrides[job._id] : job.isActive
              }));
            }
          } else {
            console.error('API response not ok:', response.status);
          }
        } catch (apiError) {
          console.error('API fetch error:', apiError);
        }
      } else {
      }
      
      // Get pending local jobs (those that failed to sync)
      const localJobs = JSON.parse(localStorage.getItem('localJobs') || '[]');
      const pendingLocalJobs = localJobs.filter(job => job.syncStatus === 'pending').map(job => ({
        ...job,
        isActive: jobStatusOverrides[job._id] !== undefined ? jobStatusOverrides[job._id] : job.isActive
      }));
      
      // Remove synced jobs from localStorage (they exist in API now)
      if (apiJobs.length > 0) {
        const syncedJobIds = new Set(apiJobs.map(j => j._id));
        const remainingLocalJobs = localJobs.filter(job => 
          job.syncStatus === 'pending' || !syncedJobIds.has(job._id)
        );
        if (remainingLocalJobs.length !== localJobs.length) {
          localStorage.setItem('localJobs', JSON.stringify(remainingLocalJobs));
        }
      }
      
      // Combine: API jobs + pending local jobs (no duplicates)
      if (apiJobs.length > 0 || pendingLocalJobs.length > 0) {
        setJobs([...apiJobs, ...pendingLocalJobs]);
      } else {
        // Show demo jobs ONLY if no real jobs exist
        setJobs(demoJobs);
        setToast({ message: 'Showing demo jobs. Post your first real job to see it here!', type: 'info' });
      }
    } catch (error) {
      console.error('Error in fetchJobs:', error);
      const jobStatusOverrides = JSON.parse(localStorage.getItem('jobStatusOverrides') || '{}');
      const localJobs = JSON.parse(localStorage.getItem('localJobs') || '[]');
      
      const localJobsWithOverrides = localJobs.map(job => ({
        ...job,
        isActive: jobStatusOverrides[job._id] !== undefined ? jobStatusOverrides[job._id] : job.isActive
      }));
      
      if (localJobsWithOverrides.length > 0) {
        setJobs(localJobsWithOverrides);
      } else {
        setJobs(demoJobs);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (jobId.startsWith('demo')) {
      setToast({ message: 'Demo jobs cannot be deleted. Post your own job!', type: 'info' });
      return;
    }

    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      // Delete from localStorage if it's a local job
      if (jobId.startsWith('local-')) {
        const localJobs = JSON.parse(localStorage.getItem('localJobs') || '[]');
        const updated = localJobs.filter(j => j._id !== jobId);
        localStorage.setItem('localJobs', JSON.stringify(updated));
        
        // Update state immediately
        setJobs(jobs.filter(j => j._id !== jobId));
        setToast({ message: ' Job deleted successfully!', type: 'success' });
        return;
      }

      // Delete from API if it's an API job
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // Update state immediately
        setJobs(jobs.filter(j => j._id !== jobId));
        setToast({ message: ' Job deleted successfully!', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete job', type: 'error' });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setToast({ message: 'Request timeout. Please check your connection.', type: 'error' });
      } else {
        console.error('Error deleting job:', error);
        setToast({ message: 'Network error deleting job', type: 'error' });
      }
    }
  };

  const handleToggleActive = async (job) => {
    if (job._id.startsWith('demo')) {
      setToast({ message: 'Demo jobs cannot be modified', type: 'info' });
      return;
    }

    setTogglingJob(job._id);

    const newStatus = !job.isActive;
    
    // Update state immediately for UI responsiveness
    const updatedJob = { ...job, isActive: newStatus };
    const updatedJobs = jobs.map(j => j._id === job._id ? updatedJob : j);
    setJobs(updatedJobs);
    
    // Save status override to localStorage for ALL jobs (local and API)
    try {
      const jobStatusOverrides = JSON.parse(localStorage.getItem('jobStatusOverrides') || '{}');
      jobStatusOverrides[job._id] = newStatus;
      localStorage.setItem('jobStatusOverrides', JSON.stringify(jobStatusOverrides));
    } catch (error) {
      console.error('Error saving to jobStatusOverrides:', error);
    }
    
    // Also update localStorage for local jobs
    if (job._id.startsWith('local-')) {
      try {
        const localJobs = JSON.parse(localStorage.getItem('localJobs') || '[]');
        const updated = localJobs.map(j =>
          j._id === job._id ? { ...j, isActive: newStatus } : j
        );
        localStorage.setItem('localJobs', JSON.stringify(updated));
      } catch (error) {
        console.error('Error updating local jobs:', error);
      }
    }
    
    setToast({ 
      message: ` Job ${newStatus ? 'activated' : 'deactivated'}!`, 
      type: 'success' 
    });

    // Try to update via API for API jobs
    if (!job._id.startsWith('local-')) {
      try {
        console.log('Sending API update for job:', job._id);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`/api/jobs/${job._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: newStatus }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          console.log(' Job status updated in API successfully');
        } else {
          const errorData = await response.json();
          console.log('API returned status:', response.status);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log(' API request timeout, but status is saved locally');
        } else {
          console.log(' API error, but status is saved locally:', error.message);
        }
      }
    }
    
    setTogglingJob(null);
  };

  return (
    <div className="manage-jobs-container">
      <div className="manage-header">
        <div>
          <h1> Manage Jobs</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '5px' }}>
            {jobs.some(j => j._id.startsWith('demo')) ? ' Showing demo data' : 'Your posted jobs'}
          </p>
        </div>
        <button onClick={() => navigate('/post-job')} className="btn-create">
          + Post New Job
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="job-filter-tabs">
        <button 
          className={`filter-tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <span className="tab-label">📌 Active Jobs</span>
          <span className="tab-count">{jobs.filter(j => j.isActive).length}</span>
        </button>
        <button 
          className={`filter-tab ${activeTab === 'inactive' ? 'active' : ''}`}
          onClick={() => setActiveTab('inactive')}
        >
          <span className="tab-label">⏸️ Inactive/Deactivated</span>
          <span className="tab-count">{jobs.filter(j => !j.isActive).length}</span>
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="no-data">
          <p>No jobs posted yet</p>
          <button onClick={() => navigate('/post-job')} className="btn-primary">
            Post Your First Job
          </button>
        </div>
      ) : (
        <>
          {/* Active Jobs Section */}
          {activeTab === 'active' && (
            <div className="jobs-section">
              {jobs.filter(j => j.isActive).length === 0 ? (
                <div className="no-data">
                  <p>No active jobs. All your jobs are deactivated.</p>
                </div>
              ) : (
                <div className="jobs-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Salary (INR)</th>
                        <th>Applications</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.filter(j => j.isActive).map((job) => (
                        <tr key={job._id}>
                          <td className="job-title">{job.title}</td>
                          <td>{job.company}</td>
                          <td>{job.location}</td>
                          <td>{job.jobType}</td>
                          <td>
                            {job.salary?.min ? `${(job.salary.min / 100000).toFixed(1)}L - ${(job.salary.max / 100000).toFixed(1)}L` : 'N/A'}
                          </td>
                          <td className="app-count">
                            <strong>{job.applicantCount || 0}</strong>
                          </td>
                          <td>
                            <span className="status-badge active">
                              {job.isActive ? '✓ Active' : '⏸ Inactive'}
                            </span>
                          </td>
                          <td className="actions">
                            <button
                              onClick={() => handleToggleActive(job)}
                              className="btn-small"
                              disabled={job._id.startsWith('demo') || togglingJob === job._id}
                              style={{ opacity: (job._id.startsWith('demo') || togglingJob === job._id) ? 0.6 : 1 }}
                              title={job._id.startsWith('demo') ? 'Demo jobs cannot be modified' : ''}
                            >
                              {togglingJob === job._id ? '...' : 'Deactivate'}
                            </button>
                            <button
                              onClick={() => navigate(`/applicants?jobId=${job._id}`)}
                              className="btn-small view"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="btn-small danger"
                              disabled={job._id.startsWith('demo')}
                              style={{ opacity: job._id.startsWith('demo') ? 0.5 : 1 }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Inactive Jobs Section */}
          {activeTab === 'inactive' && (
            <div className="jobs-section">
              {jobs.filter(j => !j.isActive).length === 0 ? (
                <div className="no-data">
                  <p>No deactivated jobs. All your jobs are active.</p>
                </div>
              ) : (
                <div className="jobs-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Salary (INR)</th>
                        <th>Applications</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.filter(j => !j.isActive).map((job) => (
                        <tr key={job._id} className="inactive-row">
                          <td className="job-title">{job.title}</td>
                          <td>{job.company}</td>
                          <td>{job.location}</td>
                          <td>{job.jobType}</td>
                          <td>
                            {job.salary?.min ? `${(job.salary.min / 100000).toFixed(1)}L - ${(job.salary.max / 100000).toFixed(1)}L` : 'N/A'}
                          </td>
                          <td className="app-count">
                            <strong>{job.applicantCount || 0}</strong>
                          </td>
                          <td>
                            <span className="status-badge inactive">
                              ⏸ Inactive
                            </span>
                          </td>
                          <td className="actions">
                            <button
                              onClick={() => handleToggleActive(job)}
                              className="btn-small activate"
                              disabled={job._id.startsWith('demo') || togglingJob === job._id}
                              style={{ opacity: (job._id.startsWith('demo') || togglingJob === job._id) ? 0.6 : 1 }}
                              title={job._id.startsWith('demo') ? 'Demo jobs cannot be modified' : ''}
                            >
                              {togglingJob === job._id ? '...' : 'Reactivate'}
                            </button>
                            <button
                              onClick={() => navigate(`/applicants?jobId=${job._id}`)}
                              className="btn-small view"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="btn-small danger"
                              disabled={job._id.startsWith('demo')}
                              style={{ opacity: job._id.startsWith('demo') ? 0.5 : 1 }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default ManageJobs;

