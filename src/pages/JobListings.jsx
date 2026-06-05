import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../utils/api';
import Toast from '../components/Toast';
import '../styles/Jobs.css';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experience: '',
  });
  const [page, setPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applicationsByJobId, setApplicationsByJobId] = useState({}); // Map jobId -> applicationId
  const [showDetails, setShowDetails] = useState(null);
  const [toast, setToast] = useState(null);
  
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    if (token) {
      fetchSavedJobs();
      fetchAppliedJobs();
    }
  }, [filters, page, token]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      });

      const response = await jobsAPI.getAll(params);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await jobsAPI.getSaved({ Authorization: `Bearer ${token}` });
      const data = await response.json();
      if (data.success) setSavedJobs(data.jobs.map((j) => j._id));
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const response = await applicationsAPI.getAll({ Authorization: `Bearer ${token}` });
      const data = await response.json();
      if (data.success && data.applications) {
        const applied = data.applications.map(a => a.job?._id || a.job).filter(Boolean);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  const handleSaveJob = async (jobId) => {
    try {
      const normalizedJobId = jobId?.toString?.() || String(jobId);
      
      // Check if already saved
      const isSaved = savedJobs.some(id => (id?.toString?.() || String(id)) === normalizedJobId);
      
      if (isSaved) {
        // Unsave the job
        setSavedJobs((s) => s.filter((id) => (id?.toString?.() || String(id)) !== normalizedJobId));
        
        const response = await jobsAPI.unsave(jobId, { Authorization: `Bearer ${token}` });
        const data = await response.json().catch(() => null);
        
        if (!response.ok) {
          // rollback on error
          setSavedJobs((s) => [...s, jobId]);
          const msg = data?.message || `Failed to unsave job (status ${response.status})`;
          setToast({ message: msg, type: 'error' });
          return;
        }
        setToast({ message: ' Job removed from saved', type: 'success' });
      } else {
        // Save the job
        setSavedJobs((s) => [...s, jobId]);
        
        const response = await jobsAPI.saveJob(jobId, { Authorization: `Bearer ${token}` });
        const data = await response.json().catch(() => null);
        
        if (!response.ok) {
          // rollback on error
          setSavedJobs((s) => s.filter((id) => (id?.toString?.() || String(id)) !== normalizedJobId));
          const msg = data?.message || `Failed to save job (status ${response.status})`;
          setToast({ message: msg, type: 'error' });
          return;
        }
        setToast({ message: ' Job saved successfully!', type: 'success' });
      }
    } catch (error) {
      console.error('Error toggling save job:', error);
      setToast({ message: ' Error toggling job save status', type: 'error' });
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
          let response;
          try {
            response = await applicationsAPI.create(
              applicationData,
              { Authorization: `Bearer ${token}` }
            );
          } catch (createError) {
            // Handle 409 Conflict (already applied) gracefully
            if (createError?.status === 409 || createError?.message?.includes('409')) {
              response = { status: 409, ok: false };
            } else {
              throw createError;
            }
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

  if (loading && jobs.length === 0) {
    return <div className="loading">Loading jobs...</div>;
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Available Jobs</h1>
        <p>Find your dream job here</p>
      </div>

      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search by title or company"
          value={filters.search}
          onChange={handleFilterChange}
          className="filter-input"
        />

        <select
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Locations</option>
          <option value="Remote">Remote</option>
          <option value="Gurugram">Gurugram</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
        </select>

        <select
          name="jobType"
          value={filters.jobType}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>

        <select
          name="experience"
          value={filters.experience}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Levels</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Mid Level">Mid Level</option>
          <option value="Senior">Senior</option>
          <option value="Executive">Executive</option>
        </select>
      </div>

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <p className="no-jobs">No jobs found. Try adjusting your filters.</p>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <div>
                  <h3>{job.title}</h3>
                  <p className="job-company">@ {job.company}</p>
                </div>
                <div className="job-badges">
                  <span className="job-type">{job.jobType}</span>
                  {job.isActive && <span className="job-status active"> Active</span>}
                </div>
              </div>

              <div className="job-details">
                <span>Location: {job.location}</span>
                <span> {job.experience || 'Not specified'}</span>
                {job.salary && (
                  <span> ₹{job.salary.min?.toLocaleString()} - ₹{job.salary.max?.toLocaleString()}</span>
                )}
              </div>

              <p className="job-description">{job.description.substring(0, 200)}...</p>

              {showDetails === job._id && (
                <div className="job-full-details">
                  <h4>Job Description</h4>
                  <p>{job.description}</p>
                  
                  {job.skills && job.skills.length > 0 && (
                    <>
                      <h4>Required Skills</h4>
                      <div className="skills-list">
                        {job.skills.map((skill, i) => (
                          <span key={i} className="skill-tag-large">{skill}</span>
                        ))}
                      </div>
                    </>
                  )}
                  
                  <h4>Posted By</h4>
                  <p className="recruiter-info">
                    {job.recruiter?.name}  {job.recruiter?.company}
                  </p>
                </div>
              )}

              <div className="job-actions">
                {(() => {
                  const jobIdStr = job._id?.toString?.() || String(job._id);
                  const isApplied = appliedJobs.some(id => (id?.toString?.() || String(id)) === jobIdStr);
                  const isSaved = savedJobs.some(id => (id?.toString?.() || String(id)) === jobIdStr);
                  return (
                    <>
                      <button
                        className="btn-apply"
                        onClick={() => handleApplyJob(job._id)}
                        title={isApplied ? 'Click to withdraw application' : 'Click to apply for this job'}
                      >
                        {isApplied ? 'Applied' : 'Apply Now'}
                      </button>
                      <button 
                        className={`btn-save-job ${isSaved ? 'saved' : ''}`}
                        onClick={() => handleSaveJob(job._id)}
                        title={isSaved ? 'Click to remove from saved' : 'Click to save this job'}
                      >
                        {isSaved ? ' Saved' : ' Save'}
                      </button>
                    </>
                  );
                })()}
                <button
                  className="btn-view-details"
                  onClick={() => setShowDetails(showDetails === job._id ? null : job._id)}
                >
                  {showDetails === job._id ? ' Hide' : ' View'} Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="btn-pagination"
        >
           Previous
        </button>
        <span className="page-info">Page {page}</span>
        <button 
          onClick={() => setPage(page + 1)}
          disabled={jobs.length < 10}
          className="btn-pagination"
        >
          Next 
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default JobListings;




