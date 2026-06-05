import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainer } from '../../context/TrainerContext';
import CertificateCard from '../../components/trainer/CertificateCard';
import CertificateModal from '../../components/trainer/CertificateModal';
import '../../styles/Trainer.css';

const Certificates = () => {
  const navigate = useNavigate();
  const { certificates, setCertificates } = useTrainer();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localCertificates, setLocalCertificates] = useState(certificates);

  // Sample certificates for initial load
  const sampleCertificates = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      recipientName: 'Arjun Mehta',
      recipientEmail: 'arjun@example.com',
      issuedDate: 'Jan 30, 2024',
      expiryDate: 'Jan 30, 2025',
      certificateId: 'CERT-2024-001',
      status: 'active'
    },
    {
      id: 2,
      title: 'React Advanced Concepts',
      recipientName: 'Priya Singh',
      recipientEmail: 'priya@example.com',
      issuedDate: 'Feb 5, 2024',
      expiryDate: 'Feb 5, 2025',
      certificateId: 'CERT-2024-002',
      status: 'active'
    },
    {
      id: 3,
      title: 'Backend Development with Node.js',
      recipientName: 'Raj Kumar',
      recipientEmail: 'raj@example.com',
      issuedDate: 'Jan 20, 2024',
      expiryDate: 'Jan 20, 2025',
      certificateId: 'CERT-2024-003',
      status: 'active'
    },
    {
      id: 4,
      title: 'Database Design',
      recipientName: 'Neha Patel',
      recipientEmail: 'neha@example.com',
      issuedDate: 'Dec 15, 2023',
      expiryDate: 'Dec 15, 2024',
      certificateId: 'CERT-2023-045',
      status: 'expiring-soon'
    },
    {
      id: 5,
      title: 'Web Development Fundamentals',
      recipientName: 'Amit Sharma',
      recipientEmail: 'amit@example.com',
      issuedDate: 'Nov 10, 2023',
      expiryDate: 'Nov 10, 2024',
      certificateId: 'CERT-2023-032',
      status: 'expired'
    }
  ];

  // Load certificates from localStorage and context
  useEffect(() => {
    const loadCertificates = () => {
      try {
        // Try to load from localStorage
        const storedCerts = localStorage.getItem('trainerCertificates');
        if (storedCerts) {
          const parsedCerts = JSON.parse(storedCerts);
          setLocalCertificates(parsedCerts);
          setCertificates(parsedCerts);
        } else if (certificates.length === 0) {
          // If no stored certificates and context is empty, use sample data
          setLocalCertificates(sampleCertificates);
          setCertificates(sampleCertificates);
        } else {
          // Use certificates from context
          setLocalCertificates(certificates);
        }
      } catch (error) {
        console.error('Error loading certificates:', error);
        // Fallback to sample data if error
        if (certificates.length === 0) {
          setLocalCertificates(sampleCertificates);
          setCertificates(sampleCertificates);
        }
      }
    };

    loadCertificates();
  }, []);

  // Watch for context changes
  useEffect(() => {
    if (certificates.length > 0) {
      setLocalCertificates(certificates);
    }
  }, [certificates]);

  // Filter certificates based on selected status
  const filteredCertificates = useMemo(() => {
    if (filterStatus === 'all') {
      return localCertificates;
    }
    return localCertificates.filter(cert => cert.status === filterStatus);
  }, [localCertificates, filterStatus]);

  const handleViewCertificate = (certificate) => {
    console.log('Viewing certificate:', certificate.certificateId);
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const handleDownload = (certificate) => {
    console.log('Downloading certificate:', certificate.certificateId);
    try {
      // Generate a simple certificate PDF or image
      // For now, we'll create a downloadable text version
      const certificateContent = `
CERTIFICATE OF COMPLETION

This is to certify that

${certificate.recipientName}

has successfully completed the course:

${certificate.title}

Certificate ID: ${certificate.certificateId}
Issued Date: ${certificate.issuedDate}
Expiry Date: ${certificate.expiryDate}
Status: ${certificate.status}

Recipient Email: ${certificate.recipientEmail}

This certificate is valid and authenticated.
      `.trim();

      // Create blob and download
      const element = document.createElement('a');
      const file = new Blob([certificateContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${certificate.certificateId}_${certificate.recipientName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);

      // Show success message
      alert(` Certificate downloaded successfully!\n\nFile: ${element.download}`);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert(` Error downloading certificate: ${error.message}`);
    }
  };

  const handleRevoke = (certificateId) => {
    if (window.confirm('Are you sure you want to revoke this certificate? This action cannot be undone.')) {
      const updatedCerts = localCertificates.filter(c => c.id !== certificateId);
      setLocalCertificates(updatedCerts);
      setCertificates(updatedCerts);
      localStorage.setItem('trainerCertificates', JSON.stringify(updatedCerts));
      alert(' Certificate revoked successfully!');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    console.log('Filter changed to:', e.target.value);
  };

  return (
    <div className="trainer-certificates-container">
      <div className="page-header glass-effect">
        <div>
          <h1>Certificates</h1>
          <p>Manage and issue certificates to your students</p>
        </div>
        <button 
          className="btn-action primary"
          onClick={() => navigate('/trainer-add-certificate')}
        >
          <span className="btn-icon">+</span> Issue New Certificate
        </button>
      </div>

      <div className="filter-section glass-effect">
        <label>Filter by Status:</label>
        <select 
          className="filter-select"
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <option value="all">All Certificates</option>
          <option value="active">Active</option>
          <option value="expiring-soon">Expiring Soon</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="certificates-stats glass-effect">
        <div className="stat-item">
          <h3>Total Issued</h3>
          <p className="stat-number">{localCertificates.length}</p>
        </div>
        <div className="stat-item">
          <h3>Active</h3>
          <p className="stat-number">{localCertificates.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="stat-item">
          <h3>Expiring Soon</h3>
          <p className="stat-number">{localCertificates.filter(c => c.status === 'expiring-soon').length}</p>
        </div>
        <div className="stat-item">
          <h3>Expired</h3>
          <p className="stat-number">{localCertificates.filter(c => c.status === 'expired').length}</p>
        </div>
      </div>

      <div className="certificates-grid">
        {filteredCertificates.length > 0 ? (
          filteredCertificates.map(certificate => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onView={handleViewCertificate}
              onDownload={handleDownload}
              onRevoke={handleRevoke}
            />
          ))
        ) : (
          <div className="empty-state glass-effect">
            <p>No certificates {filterStatus !== 'all' ? `with status "${filterStatus}"` : 'issued yet'}.</p>
            <button className="btn-action primary" onClick={() => navigate('/trainer-issue-certificate')}>
              <span className="btn-icon">+</span> Issue First Certificate
            </button>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isModalOpen}
        certificate={selectedCertificate}
        onClose={handleCloseModal}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default Certificates;

