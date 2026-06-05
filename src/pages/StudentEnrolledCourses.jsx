import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import '../styles/Student.css';

const StudentEnrolledCourses = () => {
  const navigate = useNavigate();
  const { enrollments, updateProgress, getCompletedCourses } = useStudent();
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let filtered = enrollments;

    if (selectedFilter === 'completed') {
      filtered = enrollments.filter(e => e.status === 'completed');
    } else if (selectedFilter === 'in-progress') {
      filtered = enrollments.filter(e => e.status === 'in-progress');
    }

    setFilteredEnrollments(filtered);
  }, [selectedFilter, enrollments]);

  const handleUpdateProgress = (enrollmentId, newProgress) => {
    setUpdatingId(enrollmentId);
    setTimeout(() => {
      updateProgress(enrollmentId, newProgress);
      setUpdatingId(null);
    }, 800);
  };

  const completedCourses = getCompletedCourses();
  const inProgressCourses = enrollments.filter(e => e.status === 'in-progress');

  return (
    <div className="student-enrolled-courses-container">
      {/* Header */}
      <div className="student-page-header glass-effect">
        <div>
          <h1> My Courses</h1>
          <p>Manage your enrolled courses and track progress</p>
        </div>
        <button 
          className="btn-action primary"
          onClick={() => navigate('/student-marketplace')}
        >
          + Explore More Courses
        </button>
      </div>

      {/* Stats */}
      <div className="student-stats glass-effect">
        <div className="stat-item">
          <span className="stat-number">{enrollments.length}</span>
          <span className="stat-label">Total Enrolled</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{inProgressCourses.length}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{completedCourses.length}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-section glass-effect">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All Courses ({enrollments.length})
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('in-progress')}
          >
            In Progress ({inProgressCourses.length})
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('completed')}
          >
             Completed ({completedCourses.length})
          </button>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="enrolled-courses-list">
        {filteredEnrollments.length > 0 ? (
          filteredEnrollments.map(enrollment => (
            <div key={enrollment.id} className="enrolled-course-card">
              <div className="course-info-section">
                <div className="course-header">
                  <h3>{enrollment.title}</h3>
                  <div className={`status-badge ${enrollment.status}`}>
                    {enrollment.status === 'completed' ? ' Completed' : ' In Progress'}
                  </div>
                </div>

                <p className="course-description">{enrollment.description}</p>

                <div className="course-details">
                  <div className="detail">
                    <span className="label">Enrolled:</span>
                    <span className="value">
                      {new Date(enrollment.enrolledDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="detail">
                    <span className="label">Level:</span>
                    <span className="value">{enrollment.level}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Duration:</span>
                    <span className="value">{enrollment.duration}</span>
                  </div>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <span className="progress-label">Progress</span>
                  <span className="progress-percentage">{enrollment.progress}%</span>
                </div>

                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>

                <div className="modules-info">
                  <span>
                    {enrollment.completedModules} of {enrollment.modules} modules completed
                  </span>
                </div>

                {enrollment.status === 'in-progress' && (
                  <div className="progress-controls">
                    <button
                      className="btn-progress"
                      onClick={() => handleUpdateProgress(
                        enrollment.id,
                        Math.min(enrollment.completedModules + 1, enrollment.modules)
                      )}
                      disabled={updatingId === enrollment.id || enrollment.completedModules >= enrollment.modules}
                    >
                      {updatingId === enrollment.id ? ' Updating...' : '+ Complete Module'}
                    </button>
                    {enrollment.completedModules === enrollment.modules && (
                      <button
                        className="btn-celebrate"
                        onClick={() => navigate('/student-certificates')}
                      >
                         View Certificate
                      </button>
                    )}
                  </div>
                )}

                {enrollment.status === 'completed' && (
                  <div className="completion-info">
                    <div className="completed-date">
                       Completed on{' '}
                      {new Date(enrollment.completionDate).toLocaleDateString('en-IN')}
                    </div>
                    <button
                      className="btn-certificate"
                      onClick={() => navigate('/student-certificates')}
                    >
                       View Certificate
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state glass-effect">
            <div className="empty-icon"></div>
            <h3>No courses in this category</h3>
            <p>
              {selectedFilter === 'completed'
                ? 'You have not completed any courses yet.'
                : 'Start by enrolling in a course to begin learning!'}
            </p>
            <button 
              className="btn-action primary"
              onClick={() => navigate('/student-marketplace')}
            >
              Explore Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnrolledCourses;

