import React, { useState, useEffect } from 'react';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      // API call to fetch certificates
      setCertificates([
        { id: 1, studentName: 'Amit Kumar', course: 'React Basics', issuedDate: '2026-05-10', certificateId: 'CERT-001' },
        { id: 2, studentName: 'Priya Singh', course: 'React Basics', issuedDate: '2026-05-12', certificateId: 'CERT-002' },
        { id: 3, studentName: 'Neha Verma', course: 'Web Development', issuedDate: '2026-05-08', certificateId: 'CERT-003' },
      ]);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="certificates-container">
      <div className="page-header">
        <h1>Certificates</h1>
        <button className="btn btn-primary"> Issue Certificate</button>
      </div>

      {loading ? (
        <div className="loading">Loading certificates...</div>
      ) : (
        <div className="certificates-list">
          {certificates.map((cert) => (
            <div key={cert.id} className="certificate-card">
              <div className="certificate-header">
                <h3>{cert.studentName}</h3>
                <span className="certificate-id">{cert.certificateId}</span>
              </div>
              <div className="certificate-info">
                <p> Course: {cert.course}</p>
                <p> Issued: {new Date(cert.issuedDate).toLocaleDateString()}</p>
              </div>
              <div className="certificate-actions">
                <button className="btn btn-secondary btn-small">View</button>
                <button className="btn btn-secondary btn-small">Download</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;

