import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      // API call to fetch courses
      setCourses([
        { id: 1, title: 'React Basics', students: 45, status: 'active', progress: 60 },
        { id: 2, title: 'Web Development', students: 32, status: 'active', progress: 45 },
        { id: 3, title: 'JavaScript Advanced', students: 28, status: 'completed', progress: 100 },
      ]);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (filter === 'all') return true;
    return course.status === filter;
  });

  return (
    <div className="my-courses-container">
      <div className="page-header">
        <h1>My Courses</h1>
        <button onClick={() => navigate('/trainer/add-course')} className="btn btn-primary">
           Add New Course
        </button>
      </div>

      <div className="filter-section">
        <label>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Courses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.length === 0 ? (
            <div className="empty-state">
              <p>No courses found. Create your first course!</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <span className={`status-badge ${course.status}`}>{course.status}</span>
                </div>
                <div className="course-info">
                  <p> {course.students} Students</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                  </div>
                  <p className="progress-text">{course.progress}% Complete</p>
                </div>
                <div className="course-actions">
                  <button className="btn btn-secondary btn-small">View</button>
                  <button className="btn btn-secondary btn-small">Edit</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyCourses;

