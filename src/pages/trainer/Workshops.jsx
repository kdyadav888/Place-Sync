import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkshopCard from '../../components/trainer/WorkshopCard';
import '../../styles/Trainer.css';

const Workshops = () => {
  const navigate = useNavigate();
  const defaultWorkshops = [
    {
      id: 1,
      title: 'Interview Preparation',
      description: 'Mock interviews and tips for tech interviews',
      date: 'Feb 10, 2024 - 3:00 PM',
      capacity: 30,
      type: 'Interview Skills',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Resume Building Workshop',
      description: 'Create an impressive resume that gets noticed',
      date: 'Feb 5, 2024 - 2:00 PM',
      capacity: 50,
      type: 'Career Dev',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'GitHub & Git Workflow',
      description: 'Master version control and collaboration',
      date: 'Feb 3, 2024 - 4:00 PM',
      capacity: 40,
      type: 'Technical',
      status: 'ongoing'
    },
    {
      id: 4,
      title: 'LinkedIn Optimization',
      description: 'Optimize your LinkedIn profile for recruiters',
      date: 'Jan 28, 2024 - 5:00 PM',
      capacity: 100,
      type: 'Career Dev',
      status: 'completed'
    }
  ];

  // Initialize state from localStorage or use default
  const [workshops, setWorkshops] = useState(() => {
    const saved = localStorage.getItem('workshops');
    return saved ? JSON.parse(saved) : defaultWorkshops;
  });

  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Save to localStorage whenever workshops change
  useEffect(() => {
    localStorage.setItem('workshops', JSON.stringify(workshops));
  }, [workshops]);

  const handleDeleteClick = (workshopId) => {
    if (window.confirm('Are you sure you want to delete this workshop? This action cannot be undone.')) {
      setWorkshops(workshops.filter(w => w.id !== workshopId));
    }
  };

  const handleViewClick = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (workshop) => {
    setSelectedWorkshop(workshop);
    setEditFormData({ ...workshop });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      setWorkshops(workshops.map(w => w.id === editFormData.id ? editFormData : w));
      setIsEditModalOpen(false);
      setEditFormData(null);
      setSelectedWorkshop(null);
    }
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedWorkshop(null);
    setEditFormData(null);
  };

  const filteredWorkshops = workshops.filter(workshop => {
    if (filterStatus === 'all') return true;
    return workshop.status === filterStatus;
  });

  return (
    <div className="trainer-workshops-container">
      <div className="page-header glass-effect">
        <div>
          <h1>Workshops</h1>
          <p>Conduct and manage interactive workshops for your students</p>
        </div>
        <button 
          className="btn-action primary"
          onClick={() => navigate('/trainer-add-workshop')}
        >
          <span className="btn-icon"></span> Create Workshop
        </button>
      </div>

      <div className="filter-section glass-effect">
        <label>Filter by Status:</label>
        <select 
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Workshops</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="workshops-grid">
        {filteredWorkshops.length > 0 ? (
          filteredWorkshops.map(workshop => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))
        ) : (
          <div className="empty-state glass-effect">
            <p>No workshops scheduled. Create your first workshop!</p>
            <button className="btn-action primary" onClick={() => navigate('/trainer-add-workshop')}>
              <span className="btn-icon"></span> Create Workshop
            </button>
          </div>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedWorkshop && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Workshop Details</h2>
              <button className="modal-close" onClick={closeModals}></button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Workshop Title</label>
                <p>{selectedWorkshop.title}</p>
              </div>
              <div className="detail-group">
                <label>Description</label>
                <p>{selectedWorkshop.description}</p>
              </div>
              <div className="detail-row">
                <div className="detail-group">
                  <label>Date & Time</label>
                  <p>{selectedWorkshop.date}</p>
                </div>
                <div className="detail-group">
                  <label>Status</label>
                  <p><span className={`workshop-status ${selectedWorkshop.status}`}>{selectedWorkshop.status}</span></p>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-group">
                  <label>Capacity</label>
                  <p>{selectedWorkshop.capacity} participants</p>
                </div>
                <div className="detail-group">
                  <label>Type</label>
                  <p>{selectedWorkshop.type}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModals}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editFormData && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Workshop</h2>
              <button className="modal-close" onClick={closeModals}></button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Workshop Title</label>
                <input 
                  type="text" 
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="detail-group">
                <label>Description</label>
                <textarea 
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="form-textarea"
                  rows="3"
                />
              </div>
              <div className="detail-row">
                <div className="detail-group">
                  <label>Date & Time</label>
                  <input 
                    type="text" 
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="detail-group">
                  <label>Capacity</label>
                  <input 
                    type="number" 
                    value={editFormData.capacity}
                    onChange={(e) => setEditFormData({...editFormData, capacity: parseInt(e.target.value)})}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-group">
                  <label>Type</label>
                  <select 
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                    className="form-input"
                  >
                    <option>Interview Skills</option>
                    <option>Technical</option>
                    <option>Career Dev</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="detail-group">
                  <label>Status</label>
                  <select 
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="form-input"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModals}>Cancel</button>
              <button className="btn-action primary" onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workshops;

