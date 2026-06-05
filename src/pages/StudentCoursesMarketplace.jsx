import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import '../styles/Student.css';

const StudentCoursesMarketplace = () => {
  const navigate = useNavigate();
  const { enrollStudent, isEnrolledInCourse } = useStudent();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  // Load courses from trainer data
  useEffect(() => {
    try {
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses);
        setCourses(parsedCourses);
        setFilteredCourses(parsedCourses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }, []);

  // Filter courses based on search and filter
  useEffect(() => {
    let filtered = courses;

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(course => course.status === selectedFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.level.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [selectedFilter, searchQuery, courses]);

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  const handleConfirmEnrollment = () => {
    if (selectedCourse) {
      enrollStudent(selectedCourse.id, selectedCourse);
      setEnrollSuccess(true);
      setTimeout(() => {
        setShowEnrollModal(false);
        setEnrollSuccess(false);
      }, 1500);
    }
  };

  return (
    <div className="student-courses-container">
      {/* Header */}
      <div className="student-page-header glass-effect">
        <div>
          <h1> Explore Courses</h1>
          <p>Browse and enroll in courses taught by expert trainers</p>
        </div>
        <button 
          className="btn-action primary"
          onClick={() => navigate('/student-enrolled-courses')}
        >
           My Enrolled Courses
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section glass-effect">
        <div className="search-box">
          <input
            type="text"
            placeholder=" Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All Courses
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'active' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('active')}
          >
             Active
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('upcoming')}
          >
             Upcoming
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-marketplace-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div key={course.id} className="course-marketplace-card">
              <div className="course-header-section">
                <div className="course-level">{course.level}</div>
                <div className={`course-status ${course.status}`}>
                  {course.status === 'active' ? ' Active' : ' Upcoming'}
                </div>
              </div>

              <h3 className="course-title">{course.title}</h3>

              <p className="course-description">{course.description}</p>

              <div className="course-meta">
                <div className="meta-item">
                  <span className="meta-label"> Students</span>
                  <span className="meta-value">{course.students}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label"> Modules</span>
                  <span className="meta-value">{course.modules}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label"> Duration</span>
                  <span className="meta-value">{course.duration}</span>
                </div>
              </div>

              <div className="course-footer">
                <span className="course-start"> {course.startDate}</span>
                <button
                  className={`btn-enroll ${
                    isEnrolledInCourse(course.id) ? 'enrolled' : ''
                  }`}
                  onClick={() => 
                    isEnrolledInCourse(course.id)
                      ? navigate('/student-enrolled-courses')
                      : handleEnrollClick(course)
                  }
                >
                  {isEnrolledInCourse(course.id) ? ' Enrolled' : '+ Enroll'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-courses">
            <p>No courses found matching your criteria</p>
            <button 
              className="btn-action primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && selectedCourse && (
        <div className="enrollment-modal-overlay">
          <div className="enrollment-modal">
            <div className="modal-header">
              <h2>Confirm Enrollment</h2>
              <button
                className="modal-close"
                onClick={() => setShowEnrollModal(false)}
              >
                
              </button>
            </div>

            {!enrollSuccess ? (
              <>
                <div className="modal-content">
                  <div className="course-preview">
                    <h3>{selectedCourse.title}</h3>
                    <p>{selectedCourse.description}</p>

                    <div className="preview-details">
                      <div className="detail-row">
                        <span className="detail-label">Level:</span>
                        <span className="detail-value">{selectedCourse.level}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{selectedCourse.duration}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Start Date:</span>
                        <span className="detail-value">{selectedCourse.startDate}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Modules:</span>
                        <span className="detail-value">{selectedCourse.modules}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Students Enrolled:</span>
                        <span className="detail-value">{selectedCourse.students}</span>
                      </div>
                    </div>

                    <div className="enrollment-info">
                      <p> By enrolling, you commit to completing all modules</p>
                      <p> You'll receive a certificate upon completion</p>
                      <p> Your progress will be tracked</p>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="btn-action secondary"
                    onClick={() => setShowEnrollModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-action primary"
                    onClick={handleConfirmEnrollment}
                  >
                    Yes, Enroll Me
                  </button>
                </div>
              </>
            ) : (
              <div className="enrollment-success">
                <div className="success-icon"></div>
                <h3>Enrollment Successful!</h3>
                <p>You have been enrolled in {selectedCourse.title}</p>
                <p className="success-message">
                  Welcome to the course! Start learning and complete all modules to earn your certificate.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCoursesMarketplace;

