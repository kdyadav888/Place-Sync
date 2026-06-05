import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [studentCertificates, setStudentCertificates] = useState([]);
  const [enrollmentHistory, setEnrollmentHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedEnrollments = localStorage.getItem('studentEnrollments');
      const storedCertificates = localStorage.getItem('studentCertificates');
      const storedHistory = localStorage.getItem('enrollmentHistory');

      if (storedEnrollments) setEnrollments(JSON.parse(storedEnrollments));
      if (storedCertificates) setStudentCertificates(JSON.parse(storedCertificates));
      if (storedHistory) setEnrollmentHistory(JSON.parse(storedHistory));
    } catch (error) {
      console.error('Error loading student data from localStorage:', error);
    }
  }, []);

  // Save enrollments to localStorage
  useEffect(() => {
    if (enrollments.length > 0) {
      localStorage.setItem('studentEnrollments', JSON.stringify(enrollments));
    }
  }, [enrollments]);

  // Save certificates to localStorage
  useEffect(() => {
    if (studentCertificates.length > 0) {
      localStorage.setItem('studentCertificates', JSON.stringify(studentCertificates));
    }
  }, [studentCertificates]);

  // Save enrollment history to localStorage
  useEffect(() => {
    if (enrollmentHistory.length > 0) {
      localStorage.setItem('enrollmentHistory', JSON.stringify(enrollmentHistory));
    }
  }, [enrollmentHistory]);

  // Enroll student in a course/workshop
  const enrollStudent = (courseId, courseData) => {
    const enrollment = {
      id: enrollments.length + 1,
      courseId,
      ...courseData,
      enrolledDate: new Date().toISOString(),
      progress: 0,
      status: 'in-progress',
      completionDate: null,
      modules: courseData.modules || 0,
      completedModules: 0
    };

    setEnrollments([...enrollments, enrollment]);

    // Add to history
    setEnrollmentHistory([...enrollmentHistory, {
      ...enrollment,
      action: 'enrolled',
      timestamp: new Date().toISOString()
    }]);

    return enrollment;
  };

  // Update enrollment progress
  const updateProgress = (enrollmentId, completedModules) => {
    setEnrollments(enrollments.map(e => {
      if (e.id === enrollmentId) {
        const progress = Math.round((completedModules / e.modules) * 100);
        const status = progress === 100 ? 'completed' : 'in-progress';
        return {
          ...e,
          completedModules,
          progress,
          status,
          completionDate: status === 'completed' ? new Date().toISOString() : null
        };
      }
      return e;
    }));
  };

  // Add student certificate
  const addStudentCertificate = (certificateData) => {
    const certificate = {
      id: studentCertificates.length + 1,
      ...certificateData,
      receivedDate: new Date().toISOString(),
      verified: true
    };

    setStudentCertificates([...studentCertificates, certificate]);

    // Add to history
    setEnrollmentHistory([...enrollmentHistory, {
      ...certificate,
      action: 'certificate-received',
      timestamp: new Date().toISOString()
    }]);

    return certificate;
  };

  // Get student's enrolled courses
  const getEnrolledCourses = () => {
    return enrollments;
  };

  // Get student's certificates
  const getStudentCertificates = () => {
    return studentCertificates;
  };

  // Check if student is enrolled in a course
  const isEnrolledInCourse = (courseId) => {
    return enrollments.some(e => e.courseId === courseId);
  };

  // Get enrollment details
  const getEnrollment = (enrollmentId) => {
    return enrollments.find(e => e.id === enrollmentId);
  };

  // Get completed courses
  const getCompletedCourses = () => {
    return enrollments.filter(e => e.status === 'completed');
  };

  return (
    <StudentContext.Provider
      value={{
        enrollments,
        setEnrollments,
        studentCertificates,
        setStudentCertificates,
        enrollmentHistory,
        loading,
        setLoading,
        enrollStudent,
        updateProgress,
        addStudentCertificate,
        getEnrolledCourses,
        getStudentCertificates,
        isEnrolledInCourse,
        getEnrollment,
        getCompletedCourses
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within StudentProvider');
  }
  return context;
};
