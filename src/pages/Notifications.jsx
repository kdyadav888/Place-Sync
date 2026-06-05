import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI } from '../utils/api';
import '../styles/Dashboard.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const { token } = useAuth();

  // Demo Indian notification data
  const demoNotifications = [
    {
      _id: 'notif1',
      type: 'Application',
      title: 'Application Update - TechVision India',
      message: 'Your application for Senior Full Stack Developer has been reviewed and moved to the next round.',
      fromName: 'TechVision India Pvt Ltd',
      fromEmail: 'hr@techvision.in',
      fromAvatar: '',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      status: 'new',
    },
    {
      _id: 'notif2',
      type: 'Connection',
      title: 'Connection Request from Rajesh Kumar',
      message: 'Rajesh Kumar wants to connect with you. He is a Senior Developer at Infosys.',
      fromName: 'Rajesh Kumar',
      fromEmail: 'rajesh.kumar@example.com',
      fromAvatar: '',
      connectionId: 'conn1',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      status: 'pending',
    },
    {
      _id: 'notif3',
      type: 'Job',
      title: 'New Job Match - React Developer at Infosys',
      message: 'A new job matching your profile has been posted: React Developer, Bangalore, 15-18 LPA',
      fromName: 'Infosys Limited',
      fromEmail: 'careers@infosys.com',
      fromAvatar: '',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      status: 'new',
    },
    {
      _id: 'notif4',
      type: 'Message',
      title: 'New Message from Priya Singh',
      message: 'You have received a new message about the internship opportunity.',
      fromName: 'Priya Singh',
      fromEmail: 'priya.singh@example.com',
      fromAvatar: '',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      status: 'new',
    },
    {
      _id: 'notif5',
      type: 'Connection',
      title: 'Connection Request Accepted - Arjun Patel',
      message: 'Arjun Patel accepted your connection request.',
      fromName: 'Arjun Patel',
      fromEmail: 'arjun.patel@example.com',
      fromAvatar: '',
      connectionId: 'conn2',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      status: 'accepted',
    },
  ];

  useEffect(() => {
    console.log('Notifications mounted, loading data...');
    // Load from localStorage immediately on mount
    const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    
    // If we have saved notifications, use them; otherwise use demo
    if (savedNotifications.length === 0 && receivedConnections.length === 0) {
      setNotifications(demoNotifications);
      localStorage.setItem('notifications', JSON.stringify(demoNotifications));
    } else {
      fetchNotifications();
    }
    
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getAll({ Authorization: `Bearer ${token}` });
      const data = await response.json();
      
      if (data.success) {
        let allNotifications = (data.notifications || []).reverse();
        
        // Also add received connection requests from localStorage (demo mode)
        const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
        const connectionNotifications = receivedConnections.map(conn => ({
          _id: conn.id,
          type: 'Connection',
          title: conn.title,
          message: conn.message,
          fromId: conn.fromId,
          fromName: conn.fromName,
          fromEmail: conn.fromEmail,
          fromAvatar: conn.fromAvatar,
          connectionId: conn.connectionId,
          status: conn.status,
          createdAt: conn.createdAt,
          isRead: conn.isRead || false,
        }));
        
        // Combine API notifications with localStorage connection notifications
        allNotifications = [...connectionNotifications, ...allNotifications];
        setNotifications(allNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Fallback to localStorage only
      const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
      const connectionNotifications = receivedConnections.map(conn => ({
        _id: conn.id,
        type: 'Connection',
        title: conn.title,
        message: conn.message,
        fromId: conn.fromId,
        fromName: conn.fromName,
        fromEmail: conn.fromEmail,
        fromAvatar: conn.fromAvatar,
        connectionId: conn.connectionId,
        status: conn.status,
        createdAt: conn.createdAt,
        isRead: conn.isRead || false,
      }));
      
      setNotifications(connectionNotifications);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    // Update localStorage and state IMMEDIATELY
    const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
    const updated = receivedConnections.map(conn =>
      conn.id === notificationId ? { ...conn, isRead: true } : conn
    );
    localStorage.setItem('receivedConnections', JSON.stringify(updated));
    
    setNotifications(notifications.map(n =>
      n._id === notificationId ? { ...n, isRead: true } : n
    ));
    
    // Try API call (but already saved locally)
    try {
      await notificationsAPI.markAsRead(notificationId, { Authorization: `Bearer ${token}` });
    } catch (error) {
      console.log('API error (expected in demo mode), change already saved locally:', error.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    // Update localStorage and state IMMEDIATELY
    const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
    const updated = receivedConnections.map(conn => ({ ...conn, isRead: true }));
    localStorage.setItem('receivedConnections', JSON.stringify(updated));
    
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    
    // Try API call (but already saved locally)
    try {
      await fetch('/api/notifications/read/all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log('API error (expected in demo mode), change already saved locally:', error.message);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    // Remove from localStorage and state IMMEDIATELY
    const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
    const updated = receivedConnections.filter(conn => conn.id !== notificationId);
    localStorage.setItem('receivedConnections', JSON.stringify(updated));
    
    setNotifications(notifications.filter(n => n._id !== notificationId));
    
    // Try API call (but already saved locally)
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log('API error (expected in demo mode), change already saved locally:', error.message);
    }
  };

  // Handle connection request acceptance
  const handleAcceptConnection = async (notification) => {
    // Update localStorage IMMEDIATELY and synchronously
    const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
    const updated = receivedConnections.map(conn =>
      conn.id === notification._id ? { ...conn, status: 'accepted' } : conn
    );
    localStorage.setItem('receivedConnections', JSON.stringify(updated));
    console.log('Connection accepted, saved to localStorage:', updated);
    
    // Update state immediately
    setNotifications(notifications.map(n =>
      n._id === notification._id ? { ...n, status: 'accepted', isRead: true } : n
    ));
    
    alert(` Connection accepted with ${notification.fromName}!`);
    
    // Try API call (but already saved locally)
    try {
      const response = await fetch(`/api/connections/${notification.connectionId}/accept`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.log('API update failed, but change already saved locally');
      }
    } catch (error) {
      console.log('API error (expected in demo mode), change already saved locally:', error.message);
    }
  };

  // Handle connection request rejection
  const handleRejectConnection = async (notification) => {
    if (!window.confirm('Reject this connection request?')) return;
    
    // Update localStorage IMMEDIATELY and synchronously
    const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
    const updated = receivedConnections.map(conn =>
      conn.id === notification._id ? { ...conn, status: 'rejected' } : conn
    );
    localStorage.setItem('receivedConnections', JSON.stringify(updated));
    console.log('Connection rejected, saved to localStorage:', updated);
    
    // Update state immediately
    setNotifications(notifications.map(n =>
      n._id === notification._id ? { ...n, status: 'rejected', isRead: true } : n
    ));
    
    alert(`Rejected connection from ${notification.fromName}`);
    
    // Try API call (but already saved locally)
    try {
      const response = await fetch(`/api/connections/${notification.connectionId}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.log('API update failed, but change already saved locally');
      }
    } catch (error) {
      console.log('API error (expected in demo mode), change already saved locally:', error.message);
    }
  };

  // Update notification status
  const updateNotificationStatus = (notificationId, status) => {
    setNotifications(notifications.map(n =>
      n._id === notificationId ? { ...n, status, isRead: true } : n
    ));
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'Connection': '',
      'Application': 'A',
      'Message': 'M',
      'Job': '',
      'Profile': '',
      'Review': '',
      'Accepted': '',
      'Rejected': '',
    };
    return icons[type] || '';
  };

  const getNotificationColor = (type) => {
    const colors = {
      'Connection': '#3b82f6',
      'Application': '#f59e0b',
      'Message': '#06b6d4',
      'Job': '#10b981',
      'Profile': '#8b5cf6',
      'Review': '#f97316',
      'Accepted': '#22c55e',
      'Rejected': '#ef4444',
    };
    return colors[type] || '#6b7280';
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading && notifications.length === 0) {
    return <div className="loading">Loading notifications...</div>;
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1> Notifications</h1>
        <div className="header-actions">
          {unreadCount > 0 && (
            <span className="unread-count">{unreadCount} new</span>
          )}
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="btn-mark-all">
              Mark all as read
            </button>
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

      {filteredNotifications.length === 0 ? (
        <div className="no-notifications">
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
              <div
                className="notification-icon"
                style={{ backgroundColor: getNotificationColor(notif.type) }}
              >
                {getNotificationIcon(notif.type)}
              </div>

              <div className="notification-content">
                <h4>{notif.title}</h4>
                <p>{notif.message}</p>
                {notif.fromName && (
                  <p className="notification-from">From: {notif.fromName} ({notif.fromEmail})</p>
                )}
                <span className="notification-time">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="notification-actions">
                {notif.type === 'Connection' && notif.status === 'pending' && (
                  <div className="connection-actions">
                    <button
                      className="btn-accept"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptConnection(notif);
                      }}
                    >
                       Accept
                    </button>
                    <button
                      className="btn-reject"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRejectConnection(notif);
                      }}
                    >
                       Reject
                    </button>
                  </div>
                )}
                {notif.type === 'Connection' && notif.status !== 'pending' && (
                  <span className={`status-badge ${notif.status}`}>
                    {notif.status === 'accepted' ? ' Accepted' : ' Rejected'}
                  </span>
                )}
                <div className="notification-controls">
                  {!notif.isRead && (
                    <div className="unread-indicator"></div>
                  )}
                  <button
                    className="btn-delete-notif"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notif._id);
                    }}
                  >
                    
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;




