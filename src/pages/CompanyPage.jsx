import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import '../styles/Dashboard.css';

const CompanyPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    fetchCompanyData();
  }, [companyId]);

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleApply = async (jobId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Normalize job ID for comparison
      const normalizedJobId = jobId?.toString?.() || String(jobId);
      
      // Pre-check 1: Check local state
      const isInState = appliedJobs.some(id => (id?.toString?.() || String(id)) === normalizedJobId);
      if (isInState) {
        setToast({ message: 'Warning You have already applied for this job', type: 'info' });
        return;
      }

      // Pre-check 2: Check localStorage
      const localApplied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      const isInLocalStorage = localApplied.some(id => (id?.toString?.() || String(id)) === normalizedJobId);
      if (isInLocalStorage) {
        setAppliedJobs(localApplied);
        setToast({ message: 'Warning You have already applied for this job', type: 'info' });
        return;
      }

      // All checks passed
      setAppliedJobs((prev) => Array.from(new Set([...prev, jobId])));

      const applicationData = {
        jobId,
        resume: 'student_resume_placeholder.pdf',
        coverLetter: 'I am interested in this position and would like to apply.',
        experience: '2-5 years',
        skills: ['JavaScript', 'React', 'Node.js'],
      };

      const response = await applicationsAPI.create(
        applicationData,
        { Authorization: `Bearer ${token}` }
      );
      
      const data = await response.json().catch(() => null);
      
      if (response.ok && data?.success) {
        // Save to localStorage
        const appliedList = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        const normalizedAppliedList = appliedList.map(id => (id?.toString?.() || String(id)));
        if (!normalizedAppliedList.includes(normalizedJobId)) {
          appliedList.push(jobId);
          localStorage.setItem('appliedJobs', JSON.stringify(appliedList));
        }
        
        setToast({ 
          message: 'Job applied successfully! Good luck with your application!', 
          type: 'success' 
        });
      } else if (response.status === 409) {
        // Duplicate detected - cache it
        setAppliedJobs((prev) => {
          const updated = Array.from(new Set([...prev, jobId]));
          localStorage.setItem('appliedJobs', JSON.stringify(updated));
          return updated;
        });
        
        setToast({ 
          message: 'Warning You have already applied for this job', 
          type: 'info' 
        });
      } else {
        setAppliedJobs((prev) => prev.filter((id) => (id?.toString?.() || String(id)) !== normalizedJobId));
        
        if (response.status === 400) {
          setToast({ 
            message: `${data?.message || 'Invalid application data'}`, 
            type: 'error' 
          });
        } else {
          setToast({ 
            message: data?.message || `Failed to apply (status ${response?.status})`, 
            type: 'error' 
          });
        }
      }
    } catch (err) {
      console.error('Error applying:', err);
      setAppliedJobs((prev) => prev.filter((id) => (id?.toString?.() || String(id)) !== (jobId?.toString?.() || String(jobId))));
      setToast({ message: 'Network error. Try again later.', type: 'error' });
    }
  };

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAll(`company=${companyId}`);
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.jobs);
        if (data.jobs.length > 0) {
          setCompany({
            name: data.jobs[0].company,
            logo: 'https://via.placeholder.com/150',
            description: 'Leading company in tech industry',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading company...</div>;
  }

  if (!company) {
    return <div className="error">Company not found</div>;
  }

  return (
    <div className="company-page">
      <div className="company-header">
        <img src={company.logo} alt={company.name} className="company-logo" />
        <div className="company-info">
          <h1>{company.name}</h1>
          <p>{company.description}</p>
        </div>
      </div>

      <div className="company-jobs">
        <h2>Open Positions</h2>
        {jobs.length === 0 ? (
          <p>No open positions at the moment</p>
        ) : (
          <div className="jobs-list">
            {jobs.map((job) => {
              const jobIdStr = job._id?.toString?.() || String(job._id);
              const isApplied = appliedJobs.some(id => (id?.toString?.() || String(id)) === jobIdStr);
              return (
                <div key={job._id} className="job-card">
                  <h3>{job.title}</h3>
                  <p className="job-location">Location: {job.location}</p>
                  <p className="job-description">{job.description.substring(0, 150)}...</p>
                  <button 
                    className="btn-apply" 
                    onClick={() => handleApply(job._id)}
                    disabled={isApplied}
                  >
                    {isApplied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default CompanyPage;


