import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const RecruiterNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { token } = useAuth();

  // Demo recruiter notifications (Indian data)
  const demoNotifications = [
    {
      _id: 'rn1',
      type: 'Application',
      title: 'New Application - Rajesh Kumar',
      message: 'Rajesh Kumar applied for Senior Full Stack Developer position. Review his profile.',
      applicantName: 'Rajesh Kumar',
      applicantEmail: 'rajesh.kumar@gmail.com',
      jobTitle: 'Senior Full Stack Developer - MERN Stack',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      _id: 'rn2',
      type: 'Application',
      title: 'New Application - Priya Singh',
      message: 'Priya Singh applied for Senior Full Stack Developer. Experience: 6 years.',
      applicantName: 'Priya Singh',
      applicantEmail: 'priya.singh@gmail.com',
      jobTitle: 'Senior Full Stack Developer - MERN Stack',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      _id: 'rn3',
      type: 'Hiring',
      title: 'Job Posted Successfully',
      message: 'Your job posting "React Frontend Engineer" is now live and visible to candidates.',
      jobTitle: 'React Frontend Engineer',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      _id: 'rn4',
      type: 'System',
      title: 'Profile Update Suggested',
      message: 'Complete your company profile to attract more quality candidates. Add company description and benefits.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      _id: 'rn5',
      type: 'Application',
      title: 'Application Status Update - Arjun Patel',
      message: 'Arjun Patel has accepted your interview invitation for Senior Full Stack Developer role.',
      applicantName: 'Arjun Patel',
      applicantEmail: 'arjun.patel@gmail.com',
      jobTitle: 'Senior Full Stack Developer - MERN Stack',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ];

  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('recruiterNotifications') || '[]');
    if (savedNotifications.length === 0) {
      setNotifications(demoNotifications);
      localStorage.setItem('recruiterNotifications', JSON.stringify(demoNotifications));
    } else {
      setNotifications(savedNotifications);
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.notifications) {
        setNotifications((data.notifications || []).reverse());
      }
    } catch (error) {
      console.error('Error fetching notifications (using demo data):', error);
      // Use demo data on error
      setNotifications(demoNotifications);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Update state immediately
      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      ));

      // Update localStorage
      const updated = JSON.parse(localStorage.getItem('recruiterNotifications') || '[]').map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      );
      localStorage.setItem('recruiterNotifications', JSON.stringify(updated));

      // Try API call
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error marking as read (change already saved locally):', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      localStorage.setItem('recruiterNotifications', JSON.stringify(updated));

      await fetch('/api/notifications/read/all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error marking all as read (change already saved locally):', error);
    }
  };

  const filteredNotifications = 
    filter === 'unread' 
      ? notifications.filter(n => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="recruiter-notifications-container">
      <div className="notifications-header">
        <h1> Recruiter Notifications</h1>
        <div className="header-actions">
          {unreadCount > 0 && (
            <>
              <span className="unread-count">{unreadCount} new</span>
              <button onClick={handleMarkAllAsRead} className="btn-mark-all">
                Mark all as read
              </button>
            </>
          )}
        </div>
      </div>

      <div className="notification-filter">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="loading"> Loading notifications...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="no-data">
          <p> {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notif) => (
            <div
              key={notif._id}
              className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
              onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
            >
              <div className="notification-content">
                <h4>{notif.title}</h4>
                <p>{notif.message}</p>
                {notif.applicantName && (
                  <p className="notification-details">
                     {notif.applicantName} ({notif.applicantEmail})
                  </p>
                )}
                {notif.jobTitle && (
                  <p className="notification-job"> {notif.jobTitle}</p>
                )}
                <span className="notification-date">
                  {new Date(notif.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              {!notif.isRead && <span className="unread-dot"></span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterNotifications;

