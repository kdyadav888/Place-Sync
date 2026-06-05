import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Trainer.css';

const AddCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web-dev',
    level: 'beginner',
    duration: '',
    modules: '',
    capacity: '',
    startDate: '',
    price: ''
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
    
    if (!formData.title || !formData.description || !formData.duration || !formData.modules) {
      alert('Please fill all required fields!');
      return;
    }

    // Get existing courses from localStorage
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    // Create new course with unique ID
    const newCourse = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      students: 0,
      modules: parseInt(formData.modules),
      startDate: formData.startDate,
      duration: formData.duration + ' weeks',
      level: formData.level.charAt(0).toUpperCase() + formData.level.slice(1),
      status: 'active'
    };

    // Add to existing courses
    storedCourses.push(newCourse);
    
    // Save to localStorage
    localStorage.setItem('courses', JSON.stringify(storedCourses));
    
    alert('Course created successfully!');
    navigate('/trainer-courses');
  };

  return (
    <div className="trainer-add-course-container">
      <div className="page-header glass-effect">
        <button className="btn-back" onClick={() => navigate('/trainer-courses')}>
           Back to Courses
        </button>
        <h1>Add New Course</h1>
      </div>

      <form onSubmit={handleSubmit} className="course-form glass-effect">
        <div className="form-row">
          <div className="form-group">
            <label>Course Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Advanced React Development"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="web-dev">Web Development</option>
              <option value="mobile-dev">Mobile Development</option>
              <option value="data-science">Data Science</option>
              <option value="ai-ml">AI & Machine Learning</option>
              <option value="devops">DevOps</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Level *</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div className="form-group">
            <label>Duration (weeks) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 8"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Number of Modules *</label>
            <input
              type="number"
              name="modules"
              value={formData.modules}
              onChange={handleChange}
              placeholder="e.g., 12"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Student Capacity *</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g., 30"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Price (Optional)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 0 for free"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your course, curriculum, and learning outcomes"
            className="form-input"
            rows="6"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/trainer-courses')}>
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;

