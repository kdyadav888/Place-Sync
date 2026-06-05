import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: '',
    maxStudents: '',
    price: '0',
    startDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to create course
      console.log('Creating course:', formData);
      navigate('/trainer/my-courses');
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-course-container">
      <div className="page-header">
        <h1>Create New Course</h1>
        <p>Add a new course to start teaching</p>
      </div>

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label>Course Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter course title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Describe your course"
            rows="5"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleInputChange} required>
              <option value="">Select a category</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Level *</label>
            <select name="level" value={formData.level} onChange={handleInputChange} required>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration (weeks) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., 4"
              required
            />
          </div>

          <div className="form-group">
            <label>Max Students</label>
            <input
              type="number"
              name="maxStudents"
              value={formData.maxStudents}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Leave empty for unlimited"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price ()</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="form-input"
              placeholder="0 for free"
            />
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating...' : 'Create Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/trainer/my-courses')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;

