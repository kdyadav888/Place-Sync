import React from 'react';

const CertificateCard = ({ certificate, onView, onDownload, onRevoke }) => {
  return (
    <div className="certificate-card">
      <div className="certificate-icon"></div>
      
      <div className="certificate-content">
        <h3>{certificate.title}</h3>
        <p className="certificate-recipient">Issued to: {certificate.recipientName}</p>
        
        <div className="certificate-details">
          <div className="detail">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{certificate.issuedDate || 'TBD'}</span>
          </div>
          <div className="detail">
            <span className="detail-label">Status:</span>
            <span className={`status-badge ${certificate.status || 'active'}`}>
              {certificate.status || 'Active'}
            </span>
          </div>
        </div>
      </div>

      <div className="certificate-actions">
        {onView && (
          <button className="btn-small btn-view" onClick={() => onView(certificate)}>
             View
          </button>
        )}
        {onDownload && (
          <button className="btn-small btn-edit" onClick={() => onDownload(certificate)}>
             Download
          </button>
        )}
        {onRevoke && (
          <button className="btn-small btn-delete" onClick={() => onRevoke(certificate.id)}>
             Revoke
          </button>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;

