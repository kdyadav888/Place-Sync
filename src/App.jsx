import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TrainerProvider } from './context/TrainerContext';
import { StudentProvider } from './context/StudentContext';
import Navbar from './components/Navbar';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import JobListings from './pages/JobListings';
import ApplicationForms from './pages/ApplicationForms';
import JobFeed from './pages/JobFeed';
import SavedJobs from './pages/SavedJobs';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import CompanyPage from './pages/CompanyPage';
import Connections from './pages/Connections';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterProfile from './pages/RecruiterProfile';
import EditProfile from './pages/EditProfile';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import Applicants from './pages/Applicants';
import SearchStudents from './pages/SearchStudents';
import Interviews from './pages/Interviews';
import RecruiterMessages from './pages/RecruiterMessages';
import RecruiterAnalytics from './pages/RecruiterAnalytics';
import RecruiterNotifications from './pages/RecruiterNotifications';
import RecruiterSettings from './pages/RecruiterSettings';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerProfile from './pages/trainer/TrainerProfile';
import MyCourses from './pages/trainer/MyCourses';
import Workshops from './pages/trainer/Workshops';
import MockInterviews from './pages/trainer/MockInterviews';
import StudentsProgress from './pages/trainer/StudentsProgress';
import AddCourse from './pages/trainer/AddCourse';
import AddWorkshop from './pages/trainer/AddWorkshop';
import ScheduleInterview from './pages/trainer/ScheduleInterview';
import Certificates from './pages/trainer/Certificates';
import IssueCertificate from './pages/trainer/IssueCertificate';
import StudentDashboard from './pages/StudentDashboard';
import StudentCoursesMarketplace from './pages/StudentCoursesMarketplace';
import StudentEnrolledCourses from './pages/StudentEnrolledCourses';
import StudentCertificates from './pages/StudentCertificates';
import './App.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <TrainerProvider>
          <StudentProvider>
            <div className="app-container">
              <Navbar />
              <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginRegister />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                
                {/* Student Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<JobListings />} />
                <Route path="/job-feed" element={<JobFeed />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
                <Route path="/applications" element={<ApplicationForms />} />
                
                <Route path="/profile/:userId" element={<UserProfile />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                
                <Route path="/company/:companyId" element={<CompanyPage />} />
                
                {/* Recruiter Routes */}
                <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter-profile" element={<RecruiterProfile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/manage-jobs" element={<ManageJobs />} />
                <Route path="/applicants" element={<Applicants />} />
                <Route path="/search-students" element={<SearchStudents />} />
                <Route path="/interviews" element={<Interviews />} />
                <Route path="/recruiter-messages" element={<RecruiterMessages />} />
                <Route path="/recruiter-analytics" element={<RecruiterAnalytics />} />
                <Route path="/recruiter-notifications" element={<RecruiterNotifications />} />
                <Route path="/recruiter-settings" element={<RecruiterSettings />} />
                
                {/* Trainer Routes */}
                <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
                <Route path="/trainer-profile" element={<TrainerProfile />} />
                <Route path="/trainer-courses" element={<MyCourses />} />
                <Route path="/trainer-add-course" element={<AddCourse />} />
                <Route path="/trainer-workshops" element={<Workshops />} />
                <Route path="/trainer-add-workshop" element={<AddWorkshop />} />
                <Route path="/trainer-interviews" element={<MockInterviews />} />
                <Route path="/trainer-schedule-interview" element={<ScheduleInterview />} />
                <Route path="/trainer-students" element={<StudentsProgress />} />
                <Route path="/trainer-certificates" element={<Certificates />} />
                <Route path="/trainer-add-certificate" element={<IssueCertificate />} />
                <Route path="/trainer-issue-certificate" element={<IssueCertificate />} />
                
                {/* Student Learning Routes */}
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/student-marketplace" element={<StudentCoursesMarketplace />} />
                <Route path="/student-enrolled-courses" element={<StudentEnrolledCourses />} />
                <Route path="/student-certificates" element={<StudentCertificates />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
            </div>
          </StudentProvider>
        </TrainerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

