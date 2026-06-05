import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import ApplicantCard from '../components/ApplicantCard';
import '../styles/RecruiterDashboard.css';
import '../styles/ApplicantCard.css';

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [searchParams] = useSearchParams();
  const { token, user } = useAuth();
  const jobId = searchParams.get('jobId') || 'demo1';
  const [jobInfo, setJobInfo] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [togglingJob, setTogglingJob] = useState(false);

  const demoApplications = [
    {
      _id: 'app1',
      applicant: {
        _id: 'user1',
        name: 'Arjun Mehta',
        email: 'arjun.mehta@student.com',
        phone: '+91-9988776655',
        location: 'Delhi, NCR',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Pending',
      coverLetter: 'I am a passionate Full Stack Developer with strong expertise in React, Node.js, and MongoDB. I have successfully delivered multiple MERN projects and am excited about this opportunity at TechVision India.',
      appliedAt: new Date('2026-05-15'),
      resume: 'arjun_mehta_resume.pdf',
      experience: '4 years',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js', 'REST APIs'],
    },
    {
      _id: 'app2',
      applicant: {
        _id: 'user2',
        name: 'Sneha Iyer',
        email: 'sneha.iyer@student.com',
        phone: '+91-8877665544',
        location: 'Bangalore, Karnataka',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Reviewed',
      coverLetter: 'As a Full Stack Developer with 4+ years of experience in Python and JavaScript ecosystems, I am confident in delivering high-quality solutions. I have worked with React and modern web technologies extensively.',
      appliedAt: new Date('2026-05-14'),
      resume: 'sneha_iyer_resume.pdf',
      experience: '4 years',
      skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker'],
    },
    {
      _id: 'app3',
      applicant: {
        _id: 'user3',
        name: 'Rahul Chopra',
        email: 'rahul.chopra@student.com',
        phone: '+91-7766554433',
        location: 'Gurugram, Haryana',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Accepted',
      coverLetter: 'I bring 3+ years of experience in full-stack development with a focus on scalable architecture. My expertise in cloud technologies and DevOps practices makes me a strong candidate for this role.',
      appliedAt: new Date('2026-05-13'),
      resume: 'rahul_chopra_resume.pdf',
      experience: '3+ years',
      skills: ['Python', 'ML', 'React', 'Data Science', 'TensorFlow', 'AWS'],
    },
    {
      _id: 'app4',
      applicant: {
        _id: 'user4',
        name: 'Pooja Saxena',
        email: 'pooja.saxena@student.com',
        phone: '+91-6655443322',
        location: 'Mumbai, Maharashtra',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Rejected',
      coverLetter: 'Thank you for considering my application. While my background is primarily in data analysis and business intelligence, I am eager to transition into full-stack development.',
      appliedAt: new Date('2026-05-12'),
      resume: 'pooja_saxena_resume.pdf',
      experience: '2 years',
      skills: ['Excel', 'SQL', 'Data Analysis', 'Business Intelligence'],
    },
    {
      _id: 'app5',
      applicant: {
        _id: 'user5',
        name: 'Nikhil Joshi',
        email: 'nikhil.joshi@student.com',
        phone: '+91-5544332211',
        location: 'Pune, Maharashtra',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Reviewed',
      coverLetter: 'As a cloud-native developer with expertise in AWS and containerization, I am well-equipped to handle scalable full-stack applications. I have successfully deployed multiple microservices on Kubernetes.',
      appliedAt: new Date('2026-05-11'),
      resume: 'nikhil_joshi_resume.pdf',
      experience: '3+ years',
      skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Linux', 'CI/CD'],
    },
    {
      _id: 'app6',
      applicant: {
        _id: 'user6',
        name: 'Kavya Nair',
        email: 'kavya.nair@student.com',
        phone: '+91-4433221100',
        location: 'Hyderabad, Telangana',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Pending',
      coverLetter: 'I am a full-stack developer with 3+ years of experience in Java and React. I am transitioning my skills to MERN stack and am eager to learn and contribute to your team.',
      appliedAt: new Date('2026-05-16'),
      resume: 'kavya_nair_resume.pdf',
      experience: '3+ years',
      skills: ['Java', 'Spring Boot', 'React', 'MySQL', 'REST APIs'],
    },
    {
      _id: 'app7',
      applicant: {
        _id: 'user7',
        name: 'Aditya Singh',
        email: 'aditya.singh@student.com',
        phone: '+91-9912345678',
        location: 'Delhi, NCR',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Reviewed',
      coverLetter: 'With 2+ years of experience in mobile and web development using React Native and React, I have a solid foundation in JavaScript. I am keen to expand my backend skills in Node.js.',
      appliedAt: new Date('2026-05-10'),
      resume: 'aditya_singh_resume.pdf',
      experience: '2+ years',
      skills: ['JavaScript', 'React Native', 'Firebase', 'Figma', 'UI/UX'],
    },
    {
      _id: 'app8',
      applicant: {
        _id: 'user8',
        name: 'Divya Reddy',
        email: 'divya.reddy@student.com',
        phone: '+91-9823456789',
        location: 'Hyderabad, Telangana',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Accepted',
      coverLetter: 'Although my primary focus is AI/ML, I have solid fundamentals in full-stack development. I am interested in combining my AI expertise with full-stack development for building intelligent applications.',
      appliedAt: new Date('2026-05-09'),
      resume: 'divya_reddy_resume.pdf',
      experience: '2+ years',
      skills: ['Python', 'C++', 'Computer Vision', 'OpenCV', 'Machine Learning'],
    },
    {
      _id: 'app9',
      applicant: {
        _id: 'user9',
        name: 'Ravi Kumar',
        email: 'ravi.kumar@student.com',
        phone: '+91-9734567890',
        location: 'Bangalore, Karnataka',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Pending',
      coverLetter: 'As a backend specialist with expertise in Node.js and Express.js, I am looking to strengthen my frontend skills with React. This position is a perfect match for my career goals.',
      appliedAt: new Date('2026-05-08'),
      resume: 'ravi_kumar_resume.pdf',
      experience: '3+ years',
      skills: ['Node.js', 'Express.js', 'PostgreSQL', 'REST APIs', 'MongoDB'],
    },
    {
      _id: 'app10',
      applicant: {
        _id: 'user10',
        name: 'Neha Gupta',
        email: 'neha.gupta@student.com',
        phone: '+91-8645678901',
        location: 'Mumbai, Maharashtra',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Reviewed',
      coverLetter: 'With my strong DevOps background and infrastructure expertise, I am transitioning to full-stack development. I bring a unique perspective on building scalable and reliable applications.',
      appliedAt: new Date('2026-05-07'),
      resume: 'neha_gupta_resume.pdf',
      experience: '3+ years',
      skills: ['Linux', 'Docker', 'Jenkins', 'Terraform', 'AWS', 'CI/CD'],
    },
    {
      _id: 'app11',
      applicant: {
        _id: 'user11',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@gmail.com',
        phone: '+91-9876543210',
        location: 'Bangalore, Karnataka',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Pending',
      coverLetter: 'I am a passionate developer with 5+ years of production experience in full-stack development. I have successfully delivered multiple projects using React, Node.js, MongoDB, and AWS.',
      appliedAt: new Date('2026-05-06'),
      resume: 'rajesh_resume.pdf',
      experience: '5+ years',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'TypeScript'],
    },
    {
      _id: 'app12',
      applicant: {
        _id: 'user12',
        name: 'Priya Singh',
        email: 'priya.singh@gmail.com',
        phone: '+91-9876543211',
        location: 'Hyderabad, Telangana',
      },
      job: {
        _id: 'demo1',
        title: 'Senior Full Stack Developer - MERN Stack',
      },
      status: 'Accepted',
      coverLetter: 'With 6 years of expertise in MERN stack development and AWS cloud deployment, I have architected and deployed several high-traffic applications at scale.',
      appliedAt: new Date('2026-05-05'),
      resume: 'priya_resume.pdf',
      experience: '6 years',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'GraphQL', 'MongoDB'],
    },
  ];

  useEffect(() => {
    // Load from localStorage immediately on mount
    const localApps = JSON.parse(localStorage.getItem('localApplications') || '[]');
    const appStatusOverrides = JSON.parse(localStorage.getItem('appStatusOverrides') || '{}');
    
    // Apply status overrides to local applications
    const appsWithOverrides = localApps.map(app => ({
      ...app,
      status: appStatusOverrides[app._id] || app.status
    }));
    
    // Show demo applications immediately
    let initialApps = [...demoApplications];
    initialApps = initialApps.map(app => ({
      ...app,
      status: appStatusOverrides[app._id] || app.status
    }));
    
    // Filter by jobId if specified
    if (jobId) {
      initialApps = initialApps.filter(a => a.job?._id === jobId || a.job === jobId);
    }
    
    // Apply status filter
    if (filter !== 'all') {
      initialApps = initialApps.filter(a => a.status === filter);
    }
    
    // Combine with local apps
    initialApps = [...initialApps, ...appsWithOverrides];
    
    // Remove duplicates
    const seen = new Set();
    initialApps = initialApps.filter(app => {
      if (seen.has(app._id)) return false;
      seen.add(app._id);
      return true;
    });
    
    setApplications(initialApps);
    
    // Fetch job info and try to fetch real applications
    fetchJobInfo();
    fetchApplications();
  }, [filter, jobId]);

  const fetchJobInfo = async () => {
    try {
      setLoadingJob(true);
      
      // Check localStorage for status overrides FIRST
      const jobStatusOverrides = JSON.parse(localStorage.getItem('jobStatusOverrides') || '{}');
      
      // Check localStorage for local jobs
      const localJobs = JSON.parse(localStorage.getItem('localJobs') || '[]');
      const localJob = localJobs.find(j => j._id === jobId);
      
      // Try to fetch from API
      try {
        if (jobId && !jobId.startsWith('demo') && !jobId.startsWith('local-')) {
          const response = await fetch(`/api/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (response.ok) {
            const data = await response.json();
            const job = data.job || data;
            
            // Apply status override if it exists
            if (jobStatusOverrides[job._id] !== undefined) {
              job.isActive = jobStatusOverrides[job._id];
            }
            setJobInfo(job);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching job from API:', error);
      }
      
      // Use local job or demo job
      if (localJob) {
        // Apply status override if it exists
        if (jobStatusOverrides[localJob._id] !== undefined) {
          localJob.isActive = jobStatusOverrides[localJob._id];
        }
        setJobInfo(localJob);
      } else if (jobId === 'demo1') {
        const demoJob = {
          _id: 'demo1',
          title: 'Senior Full Stack Developer',
          company: 'Tech Company',
          isActive: true,
        };
        
        // Apply status override if it exists
        if (jobStatusOverrides['demo1'] !== undefined) {
          demoJob.isActive = jobStatusOverrides['demo1'];
        }
        setJobInfo(demoJob);
      } else {
        setJobInfo(null);
      }
    } catch (error) {
      console.error('Error loading job info:', error);
    } finally {
      setLoadingJob(false);
    }
  };

  const handleToggleJobActive = async (job) => {
    if (!job) {
      console.error('No job provided to toggle');
      setToast({ message: 'Error: Job not found', type: 'error' });
      return;
    }

    setTogglingJob(true);
    
    const newStatus = !job.isActive;
    
    // Update state immediately for UI responsiveness
    const updatedJob = { ...job, isActive: newStatus };
    setJobInfo(updatedJob);
    
    // Save status override to localStorage - this is the PRIMARY method
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
      message: `Job ${newStatus ? 'activated' : 'deactivated'}!`, 
      type: 'success' 
    });

    // Try to update via API for API jobs (non-local, non-demo)
    if (!job._id.startsWith('local-') && !job._id.startsWith('demo')) {
      try {
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
          // Successfully updated
        } else {
          const errorData = await response.json();
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          // Request timeout, but status is saved locally
        } else {
          // API error, but status is saved locally
        }
      }
    }
    
    setTogglingJob(false);
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Get application status overrides from localStorage
      const appStatusOverrides = JSON.parse(localStorage.getItem('appStatusOverrides') || '{}');
      let apps = [];
      let showingDemo = false;
      
      // First try to fetch from API
      try {
        const response = await fetch(`/api/applications${jobId ? `?jobId=${jobId}` : ''}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          apps = data.applications || [];
          
          // Apply status overrides to API applications
          apps = apps.map(app => ({
            ...app,
            status: appStatusOverrides[app._id] || app.status
          }));
          
          // Filter by job if specified
          if (jobId && apps.length > 0) {
            const filteredApps = apps.filter(a => a.job?._id === jobId);
            if (filteredApps.length > 0) {
              apps = filteredApps;
            } else {
              // If no apps for this job, use demo
              throw new Error('No apps for this job');
            }
          }
        }
      } catch (apiError) {
        // API failed or no apps, use demo data
        apps = [];
        showingDemo = true;
      }
      
      // If no API data, use demo + local
      if (apps.length === 0) {
        let demoApps = [...demoApplications];
        let localApps = JSON.parse(localStorage.getItem('localApplications') || '[]');
        
        // Apply status overrides to demo apps
        demoApps = demoApps.map(app => ({
          ...app,
          status: appStatusOverrides[app._id] || app.status
        }));
        
        // Apply status overrides to local apps
        localApps = localApps.map(app => ({
          ...app,
          status: appStatusOverrides[app._id] || app.status
        }));
        
        apps = [...demoApps, ...localApps];
        
        // Filter by jobId if specified
        if (jobId && apps.length > 0) {
          apps = apps.filter(a => a.job?._id === jobId || a.job === jobId);
        }
        
        showingDemo = true;
      }
      
      // Apply status filter
      if (filter !== 'all' && apps.length > 0) {
        apps = apps.filter(a => a.status === filter);
      }
      
      setApplications(apps);
      
      if (showingDemo && apps.length > 0) {
        setToast({ message: `✨ Showing ${apps.length} demo applicants`, type: 'info' });
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      
      // Fallback: Always show demo data
      const appStatusOverrides = JSON.parse(localStorage.getItem('appStatusOverrides') || '{}');
      
      let demoApps = demoApplications.map(app => ({
        ...app,
        status: appStatusOverrides[app._id] || app.status
      }));
      
      let localApps = JSON.parse(localStorage.getItem('localApplications') || '[]').map(app => ({
        ...app,
        status: appStatusOverrides[app._id] || app.status
      }));
      
      let apps = [...demoApps, ...localApps];
      
      // Filter by status if needed
      if (filter !== 'all') {
        apps = apps.filter(a => a.status === filter);
      }
      
      setApplications(apps);
      setToast({ message: `Showing ${apps.length} demo applicants (fallback mode)`, type: 'info' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    // Update state immediately (optimistic update)
    const updated = applications.map(app =>
      app._id === appId ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    
    // Save status override to localStorage
    try {
      const appStatusOverrides = JSON.parse(localStorage.getItem('appStatusOverrides') || '{}');
      appStatusOverrides[appId] = newStatus;
      localStorage.setItem('appStatusOverrides', JSON.stringify(appStatusOverrides));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    setToast({ message: `Application marked as ${newStatus}!`, type: 'success' });
    
    // Try API update (but already saved locally)
    if (!appId.startsWith('app')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`/api/applications/${appId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // API update failed - already saved locally
        }
      } catch (error) {
        // API error (expected in demo mode), status saved locally
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f59e0b',
      'Reviewed': '#3b82f6',
      'Accepted': '#10b981',
      'Rejected': '#ef4444',
      'Withdrawn': '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': 'Pending',
      'Reviewed': 'R',
      'Accepted': 'Y',
      'Rejected': 'Rejected',
      'Withdrawn': '-',
    };
    return icons[status] || '';
  };

  const handleViewProfile = (application) => {
    setToast({ 
      message: `Viewing profile for ${application.applicant?.name}`, 
      type: 'info' 
    });
    // TODO: Open profile modal or navigate to profile page
  };

  const handleScheduleInterview = (application) => {
    setToast({ 
      message: `Scheduling interview with ${application.applicant?.name}`, 
      type: 'info' 
    });
    // TODO: Open interview scheduling modal
  };

  return (
    <div className="applicants-container">
      <div className="applicants-header">
        <h1>Applicants</h1>
        <p style={{ color: 'var(--text-light)', marginTop: '5px' }}>Review and manage your job applications</p>
      </div>

      {/* Job Info Header with Deactivate Button */}
      {loadingJob ? (
        <div style={{ padding: '15px', textAlign: 'center', color: 'var(--text-light)' }}>Loading job info...</div>
      ) : jobInfo ? (
        <div style={{
          background: 'var(--surface-secondary)',
          border: '1px solid var(--border-light)',
          borderRadius: '8px',
          padding: '15px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{jobInfo.title}</h3>
            <p style={{ margin: '0', color: 'var(--text-light)', fontSize: '14px' }}>
              {jobInfo.company && `${jobInfo.company}  `}
              <span style={{
                color: jobInfo.isActive ? '#10b981' : '#ef4444',
                fontWeight: '600'
              }}>
                {jobInfo.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
          <button
            onClick={() => handleToggleJobActive(jobInfo)}
            disabled={togglingJob}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: jobInfo.isActive ? '#ef4444' : '#10b981',
              color: 'white',
              cursor: togglingJob ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              opacity: togglingJob ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!togglingJob) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {togglingJob ? 'Updating...' : (jobInfo.isActive ? 'Deactivate Job' : 'Activate Job')}
          </button>
        </div>
      ) : null}

      <div className="status-filter">
        {['all', 'Pending', 'Reviewed', 'Accepted', 'Rejected'].map((status) => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status === 'all' 
              ? `All (${applications.length})` 
              : `${status} (${applications.filter(a => a.status === status).length})`
            }
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="no-data">
          <p>📭 No applications found for this status</p>
          <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '10px' }}>Try selecting "All" to see all applications</p>
        </div>
      ) : (
        <div className="applicants-list-modern">
          {applications.map((app) => {
            if (!app || !app._id) {
              console.warn('Invalid application:', app);
              return null;
            }
            return (
              <ApplicantCard
                key={app._id}
                application={app}
                onStatusChange={handleUpdateStatus}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                onViewProfile={handleViewProfile}
                onScheduleInterview={handleScheduleInterview}
              />
            );
          })}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Applicants;

