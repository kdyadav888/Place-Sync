import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import '../styles/Student.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { enrollments, getCompletedCourses, studentCertificates } = useStudent();
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    inProgress: 0,
    completed: 0,
    certificates: 0
  });

  useEffect(() => {
    const inProgressCourses = enrollments.filter(e => e.status === 'in-progress');
    const completedCourses = getCompletedCourses();

    setStats({
      totalEnrolled: enrollments.length,
      inProgress: inProgressCourses.length,
      completed: completedCourses.length,
      certificates: studentCertificates.length + completedCourses.length
    });
  }, [enrollments, getCompletedCourses, studentCertificates]);

  const recentEnrollments = enrollments.slice(-3).reverse();

  return (
    <div className="student-dashboard-container">
      {/* Header */}
      <div className="student-header glass-effect">
        <h1>Welcome to Your Learning Dashboard! </h1>
        <p>Continue your learning journey and achieve your goals</p>
      </div>

      {/* Quick Stats */}
      <div className="student-quick-stats glass-effect">
        <div className="stat-card">
          <div className="stat-icon"></div>
          <h3>Total Enrolled</h3>
          <p className="stat-number">{stats.totalEnrolled}</p>
          <button 
            className="stat-btn"
            onClick={() => navigate('/student-enrolled-courses')}
          >
            View All
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-icon"></div>
          <h3>In Progress</h3>
          <p className="stat-number">{stats.inProgress}</p>
          <button 
            className="stat-btn"
            onClick={() => navigate('/student-enrolled-courses')}
          >
            Continue
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-icon"></div>
          <h3>Completed</h3>
          <p className="stat-number">{stats.completed}</p>
          <button 
            className="stat-btn"
            onClick={() => navigate('/student-enrolled-courses')}
          >
            View
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-icon"></div>
          <h3>Certificates</h3>
          <p className="stat-number">{stats.certificates}</p>
          <button 
            className="stat-btn"
            onClick={() => navigate('/student-certificates')}
          >
            View Certificates
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="student-actions glass-effect">
        <button 
          className="action-btn primary"
          onClick={() => navigate('/student-marketplace')}
        >
          <span className="btn-icon">+</span> Explore New Courses
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => navigate('/student-enrolled-courses')}
        >
          <span className="btn-icon"></span> My Courses
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => navigate('/student-certificates')}
        >
          <span className="btn-icon"></span> My Certificates
        </button>
      </div>

      {/* Recent Activity */}
      {recentEnrollments.length > 0 && (
        <div className="recent-activity glass-effect">
          <h2>Recent Enrollments </h2>
          <div className="activity-list">
            {recentEnrollments.map(course => (
              <div key={course.id} className="activity-item">
                <div className="activity-icon">
                  {course.status === 'completed' ? '' : ''}
                </div>
                <div className="activity-content">
                  <h4>{course.title}</h4>
                  <p className="activity-level">{course.level}  {course.duration}</p>
                  <div className="activity-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{course.progress}% Complete</span>
                  </div>
                </div>
                <button 
                  className="activity-btn"
                  onClick={() => navigate('/student-enrolled-courses')}
                >
                  Continue 
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Tips */}
      <div className="learning-tips glass-effect">
        <h2> Learning Tips</h2>
        <ul className="tips-list">
          <li> Set specific learning goals for each course</li>
          <li> Complete modules regularly to maintain progress</li>
          <li> Interact with course materials actively</li>
          <li> Review completed modules before exams</li>
          <li> Download your certificates once you complete courses</li>
        </ul>
      </div>

      {/* Call to Action */}
      {stats.totalEnrolled === 0 && (
        <div className="cta-section glass-effect">
          <div className="cta-content">
            <h2>Start Your Learning Journey Today!</h2>
            <p>Browse our wide selection of courses and start learning from expert trainers.</p>
            <button 
              className="btn-action primary"
              onClick={() => navigate('/student-marketplace')}
            >
              Explore Courses Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

