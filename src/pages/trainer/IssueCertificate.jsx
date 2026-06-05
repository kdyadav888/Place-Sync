import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainer } from '../../context/TrainerContext';
import '../../styles/Trainer.css';

const IssueCertificate = () => {
  const navigate = useNavigate();
  const { certificates, setCertificates } = useTrainer();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    title: '',
    description: '',
    issuedDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    certificateId: ''
  });

  const [errors, setErrors] = useState({});

  // Predefined course list
  const coursesList = [
    'React Basics',
    'React Advanced Concepts',
    'Web Development Fundamentals',
    'Backend Development with Node.js',
    'Database Design',
    'Full Stack Development',
    'JavaScript Essentials',
    'TypeScript Fundamentals',
    'REST API Development',
    'Microservices Architecture'
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Student name is required';
    }
    
    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = 'Please enter a valid email';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Course/Achievement title is required';
    }
    
    if (!formData.issuedDate) {
      newErrors.issuedDate = 'Issued date is required';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (new Date(formData.expiryDate) <= new Date(formData.issuedDate)) {
      newErrors.expiryDate = 'Expiry date must be after issued date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate certificate ID
  const generateCertificateId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CERT-${year}-${random}`;
  };

  // Determine certificate status based on expiry date
  const determineCertificateStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

    if (expiry < today) {
      return 'expired';
    } else if (expiry <= thirtyDaysFromNow) {
      return 'expiring-soon';
    }
    return 'active';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fix the errors above'
      });
      return;
    }

    setLoading(true);
    try {
      // Load existing certificates from localStorage
      let existingCerts = [];
      try {
        const storedCerts = localStorage.getItem('trainerCertificates');
        existingCerts = storedCerts ? JSON.parse(storedCerts) : [];
      } catch (error) {
        console.error('Error loading existing certificates:', error);
        existingCerts = certificates;
      }

      // Generate certificate ID if not provided
      const certificateId = formData.certificateId || generateCertificateId();
      
      // Determine status
      const status = determineCertificateStatus(formData.expiryDate);

      // Create new certificate object
      const newCertificate = {
        id: existingCerts.length > 0 ? Math.max(...existingCerts.map(c => c.id)) + 1 : 1,
        ...formData,
        certificateId,
        status
      };

      // Add to existing certificates
      const updatedCertificates = [...existingCerts, newCertificate];

      // Save to localStorage
      localStorage.setItem('trainerCertificates', JSON.stringify(updatedCertificates));

      // Update context
      setCertificates(updatedCertificates);

      console.log('New certificate issued:', newCertificate);

      // Show success message
      setSubmitStatus({
        type: 'success',
        message: ` Certificate issued successfully!\n\nCertificate ID: ${certificateId}\nIssued to: ${newCertificate.recipientName}`
      });

      // Reset form
      setFormData({
        recipientName: '',
        recipientEmail: '',
        title: '',
        description: '',
        issuedDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        certificateId: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/trainer-certificates');
      }, 2000);
    } catch (error) {
      console.error('Error issuing certificate:', error);
      setSubmitStatus({
        type: 'error',
        message: ` Error issuing certificate: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setFormData({
      recipientName: '',
      recipientEmail: '',
      title: '',
      description: '',
      issuedDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      certificateId: ''
    });
    setErrors({});
    setSubmitStatus(null);
  };

  return (
    <div className="issue-certificate-container">
      {/* Header */}
      <div className="page-header glass-effect">
        <div>
          <h1>Issue New Certificate</h1>
          <p>Create and issue a certificate to your students</p>
        </div>
        <button 
          className="btn-action secondary"
          onClick={() => navigate('/trainer-certificates')}
        >
           Back to Certificates
        </button>
      </div>

      {/* Status Message */}
      {submitStatus && (
        <div className={`status-message ${submitStatus.type}`}>
          <p>{submitStatus.message}</p>
          {submitStatus.type === 'error' && (
            <button 
              className="btn-close-status"
              onClick={() => setSubmitStatus(null)}
            >
              
            </button>
          )}
        </div>
      )}

      {/* Form Container */}
      <div className="form-container glass-effect">
        <form onSubmit={handleSubmit} className="issue-certificate-form">
          {/* Section 1: Recipient Information */}
          <div className="form-section">
            <h2>Recipient Information</h2>
            
            <div className="form-group">
              <label htmlFor="recipientName">
                Student Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                placeholder="Enter student's full name"
                className={errors.recipientName ? 'input-error' : ''}
              />
              {errors.recipientName && (
                <span className="error-message">{errors.recipientName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="recipientEmail">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="recipientEmail"
                name="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleInputChange}
                placeholder="student@example.com"
                className={errors.recipientEmail ? 'input-error' : ''}
              />
              {errors.recipientEmail && (
                <span className="error-message">{errors.recipientEmail}</span>
              )}
            </div>
          </div>

          {/* Section 2: Certificate Details */}
          <div className="form-section">
            <h2> Certificate Details</h2>
            
            <div className="form-group">
              <label htmlFor="title">
                Course/Achievement Title <span className="required">*</span>
              </label>
              <datalist id="courseList">
                {coursesList.map((course, index) => (
                  <option key={index} value={course} />
                ))}
              </datalist>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., React Advanced Concepts"
                list="courseList"
                className={errors.title ? 'input-error' : ''}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add any additional details about the course or achievement..."
                rows="3"
              ></textarea>
            </div>
          </div>

          {/* Section 3: Dates */}
          <div className="form-section">
            <h2> Validity Period</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="issuedDate">
                  Issued Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="issuedDate"
                  name="issuedDate"
                  value={formData.issuedDate}
                  onChange={handleInputChange}
                  className={errors.issuedDate ? 'input-error' : ''}
                />
                {errors.issuedDate && (
                  <span className="error-message">{errors.issuedDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="expiryDate">
                  Expiry Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className={errors.expiryDate ? 'input-error' : ''}
                />
                {errors.expiryDate && (
                  <span className="error-message">{errors.expiryDate}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Certificate ID (Optional) */}
          <div className="form-section">
            <h2> Certificate ID</h2>
            
            <div className="form-group">
              <label htmlFor="certificateId">
                Certificate ID (Optional - Auto-generated if left empty)
              </label>
              <input
                type="text"
                id="certificateId"
                name="certificateId"
                value={formData.certificateId}
                onChange={handleInputChange}
                placeholder="e.g., CERT-2024-0001 or leave empty for auto-generation"
              />
              <p className="field-hint">
                If left empty, a unique ID will be automatically generated in format: CERT-YYYY-XXXX
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button 
              type="reset"
              onClick={handleReset}
              className="btn-action secondary"
              disabled={loading}
            >
               Clear Form
            </button>
            <button 
              type="submit"
              className="btn-action primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                <> Issue Certificate</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="info-box glass-effect">
        <h3> Information</h3>
        <ul>
          <li> Fill in all required fields (*) to issue a certificate</li>
          <li> A notification will be sent to the student's email</li>
          <li> Each certificate gets a unique ID for verification</li>
          <li> Set appropriate validity period for the certificate</li>
          <li> You can issue multiple certificates for the same student</li>
        </ul>
      </div>
    </div>
  );
};

export default IssueCertificate;

