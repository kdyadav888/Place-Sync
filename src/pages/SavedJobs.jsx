import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, jobsAPI } from '../utils/api';
import Toast from '../components/Toast';
import '../styles/Jobs.css';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applicationsByJobId, setApplicationsByJobId] = useState({}); // Map jobId -> applicationId
  const [toast, setToast] = useState(null);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedJobs();
    fetchAppliedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getSaved({ Authorization: `Bearer ${token}` });
      const data = await response.json();
      if (data.success) setJobs(data.jobs);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const response = await applicationsAPI.getAll({ Authorization: `Bearer ${token}` });
      const data = await response.json();
      if (data.success) {
        const applied = data.applications.map(a => a.job?._id);
        const mapping = {};
        data.applications.forEach(a => {
          const jobId = a.job?._id || a.job;
          if (jobId) mapping[jobId] = a._id;
        });
        setAppliedJobs(applied);
        setApplicationsByJobId(mapping);
        // Also save to localStorage as backup
        localStorage.setItem('appliedJobs', JSON.stringify(applied));
      }
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      setAppliedJobs(saved);
    }
  };

  const handleRemoveSavedJob = async (jobId) => {
    try {
      // optimistic UI
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      const response = await jobsAPI.unsave(jobId, { Authorization: `Bearer ${token}` });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        // rollback on failure: refetch saved jobs
        await fetchSavedJobs();
        const msg = data?.message || `Failed to remove saved job (status ${response.status})`;
        alert(msg);
        return;
      }
      alert('Job removed from saved!');
    } catch (error) {
      console.error('Error removing saved job:', error);
    }
  };

  const handleApplyJob = async (jobId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const normalizedJobId = jobId?.toString?.() || String(jobId);
      let isApplied = appliedJobs.some(id => (id?.toString?.() || String(id)) === normalizedJobId);
      
      // If not applied, verify state with backend before making apply request
      if (!isApplied) {
        const response = await applicationsAPI.getAll({ Authorization: `Bearer ${token}` });
        const data = await response.json();
        if (data.success && data.applications) {
          const backendAppliedJobs = data.applications.map(a => a.job?._id || a.job).filter(Boolean);
          const wasAlreadyApplied = backendAppliedJobs.some(id => (id?.toString?.() || String(id)) === normalizedJobId);
          
          if (wasAlreadyApplied) {
            // Update state and show info
            setAppliedJobs(backendAppliedJobs);
            const mapping = {};
            data.applications.forEach(a => {
              const jobIdVal = a.job?._id || a.job;
              if (jobIdVal) mapping[jobIdVal] = a._id;
            });
            setApplicationsByJobId(mapping);
            
            setToast({ 
              message: ' You already applied for this job. Click to withdraw.', 
              type: 'success' 
            });
            return;
          }
          // State is now synced, proceed with apply
          isApplied = wasAlreadyApplied;
        }
      }
      
      if (isApplied) {
        // Withdraw application
        let applicationId = applicationsByJobId[jobId];
        if (!applicationId) {
          // Try to refetch to get the application ID
          await fetchAppliedJobs();
          applicationId = applicationsByJobId[jobId];
          if (!applicationId) {
            setToast({ message: ' Could not find application to withdraw', type: 'error' });
            return;
          }
        }

        // Optimistic UI update
        setAppliedJobs((prev) => 
          prev.filter((id) => (id?.toString?.() || String(id)) !== normalizedJobId)
        );

        const response = await applicationsAPI.withdraw(applicationId, { 
          Authorization: `Bearer ${token}` 
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          // Rollback on error
          setAppliedJobs((prev) => [...prev, jobId]);
          const msg = data?.message || `Failed to withdraw application (status ${response.status})`;
          setToast({ message: msg, type: 'error' });
          return;
        }

        // Update localStorage
        const appliedList = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        const filtered = appliedList.filter(id => (id?.toString?.() || String(id)) !== normalizedJobId);
        localStorage.setItem('appliedJobs', JSON.stringify(filtered));

        setToast({ message: ' Application withdrawn successfully', type: 'success' });
      } else {
        // Apply for job
        const applicationData = {
          jobId,
          resume: 'student_resume_placeholder.pdf',
          coverLetter: 'I am interested in this position and would like to apply.',
          experience: '2-5 years',
          skills: ['JavaScript', 'React', 'Node.js'],
        };

        try {
          // Temporarily suppress console.error for expected 409 conflicts
          const originalError = console.error;
          console.error = (...args) => {
            const msg = args?.[0]?.toString?.() || '';
            if (!msg.includes('409') && !msg.includes('Conflict')) {
              originalError(...args);
            }
          };

          let response;
          try {
            response = await applicationsAPI.create(
              applicationData,
              { Authorization: `Bearer ${token}` }
            );
          } finally {
            // Restore console.error
            console.error = originalError;
          }

          let data;
          try { data = await response.json(); } catch (e) { data = null; }

          if (response.ok && data?.success) {
            // Save to localStorage and mapping - only if not already there
            const appliedList = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
            if (!appliedList.some(id => (id?.toString?.() || String(id)) === normalizedJobId)) {
              appliedList.push(jobId);
              localStorage.setItem('appliedJobs', JSON.stringify(appliedList));
            }

            // Store application ID if available
            if (data.application?._id) {
              setApplicationsByJobId((prev) => ({
                ...prev,
                [jobId]: data.application._id,
              }));
            }

            // Optimistic UI update after successful apply
            setAppliedJobs((prev) => {
              if (prev.some(id => (id?.toString?.() || String(id)) === normalizedJobId)) {
                return prev;
              }
              return [...prev, jobId];
            });

            setToast({ 
              message: ' Job applied successfully! Good luck with your application!', 
              type: 'success' 
            });
          } else if (response.status === 409) {
            // Already applied - sync with backend to get application ID
            await fetchAppliedJobs();
            
            // Mark as applied in UI after sync
            setAppliedJobs((prev) => {
              if (prev.some(id => (id?.toString?.() || String(id)) === normalizedJobId)) {
                return prev;
              }
              return [...prev, jobId];
            });

            setToast({ 
              message: ' You already applied for this job. Click to withdraw.', 
              type: 'success' 
            });
          } else {
            const msg = data?.message || `Failed to apply (status ${response.status})`;
            setToast({ message: ` ${msg}`, type: 'error' });
          }
        } catch (apiError) {
          // Network error during apply - don't log 409s as they're expected
          if (apiError.message?.includes('409')) {
            // Silently sync and mark as applied
            await fetchAppliedJobs();
            setAppliedJobs((prev) => {
              if (prev.some(id => (id?.toString?.() || String(id)) === normalizedJobId)) {
                return prev;
              }
              return [...prev, jobId];
            });
            setToast({ 
              message: ' You already applied for this job. Click to withdraw.', 
              type: 'success' 
            });
          } else {
            setToast({ message: ' Error processing your request. Please try again.', type: 'error' });
          }
        }
      }
    } catch (error) {
      setToast({ message: ' Error processing your request. Please try again.', type: 'error' });
    }
  };

  if (loading) {
    return <div className="loading">Loading saved jobs...</div>;
  }

  return (
    <div className="saved-jobs-container">
      <div className="saved-header">
        <h1> Saved Jobs</h1>
        <p>{jobs.length} job{jobs.length !== 1 ? 's' : ''} saved</p>
      </div>

      {jobs.length === 0 ? (
        <div className="no-saved-jobs">
          <p> No saved jobs yet. Start saving jobs to view them here!</p>
        </div>
      ) : (
        <div className="saved-jobs-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <div>
                  <h3>{job.title}</h3>
                  <p className="job-company">@ {job.company}</p>
                </div>
                <div className="job-badges">
                  <span className="job-type">{job.jobType}</span>
                </div>
              </div>

              <div className="job-details">
                <span> {job.location}</span>
                <span> {job.experience || 'Not specified'}</span>
                {job.salary && (
                  <span> ₹{job.salary.min?.toLocaleString()} - ₹{job.salary.max?.toLocaleString()}</span>
                )}
              </div>

              <p className="job-description">{job.description.substring(0, 150)}...</p>

              {job.skills && job.skills.length > 0 && (
                <div className="job-skills">
                  {job.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              )}

              <div className="job-actions">
                {(() => {
                  const jobIdStr = job._id?.toString?.() || String(job._id);
                  const isApplied = appliedJobs.some(id => (id?.toString?.() || String(id)) === jobIdStr);
                  return (
                    <button
                      className="btn-apply"
                      onClick={() => handleApplyJob(job._id)}
                    >
                      {isApplied ? ' Applied' : ' Apply Now'}
                    </button>
                  );
                })()}
                <button 
                  className="btn-remove"
                  onClick={() => handleRemoveSavedJob(job._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default SavedJobs;



