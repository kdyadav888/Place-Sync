import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../../components/trainer/CourseCard';
import '../../styles/Trainer.css';

const MyCourses = () => {
  const navigate = useNavigate();
  const defaultCourses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
      students: 25,
      modules: 12,
      startDate: 'Jan 15, 2024',
      duration: '8 weeks',
      level: 'Beginner',
      status: 'active'
    },
    {
      id: 2,
      title: 'React Advanced Concepts',
      description: 'Master React hooks, context, and performance optimization',
      students: 18,
      modules: 15,
      startDate: 'Feb 1, 2024',
      duration: '10 weeks',
      level: 'Advanced',
      status: 'active'
    },
    {
      id: 3,
      title: 'Backend Development with Node.js',
      description: 'Build scalable backend applications',
      students: 22,
      modules: 14,
      startDate: 'Jan 20, 2024',
      duration: '9 weeks',
      level: 'Intermediate',
      status: 'active'
    },
    {
      id: 4,
      title: 'Database Design',
      description: 'Design and manage databases efficiently',
      students: 15,
      modules: 10,
      startDate: 'Mar 1, 2024',
      duration: '7 weeks',
      level: 'Intermediate',
      status: 'upcoming'
    }
  ];

  // Initialize state from localStorage or use default
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('courses');
    return saved ? JSON.parse(saved) : defaultCourses;
  });

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Save to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const handleDeleteClick = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setCourses(courses.filter(c => c.id !== courseId));
    }
  };

  const handleViewClick = (course) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setEditFormData({ ...course });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      setCourses(courses.map(c => c.id === editFormData.id ? editFormData : c));
      setIsEditModalOpen(false);
      setEditFormData(null);
      setSelectedCourse(null);
    }
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedCourse(null);
    setEditFormData(null);
  };

  const filteredCourses = courses.filter(course => {
    if (filterStatus === 'all') return true;
    return course.status === filterStatus;
  });

  return (
    <div className="trainer-courses-container">
      <div className="page-header glass-effect">
        <div>
          <h1>My Courses</h1>
          <p>Manage all your courses and track student progress</p>
        </div>
        <button 
          className="btn-action primary"
          onClick={() => navigate('/trainer-add-course')}
        >
          <span className="btn-icon">+</span> Add New Course
        </button>
      </div>

      <div className="filter-section glass-effect">
        <label>Filter by Status:</label>
        <select 
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Courses</option>
          <option value="active">Active Only</option>
          <option value="upcoming">Upcoming Only</option>
          <option value="completed">Completed Only</option>
        </select>
      </div>

      <div className="courses-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))
        ) : (
          <div className="empty-state glass-effect">
            <p>No courses found. Create your first course!</p>
            <button className="btn-action primary" onClick={() => navigate('/trainer-add-course')}>
              <span className="btn-icon">+</span> Create Course
            </button>
          </div>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedCourse && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Course Details</h2>
              <button className="modal-close" onClick={closeModals}></button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Course Title</label>
                <p>{selectedCourse.title}</p>
              </div>
              <div className="detail-group">
                <label>Description</label>
                <p>{selectedCourse.description}</p>
              </div>
              <div className="detail-row">
                <div className="detail-group">
                  <label>Level</label>
                  <p>{selectedCourse.level}</p>
                </div>
                <div className="detail-group">
                  <label>Duration</label>
                  <p>{selectedCourse.duration}</p>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-group">
                  <label>Start Date</label>
                  <p>{selectedCourse.startDate}</p>
                </div>
                <div className="detail-group">
                  <label>Status</label>
                  <p><span className={`course-status ${selectedCourse.status}`}>{selectedCourse.status}</span></p>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-group">
                  <label>Students</label>
                  <p>{selectedCourse.students}</p>
                </div>
                <div className="detail-group">
                  <label>Modules</label>
                  <p>{selectedCourse.modules}</p>
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
              <h2>Edit Course</h2>
              <button className="modal-close" onClick={closeModals}></button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Course Title</label>
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
                  <label>Level</label>
                  <select 
                    value={editFormData.level}
                    onChange={(e) => setEditFormData({...editFormData, level: e.target.value})}
                    className="form-input"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="detail-group">
                  <label>Duration</label>
                  <input 
                    type="text" 
                    value={editFormData.duration}
                    onChange={(e) => setEditFormData({...editFormData, duration: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-group">
                  <label>Start Date</label>
                  <input 
                    type="text" 
                    value={editFormData.startDate}
                    onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="detail-group">
                  <label>Status</label>
                  <select 
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="form-input"
                  >
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
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

export default MyCourses;

