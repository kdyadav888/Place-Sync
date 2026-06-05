import React from 'react';
import '../styles/ResumePDFViewer.css';

const ResumePDFViewer = ({ 
  isOpen, 
  resumeFile, 
  applicantName, 
  onClose, 
  onDownload 
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (onDownload) {
      onDownload(resumeFile);
    }
  };

  return (
    <div className="resume-viewer-overlay">
      <div className="resume-viewer-modal">
        {/* Header */}
        <div className="resume-viewer-header">
          <div className="resume-viewer-title">
            <span className="resume-icon"></span>
            <div className="title-text">
              <h2>{resumeFile}</h2>
              <p>{applicantName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn-close"
            title="Close viewer"
            aria-label="Close resume viewer"
          >
            Close
          </button>
        </div>

        {/* Content Area */}
        <div className="resume-viewer-content">
          <div className="resume-preview">
            <div className="pdf-placeholder">
              <div className="pdf-icon"></div>
              <h3>Resume Preview</h3>
              <p className="file-name">{resumeFile}</p>
              <p className="pdf-message">
                Click the Download button below to save this resume to your PC
              </p>
              <div className="placeholder-info">
                <p> Applicant: <strong>{applicantName}</strong></p>
                <p> File: <strong>{resumeFile}</strong></p>
                <p>Location: /uploads/resumes/{resumeFile}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="resume-viewer-footer">
          <button 
            onClick={onClose}
            className="btn-back"
            title="Go back to applicants list"
          >
             Back
          </button>
          <div className="footer-spacer"></div>
          <button 
            onClick={handleDownload}
            className="btn-download"
            title="Download resume to your PC"
          >
             Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePDFViewer;

