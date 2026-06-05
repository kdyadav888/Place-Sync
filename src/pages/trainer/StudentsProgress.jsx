import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentTable from '../../components/trainer/StudentTable';
import '../../styles/Trainer.css';

const StudentsProgress = () => {
  const navigate = useNavigate();
  const defaultStudents = [
    {
      id: 1,
      name: 'Arjun Mehta',
      email: 'arjun@example.com',
      avatar: null,
      joinedDate: 'Jan 15, 2024',
      progress: 85,
      status: 'active',
      enrolledCourses: [1, 2],
      attendance: 85,
      videosCompleted: 12,
      totalVideos: 15
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya@example.com',
      avatar: null,
      joinedDate: 'Jan 20, 2024',
      progress: 72,
      status: 'active',
      enrolledCourses: [1],
      attendance: 75,
      videosCompleted: 10,
      totalVideos: 15
    },
    {
      id: 3,
      name: 'Raj Kumar',
      email: 'raj@example.com',
      avatar: null,
      joinedDate: 'Jan 10, 2024',
      progress: 95,
      status: 'active',
      enrolledCourses: [1, 2, 3],
      attendance: 95,
      videosCompleted: 14,
      totalVideos: 15
    },
    {
      id: 4,
      name: 'Neha Patel',
      email: 'neha@example.com',
      avatar: null,
      joinedDate: 'Feb 1, 2024',
      progress: 60,
      status: 'active',
      enrolledCourses: [2],
      attendance: 65,
      videosCompleted: 8,
      totalVideos: 15
    },
    {
      id: 5,
      name: 'Amit Sharma',
      email: 'amit@example.com',
      avatar: null,
      joinedDate: 'Jan 25, 2024',
      progress: 40,
      status: 'inactive',
      enrolledCourses: [1],
      attendance: 40,
      videosCompleted: 5,
      totalVideos: 15
    }
  ];

  // Initialize state from localStorage or use default
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : defaultStudents;
  });

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newProgress, setNewProgress] = useState('');

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleViewProfile = (student) => {
    alert(`Student Profile\n\nName: ${student.name}\nEmail: ${student.email}\nProgress: ${student.progress}%\nStatus: ${student.status}\nJoined: ${student.joinedDate}`);
  };

  const handleSendMessage = (student) => {
    alert(`Send message to ${student.name}\nThis feature will be available soon!`);
  };

  const handleProfileClick = (student) => {
    navigate(`/student-dashboard/${student.id}`, { state: { student } });
  };

  const handleUpdateProgress = (student) => {
    setSelectedStudent(student);
    setNewProgress(student.progress.toString());
    setShowProgressModal(true);
  };

  const calculateProgressFromActivities = (student) => {
    const attendanceWeight = 0.4;
    const videoCompletionWeight = 0.6;
    
    const videoCompletionPercentage = (student.videosCompleted / student.totalVideos) * 100;
    const calculatedProgress = Math.round(
      (student.attendance * attendanceWeight) + (videoCompletionPercentage * videoCompletionWeight)
    );
    
    return calculatedProgress;
  };

  const handleSaveProgress = () => {
    if (!newProgress || isNaN(newProgress) || newProgress < 0 || newProgress > 100) {
      alert('Please enter a valid progress value between 0 and 100');
      return;
    }

    const updatedStudents = students.map(s =>
      s.id === selectedStudent.id 
        ? { 
            ...s, 
            progress: parseInt(newProgress),
            attendance: Math.round((parseInt(newProgress) * 0.4) / 0.4),
            videosCompleted: Math.round((parseInt(newProgress) * 0.6) / 0.6 / 100 * s.totalVideos)
          } 
        : s
    );
    setStudents(updatedStudents);
    setShowProgressModal(false);
    alert(`Progress updated for ${selectedStudent.name}!`);
  };

  const updateStudentAttendance = (studentId, newAttendance) => {
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        const videoCompletion = (s.videosCompleted / s.totalVideos) * 100;
        const newProgress = Math.round((newAttendance * 0.4) + (videoCompletion * 0.6));
        return { ...s, attendance: newAttendance, progress: newProgress };
      }
      return s;
    });
    setStudents(updatedStudents);
  };

  const updateVideoCompletion = (studentId, videosCompleted, totalVideos) => {
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        const videoCompletion = (videosCompleted / totalVideos) * 100;
        const newProgress = Math.round((s.attendance * 0.4) + (videoCompletion * 0.6));
        return { ...s, videosCompleted, totalVideos, progress: newProgress };
      }
      return s;
    });
    setStudents(updatedStudents);
  };

  const handleRemoveStudent = (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      setStudents(students.filter(s => s.id !== studentId));
      alert('Student removed successfully!');
    }
  };

  const calculateAverageProgress = () => {
    if (students.length === 0) return 0;
    const total = students.reduce((sum, s) => sum + s.progress, 0);
    return Math.round(total / students.length);
  };

  const calculateCompletionRate = () => {
    if (students.length === 0) return 0;
    const completed = students.filter(s => s.progress === 100).length;
    return Math.round((completed / students.length) * 100);
  };

  const activeStudents = students.filter(s => s.status === 'active').length;

  return (
    <div className="trainer-students-container">
      <div className="page-header glass-effect">
        <div>
          <h1>Students Progress</h1>
          <p>Track and monitor the progress of all your students</p>
        </div>
      </div>

      <div className="filter-section glass-effect">
        <label>Filter by Status:</label>
        <select className="filter-select">
          <option value="all">All Students</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="students-section glass-effect">
        <StudentTable
          students={students}
          onViewProfile={handleViewProfile}
          onSendMessage={handleSendMessage}
          onRemove={handleRemoveStudent}
          onProfileClick={handleProfileClick}
        />
      </div>

      {showProgressModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowProgressModal(false)}>
          <div className="modal-content progress-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Student Progress</h2>
              <button className="modal-close" onClick={() => setShowProgressModal(false)}></button>
            </div>
            <div className="modal-body">
              <p><strong>Student:</strong> {selectedStudent.name}</p>
              
              <div className="progress-info-card">
                <h3>Current Progress Breakdown</h3>
                <div className="progress-breakdown">
                  <div className="breakdown-item">
                    <div className="breakdown-label">
                      <span>Class Attendance</span>
                      <span className="weight-label">(40% weight)</span>
                    </div>
                    <div className="breakdown-bar">
                      <div className="breakdown-fill" style={{ width: `${selectedStudent.attendance}%` }}></div>
                    </div>
                    <span className="breakdown-value">{selectedStudent.attendance}%</span>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-label">
                      <span>Video Completion</span>
                      <span className="weight-label">(60% weight)</span>
                    </div>
                    <div className="breakdown-bar">
                      <div className="breakdown-fill" style={{ width: `${(selectedStudent.videosCompleted / selectedStudent.totalVideos) * 100}%` }}></div>
                    </div>
                    <span className="breakdown-value">{selectedStudent.videosCompleted}/{selectedStudent.totalVideos} videos ({Math.round((selectedStudent.videosCompleted / selectedStudent.totalVideos) * 100)}%)</span>
                  </div>
                  
                  <div className="breakdown-item total">
                    <div className="breakdown-label">
                      <strong>Overall Progress</strong>
                    </div>
                    <span className="breakdown-value-total">{selectedStudent.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Class Attendance (%)</label>
                <div className="input-with-value">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProgress}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setNewProgress(val.toString());
                      const videoCompletion = (selectedStudent.videosCompleted / selectedStudent.totalVideos) * 100;
                      const calculatedProgress = Math.round((val * 0.4) + (videoCompletion * 0.6));
                      setSelectedStudent({...selectedStudent, attendance: val, progress: calculatedProgress});
                    }}
                    className="form-input"
                  />
                  <span className="input-unit">%</span>
                </div>
              </div>

              <div className="form-group">
                <label>Videos Completed</label>
                <div className="input-with-value">
                  <input
                    type="number"
                    min="0"
                    max={selectedStudent.totalVideos}
                    defaultValue={selectedStudent.videosCompleted}
                    onChange={(e) => {
                      const completed = parseInt(e.target.value) || 0;
                      const videoCompletion = (completed / selectedStudent.totalVideos) * 100;
                      const calculatedProgress = Math.round((selectedStudent.attendance * 0.4) + (videoCompletion * 0.6));
                      setSelectedStudent({...selectedStudent, videosCompleted: completed, progress: calculatedProgress});
                      setNewProgress(calculatedProgress.toString());
                    }}
                    className="form-input"
                  />
                  <span className="input-unit">/ {selectedStudent.totalVideos}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowProgressModal(false)}>Cancel</button>
              <button className="btn-action primary" onClick={handleSaveProgress}>Save Progress</button>
            </div>
          </div>
        </div>
      )}

      <div className="progress-analytics glass-effect">
        <h2>Class Analytics</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Average Progress</h3>
            <p className="analytics-value">{calculateAverageProgress()}%</p>
            <div className="mini-chart"></div>
          </div>
          <div className="analytics-card">
            <h3>Completion Rate</h3>
            <p className="analytics-value">{calculateCompletionRate()}%</p>
            <div className="mini-chart"></div>
          </div>
          <div className="analytics-card">
            <h3>Active Students</h3>
            <p className="analytics-value">{activeStudents}/{students.length}</p>
            <div className="mini-chart"></div>
          </div>
          <div className="analytics-card">
            <h3>Engagement Score</h3>
            <p className="analytics-value">8.5/10</p>
            <div className="mini-chart"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsProgress;

