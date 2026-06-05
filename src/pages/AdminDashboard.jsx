import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../utils/api';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  
  const { user, token } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/dashboard';
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll({ Authorization: `Bearer ${token}` });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
        setStats({
          totalUsers: data.total,
          totalJobs: 0,
          totalApplications: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage PlaceSync Platform</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <p className="stat-number">{stats.totalJobs}</p>
        </div>
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p className="stat-number">{stats.totalApplications}</p>
        </div>
      </div>

      <div className="admin-section">
        <h2>Users</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="role-badge">{u.role}</span>
                </td>
                <td>
                  <button className="btn-apply">View</button>
                  <button className="btn-reject">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

