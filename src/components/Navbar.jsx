import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Components.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditProfile = () => {
    setShowProfileDropdown(false);
    navigate('/edit-profile');
  };

  // Determine if we're on a trainer route
  const isTrainerRoute = location.pathname.includes('trainer');

  // Student/Default Navigation
  const studentNavLinks = () => (
    <>
      <Link to="/jobs" className="nav-link">Jobs</Link>
      <Link to="/saved-jobs" className="nav-link">Saved</Link>
      <Link to="/applications" className="nav-link">Applications</Link>
      <Link to="/connections" className="nav-link">Connections</Link>
      <Link to="/messages" className="nav-link">Messages</Link>
      <Link to="/notifications" className="nav-link">Notifications</Link>
    </>
  );

  // Recruiter Navigation
  const recruiterNavLinks = () => (
    <div className="recruiter-nav-links">
      <Link to="/recruiter-dashboard" className="nav-link">Dashboard</Link>
      <Link to="/post-job" className="nav-link">Post Job</Link>
      <Link to="/manage-jobs" className="nav-link">Manage Jobs</Link>
      <Link to="/applicants" className="nav-link">Applicants</Link>
      <Link to="/search-students" className="nav-link">Search Students</Link>
      <Link to="/interviews" className="nav-link">Interviews</Link>
      <Link to="/recruiter-messages" className="nav-link">Messages</Link>
      <Link to="/recruiter-analytics" className="nav-link">Analytics</Link>
      <Link to="/recruiter-notifications" className="nav-link">Notifications</Link>
      <Link to="/recruiter-settings" className="nav-link">Settings</Link>
    </div>
  );

  // Trainer Navigation
  const trainerNavLinks = () => (
    <div className="trainer-nav-links">
      <Link to="/trainer-dashboard" className="nav-link">Dashboard</Link>
      <Link to="/trainer-courses" className="nav-link">Courses</Link>
      <Link to="/trainer-add-course" className="nav-link">Add Course</Link>
      <Link to="/trainer-workshops" className="nav-link">Workshops</Link>
      <Link to="/trainer-interviews" className="nav-link">Interviews</Link>
      <Link to="/trainer-students" className="nav-link">Students</Link>
      <Link to="/trainer-certificates" className="nav-link">Certificates</Link>
    </div>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          PlaceSync
        </Link>

        <button 
          className="menu-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          
        </button>

        <div className={`nav-menu ${showMenu ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              {user?.role === 'recruiter' ? recruiterNavLinks() : (user?.role === 'trainer' || isTrainerRoute) ? trainerNavLinks() : studentNavLinks()}
              
              <div className="nav-user">
                {user?.role === 'recruiter' || user?.role === 'trainer' || isTrainerRoute ? (
                  <div className="profile-dropdown-container">
                    <button 
                      className="profile-btn"
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      title="User Profile"
                    >
                      {user?.name}
                    </button>
                    {showProfileDropdown && (
                      <div className="profile-dropdown-menu">
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            setShowProfileDropdown(false);
                            navigate(user?.role === 'trainer' || isTrainerRoute ? '/trainer-profile' : '/edit-profile');
                          }}
                        >
                          Edit Profile
                        </button>
                        <button 
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link to={`/profile/${user?._id || user?.id}`} className="nav-link">
                      {user?.name}
                    </Link>
                    <button onClick={handleLogout} className="btn-logout">
                      Logout
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


