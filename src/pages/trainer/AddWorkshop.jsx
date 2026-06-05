import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Trainer.css';

const AddWorkshop = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    capacity: '',
    type: 'Interview Skills',
    status: 'upcoming'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date || !formData.capacity) {
      alert('Please fill all required fields!');
      return;
    }

    // Get existing workshops from localStorage
    const storedWorkshops = JSON.parse(localStorage.getItem('workshops') || '[]');
    
    // Create new workshop with unique ID
    const newWorkshop = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      capacity: parseInt(formData.capacity),
      type: formData.type,
      status: formData.status
    };

    // Add to existing workshops
    storedWorkshops.push(newWorkshop);
    
    // Save to localStorage
    localStorage.setItem('workshops', JSON.stringify(storedWorkshops));
    
    alert('Workshop created successfully!');
    navigate('/trainer-workshops');
  };

  return (
    <div className="trainer-add-workshop-container">
      <div className="page-header glass-effect">
        <button className="btn-back" onClick={() => navigate('/trainer-workshops')}>
           Back to Workshops
        </button>
        <h1>Add New Workshop</h1>
      </div>

      <form onSubmit={handleSubmit} className="course-form glass-effect">
        <div className="form-row">
          <div className="form-group">
            <label>Workshop Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Interview Preparation"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Workshop Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="Interview Skills">Interview Skills</option>
              <option value="Technical">Technical</option>
              <option value="Career Dev">Career Dev</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the workshop..."
            className="form-textarea"
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date & Time *</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="e.g., Feb 20, 2024 - 3:00 PM"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Capacity (Participants) *</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g., 50"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/trainer-workshops')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-action primary">
            Create Workshop
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkshop;

