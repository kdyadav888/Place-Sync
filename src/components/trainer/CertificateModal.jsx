import React from 'react';
import '../../styles/CertificateModal.css';

const CertificateModal = ({ isOpen, certificate, onClose, onDownload }) => {
  if (!isOpen || !certificate) return null;

  const handleDownload = () => {
    if (onDownload) {
      onDownload(certificate);
    }
  };

  // Determine status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#22c55e';
      case 'expiring-soon':
        return '#f59e0b';
      case 'expired':
        return '#ef4444';
      default:
        return '#1a9b8a';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="certificate-modal-overlay">
      <div className="certificate-modal-container">
        {/* Header */}
        <div className="certificate-modal-header">
          <h2>Certificate Details</h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            title="Close"
            aria-label="Close certificate modal"
          >
            Close
          </button>
        </div>

        {/* Certificate Preview */}
        <div className="certificate-preview">
          <div 
            className="certificate-display"
            style={{
              borderTop: `5px solid ${getStatusColor(certificate.status)}`
            }}
          >
            <div className="certificate-header-text">
              <h1>Certificate of Completion</h1>
              <p className="certificate-subtitle">This certifies that</p>
            </div>

            <div className="certificate-body">
              <div className="recipient-name">{certificate.recipientName}</div>
              <p className="has-successfully">has successfully completed the course:</p>
              <div className="course-title">{certificate.title}</div>
            </div>

            <div className="certificate-footer-text">
              <div className="footer-section">
                <div className="footer-item">
                  <p className="footer-label">Certificate ID</p>
                  <p className="footer-value">{certificate.certificateId}</p>
                </div>
                <div className="footer-item">
                  <p className="footer-label">Issued</p>
                  <p className="footer-value">{formatDate(certificate.issuedDate)}</p>
                </div>
                <div className="footer-item">
                  <p className="footer-label">Expires</p>
                  <p className="footer-value">{formatDate(certificate.expiryDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="certificate-details-section">
          <div className="details-grid">
            <div className="detail-card">
              <span className="detail-icon"></span>
              <div className="detail-content">
                <p className="detail-label">Recipient Name</p>
                <p className="detail-value">{certificate.recipientName}</p>
              </div>
            </div>

            <div className="detail-card">
              <span className="detail-icon"></span>
              <div className="detail-content">
                <p className="detail-label">Email Address</p>
                <p className="detail-value">{certificate.recipientEmail}</p>
              </div>
            </div>

            <div className="detail-card">
              <span className="detail-icon"></span>
              <div className="detail-content">
                <p className="detail-label">Course Title</p>
                <p className="detail-value">{certificate.title}</p>
              </div>
            </div>

            <div className="detail-card">
              <span className="detail-icon"></span>
              <div className="detail-content">
                <p className="detail-label">Certificate ID</p>
                <p className="detail-value">{certificate.certificateId}</p>
              </div>
            </div>

            <div className="detail-card">
              <span className="detail-icon"></span>
              <div className="detail-content">
                <p className="detail-label">Issued Date</p>
                <p className="detail-value">{formatDate(certificate.issuedDate)}</p>
              </div>
            </div>

            <div className="detail-card">
              <span className="detail-icon"></span>
              <div className="detail-content">
                <p className="detail-label">Expiry Date</p>
                <p className="detail-value">{formatDate(certificate.expiryDate)}</p>
              </div>
            </div>

            <div className="detail-card">
              <span className="detail-icon">Issued</span>
              <div className="detail-content">
                <p className="detail-label">Status</p>
                <p 
                  className="detail-value status"
                  style={{ color: getStatusColor(certificate.status) }}
                >
                  {certificate.status ? certificate.status.replace('-', ' ').toUpperCase() : 'ACTIVE'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="certificate-modal-actions">
          <button 
            className="btn-action btn-close-modal"
            onClick={onClose}
          >
            Close
          </button>
          <button 
            className="btn-action btn-download-certificate"
            onClick={handleDownload}
          >
             Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;

