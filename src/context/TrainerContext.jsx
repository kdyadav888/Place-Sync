import React, { createContext, useContext, useState } from 'react';

const TrainerContext = createContext();

export const TrainerProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <TrainerContext.Provider value={{
      courses, setCourses,
      workshops, setWorkshops,
      interviews, setInterviews,
      certificates, setCertificates,
      students, setStudents,
      loading, setLoading
    }}>
      {children}
    </TrainerContext.Provider>
  );
};

export const useTrainer = () => {
  const context = useContext(TrainerContext);
  if (!context) {
    throw new Error('useTrainer must be used within TrainerProvider');
  }
  return context;
};
