import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import '../styles/RecruiterDashboard.css';

const PostJob = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDemoData, setShowDemoData] = useState(false);

  const demoJobData = {
    title: 'Senior Full Stack Developer - MERN Stack',
    description: 'TechVision India is seeking a Senior Full Stack Developer with expertise in MERN stack to build innovative solutions for our growing portfolio of products. You will collaborate with cross-functional teams, mentor junior developers, and contribute to architectural decisions. Based in our state-of-the-art office in Bangalore with flexibility for remote work.\n\nResponsibilities:\n Design and develop scalable web applications\n Lead code reviews and maintain high code quality standards\n Collaborate with product and design teams\n Mentor and guide junior team members',
    company: 'TechVision India Pvt Ltd',
    location: 'Bangalore, Karnataka, India',
    jobType: 'Full-time',
    experience: 'Senior',
    salary: { min: 1200000, max: 1800000, currency: 'INR' },
    skills: 'React, Node.js, MongoDB, AWS, Docker, GraphQL, TypeScript',
    requirements: '5+ years production experience with React and Node.js, B.Tech/M.Tech in CS or equivalent, Strong understanding of system design and microservices, AWS or GCP experience',
    benefits: 'Health Insurance, Stock Options, Remote Work (2-3 days office), Professional Development Budget, Flexible Working Hours, Gym Membership',
    deadline: '2026-06-30',
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: user?.company || '',
    location: '',
    jobType: 'Full-time',
    experience: 'Entry Level',
    salary: { min: 0, max: 0, currency: 'INR' },
    skills: '',
    requirements: '',
    benefits: '',
    deadline: '',
  });

  const handleLoadDemo = () => {
    setFormData(demoJobData);
    setShowDemoData(true);
    setToast({ message: 'Demo data loaded! Feel free to edit.', type: 'info' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('salary.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        salary: { ...formData.salary, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.location) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    if (!user?._id) {
      setToast({ message: 'Error: User ID not found. Please login again.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const jobData = {
        ...formData,
        recruiterId: user._id,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r),
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b),
      };

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        //  SUCCESS: Don't save to localStorage if API succeeded
        // The job is already in the database, no backup needed
        setToast({ message: ' Job posted successfully!', type: 'success' });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          company: user?.company || '',
          location: '',
          jobType: 'Full-time',
          experience: 'Entry Level',
          salary: { min: 0, max: 0, currency: 'INR' },
          skills: '',
          requirements: '',
          benefits: '',
          deadline: '',
        });
        setShowDemoData(false);
        
        setTimeout(() => {
          navigate('/manage-jobs');
        }, 2000);
      } else {
        const data = await response.json();
        setToast({ message: data.message || 'Failed to post job', type: 'error' });
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setToast({ message: 'Request timeout. Saving locally...', type: 'info' });
      } else {
        setToast({ message: 'Network issue. Saving locally...', type: 'info' });
      }
      
      //  FAILURE: Save to localStorage only if API fails
      const newJob = {
        _id: 'local-' + Date.now(),
        ...formData,
        recruiterId: user._id,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r),
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b),
        isActive: true,
        createdAt: new Date().toISOString(),
        syncStatus: 'pending', // Mark as needing to sync to server
      };
      
      const existingJobs = JSON.parse(localStorage.getItem('localJobs') || '[]');
      existingJobs.push(newJob);
      localStorage.setItem('localJobs', JSON.stringify(existingJobs));
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        company: user?.company || '',
        location: '',
        jobType: 'Full-time',
        experience: 'Entry Level',
        salary: { min: 0, max: 0, currency: 'INR' },
        skills: '',
        requirements: '',
        benefits: '',
        deadline: '',
      });
      setShowDemoData(false);
      
      setTimeout(() => {
        navigate('/manage-jobs');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <div className="recruiter-header">
        <h1> Post a New Job</h1>
        <p>Fill in the details and post your job opening</p>
      </div>

      <button 
        onClick={handleLoadDemo}
        className="btn-demo"
        type="button"
      >
        Load Demo Data (Indian Company)
      </button>

      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-row">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior React Developer"
              required
            />
          </div>
          <div className="form-group">
            <label>Institute *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g., TechCorp India"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Bangalore, India"
              required
            />
          </div>
          <div className="form-group">
            <label>Job Type *</label>
            <select name="jobType" value={formData.jobType} onChange={handleChange} required>
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Experience Level *</label>
            <select name="experience" value={formData.experience} onChange={handleChange} required>
              <option value="">Select Level</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior">Senior</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
          <div className="form-group">
            <label>Application Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Min Salary (INR) *</label>
            <input
              type="number"
              name="salary.min"
              value={formData.salary.min}
              onChange={handleChange}
              placeholder="e.g., 600000"
              required
            />
          </div>
          <div className="form-group">
            <label>Max Salary (INR) *</label>
            <input
              type="number"
              name="salary.max"
              value={formData.salary.max}
              onChange={handleChange}
              placeholder="e.g., 1200000"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Job Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the job, responsibilities, and what makes this role special..."
            rows="5"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Required Skills (comma separated) *</label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB, AWS"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Requirements (comma separated) *</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="e.g., 3+ years experience, B.Tech in CS, Strong DSA"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Benefits (comma separated)</label>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            placeholder="e.g., Health Insurance, Stock Options, Remote Work, Professional Development"
            rows="3"
          ></textarea>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
          <button 
            type="button"
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
             Cancel
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default PostJob;

