import React from 'react';
import { Route } from 'react-router-dom';
import TrainerDashboard from '../pages/trainer/TrainerDashboard';
import TrainerProfile from '../pages/trainer/TrainerProfile';
import MyCourses from '../pages/trainer/MyCourses';
import Workshops from '../pages/trainer/Workshops';
import AddCourse from '../pages/trainer/AddCourse';
import AddWorkshop from '../pages/trainer/AddWorkshop';
import MockInterviews from '../pages/trainer/MockInterviews';
import StudentsProgress from '../pages/trainer/StudentsProgress';
import Certificates from '../pages/trainer/Certificates';
import TrainerMessages from '../pages/TrainerMessages';

export const TrainerRoutes = (
  <>
    <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
    <Route path="/trainer-profile" element={<TrainerProfile />} />
    <Route path="/trainer-courses" element={<MyCourses />} />
    <Route path="/trainer-add-course" element={<AddCourse />} />
    <Route path="/trainer-workshops" element={<Workshops />} />
    <Route path="/trainer-add-workshop" element={<AddWorkshop />} />
    <Route path="/trainer-interviews" element={<MockInterviews />} />
    <Route path="/trainer-students" element={<StudentsProgress />} />
    <Route path="/trainer-certificates" element={<Certificates />} />
    <Route path="/trainer-messages" element={<TrainerMessages />} />
  </>
);
