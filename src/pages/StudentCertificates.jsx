import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import '../styles/Student.css';

const StudentCertificates = () => {
  const navigate = useNavigate();
  const { studentCertificates, enrollments } = useStudent();
  const [displayCertificates, setDisplayCertificates] = useState([]);

  useEffect(() => {
    // Combine student certificates with completed courses
    const completedCourses = enrollments.filter(e => e.status === 'completed');
    const allCertificates = [
      ...studentCertificates,
      ...completedCourses.map(course => ({
        id: course.id,
        title: course.title,
        certificateId: `CERT-${Date.now()}-${course.id}`,
        recipientName: 'Student', // Would come from user profile
        issuedDate: course.completionDate,
        expiryDate: new Date(new Date(course.completionDate).getTime() + (365 * 24 * 60 * 60 * 1000)).toISOString(),
        status: 'active',
        courseId: course.id,
        progress: course.progress
      }))
    ];

    // Remove duplicates
    const uniqueCerts = Array.from(
      new Map(allCertificates.map(cert => [cert.id, cert])).values()
    );

    setDisplayCertificates(uniqueCerts);
  }, [studentCertificates, enrollments]);

  const handleDownloadCertificate = (certificate) => {
    try {
      const certificateContent = `
CERTIFICATE OF COMPLETION

This is to certify that

${certificate.recipientName}

has successfully completed the course:

${certificate.title}

Certificate ID: ${certificate.certificateId}
Issued Date: ${new Date(certificate.issuedDate).toLocaleDateString('en-IN')}
Expiry Date: ${new Date(certificate.expiryDate).toLocaleDateString('en-IN')}

This certificate is valid and authenticated.
      `.trim();

      const element = document.createElement('a');
      const file = new Blob([certificateContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${certificate.certificateId}_Certificate.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Error downloading certificate');
    }
  };

  return (
    <div className="student-certificates-container">
      {/* Header */}
      <div className="student-page-header glass-effect">
        <div>
          <h1> My Certificates</h1>
          <p>View and download your earned certificates</p>
        </div>
        <button 
          className="btn-action primary"
          onClick={() => navigate('/student-enrolled-courses')}
        >
           Back to Courses
        </button>
      </div>

      {/* Certificate Stats */}
      <div className="certificates-stats glass-effect">
        <div className="stat-item">
          <span className="stat-number">{displayCertificates.length}</span>
          <span className="stat-label">Certificates Earned</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {displayCertificates.filter(c => c.status === 'active').length}
          </span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {displayCertificates.filter(c => c.status === 'expired').length}
          </span>
          <span className="stat-label">Expired</span>
        </div>
      </div>

      {/* Certificates Display */}
      <div className="certificates-grid">
        {displayCertificates.length > 0 ? (
          displayCertificates.map(cert => (
            <div key={cert.id} className="certificate-display-card">
              <div className="certificate-visual">
                <div className="cert-icon"></div>
                <div className="cert-ribbon"></div>
              </div>

              <div className="certificate-info">
                <h3>{cert.title}</h3>
                <p className="cert-id">ID: {cert.certificateId}</p>

                <div className="cert-dates">
                  <div className="date-item">
                    <span className="date-label">Issued:</span>
                    <span className="date-value">
                      {new Date(cert.issuedDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Expires:</span>
                    <span className="date-value">
                      {new Date(cert.expiryDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className={`cert-status ${cert.status}`}>
                  {cert.status === 'active' ? ' Active' : ' Expired'}
                </div>
              </div>

              <div className="certificate-actions">
                <button
                  className="btn-view-cert"
                  onClick={() => window.alert(`Certificate Details\n\nTitle: ${cert.title}\nID: ${cert.certificateId}\nIssued: ${new Date(cert.issuedDate).toLocaleDateString('en-IN')}\nExpires: ${new Date(cert.expiryDate).toLocaleDateString('en-IN')}`)}
                >
                   View
                </button>
                <button
                  className="btn-download-cert"
                  onClick={() => handleDownloadCertificate(cert)}
                >
                   Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state glass-effect" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon"></div>
            <h3>No Certificates Yet</h3>
            <p>Complete courses to earn certificates!</p>
            <button 
              className="btn-action primary"
              onClick={() => navigate('/student-enrolled-courses')}
            >
              View My Courses
            </button>
          </div>
        )}
      </div>

      {/* Achievement Info */}
      {displayCertificates.length > 0 && (
        <div className="achievement-info glass-effect">
          <h3> Your Achievements</h3>
          <p>Great job! You've earned {displayCertificates.length} certificate{displayCertificates.length > 1 ? 's' : ''}.</p>
          <p>Keep learning to earn more certificates and advance your skills!</p>
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;

