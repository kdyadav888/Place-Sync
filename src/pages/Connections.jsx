import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { connectionsAPI } from '../utils/api';
import '../styles/Dashboard.css';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('connections');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load from localStorage immediately
    const sentConnections = JSON.parse(localStorage.getItem('sentConnections') || '[]');
    const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
    
    fetchConnections();
    fetchPendingRequests();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await connectionsAPI.getAll({ Authorization: `Bearer ${token}` });
      const data = await response.json();
      
      if (data.success) {
        setConnections(data.connections || []);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (error) {
      console.error('Error fetching connections from API, using localStorage:', error);
      
      // Fallback to localStorage
      const sentConnections = JSON.parse(localStorage.getItem('sentConnections') || '[]');
      const formattedConnections = sentConnections
        .filter(conn => conn.status === 'accepted' || !conn.status)
        .map(conn => ({
          _id: conn.id || Date.now(),
          name: conn.targetName || 'Unknown',
          email: conn.targetEmail || '',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg',
          connectedAt: conn.sentAt,
        }));
      
      setConnections(formattedConnections);
      console.log('Loaded connections from localStorage:', formattedConnections);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await connectionsAPI.getPending({ Authorization: `Bearer ${token}` });
      const data = await response.json();
      
      if (data.success) {
        setPendingRequests(data.requests || []);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (error) {
      console.error('Error fetching pending requests from API, using localStorage:', error);
      
      // Fallback to localStorage - check both sentConnections and receivedConnections
      let pendingFromStorage = [];
      
      // Check sentConnections (outgoing)
      const sentConnections = JSON.parse(localStorage.getItem('sentConnections') || '[]');
      const sentPending = sentConnections
        .filter(conn => conn.status === 'pending')
        .map(conn => ({
          _id: conn.id || Date.now(),
          senderId: conn.targetId,
          senderName: conn.targetName || 'Unknown',
          senderEmail: conn.targetEmail || '',
          senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg',
          createdAt: conn.sentAt,
        }));
      
      // Check receivedConnections (incoming)
      const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
      const receivedPending = receivedConnections
        .filter(conn => conn.status === 'pending')
        .map(conn => ({
          _id: conn.id || Date.now(),
          senderId: conn.fromId,
          senderName: conn.fromName || 'Unknown',
          senderEmail: conn.fromEmail || '',
          senderAvatar: conn.fromAvatar || 'https://api.dicebear.com/7.x/avataaars/svg',
          createdAt: conn.createdAt,
        }));
      
      pendingFromStorage = [...receivedPending, ...sentPending];
      setPendingRequests(pendingFromStorage);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId, senderId) => {
    // Update localStorage IMMEDIATELY and synchronously
    const sentConnections = JSON.parse(localStorage.getItem('sentConnections') || '[]');
    const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
    
    const updatedSent = sentConnections.map(conn => 
      conn.id === requestId ? { ...conn, status: 'accepted' } : conn
    );
    const updatedReceived = receivedConnections.map(conn => 
      conn.id === requestId ? { ...conn, status: 'accepted' } : conn
    );
    
    localStorage.setItem('sentConnections', JSON.stringify(updatedSent));
    localStorage.setItem('receivedConnections', JSON.stringify(updatedReceived));
    
    // Update state immediately
    fetchPendingRequests();
    fetchConnections();
    alert(' Connection request accepted!');
    
    // Try API call (but already saved locally)
    try {
      const response = await connectionsAPI.accept(requestId, { Authorization: `Bearer ${token}` });
      if (!response.ok) {
        // API update failed, but change already saved locally
      }
    } catch (error) {
      // API error (expected in demo mode), change already saved locally
    }
  };

  const handleRejectRequest = async (requestId) => {
    // Update localStorage IMMEDIATELY and synchronously
    const sentConnections = JSON.parse(localStorage.getItem('sentConnections') || '[]');
    const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
    
    const updatedSent = sentConnections.map(conn => 
      conn.id === requestId ? { ...conn, status: 'rejected' } : conn
    );
    const updatedReceived = receivedConnections.map(conn => 
      conn.id === requestId ? { ...conn, status: 'rejected' } : conn
    );
    
    localStorage.setItem('sentConnections', JSON.stringify(updatedSent));
    localStorage.setItem('receivedConnections', JSON.stringify(updatedReceived));
    
    // Update state immediately
    fetchPendingRequests();
    alert('Rejected connection request');
    
    // Try API call (but already saved locally)
    try {
      const response = await connectionsAPI.reject(requestId, { Authorization: `Bearer ${token}` });
      if (!response.ok) {
        // API update failed, but change already saved locally
      }
    } catch (error) {
      // API error (expected in demo mode), change already saved locally
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    if (!window.confirm('Remove this connection?')) return;
    
    try {
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        // Update localStorage - try both keys
        const sentConnections = JSON.parse(localStorage.getItem('sentConnections') || '[]');
        const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
        
        const updatedSent = sentConnections.filter(conn => conn.id != connectionId);
        const updatedReceived = receivedConnections.filter(conn => conn.id != connectionId);
        
        localStorage.setItem('sentConnections', JSON.stringify(updatedSent));
        localStorage.setItem('receivedConnections', JSON.stringify(updatedReceived));
        
        setConnections(connections.filter(c => c._id !== connectionId));
        alert('Connection removed!');
      } else {
        throw new Error('Failed via API');
      }
    } catch (error) {
      console.error('Error removing connection from API, updating localStorage:', error);
      
      // Fallback: Remove from localStorage - try both keys
      const sentConnections = JSON.parse(localStorage.getItem('sentConnections') || '[]');
      const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
      
      const updatedSent = sentConnections.filter(conn => conn.id != connectionId);
      const updatedReceived = receivedConnections.filter(conn => conn.id != connectionId);
      
      localStorage.setItem('sentConnections', JSON.stringify(updatedSent));
      localStorage.setItem('receivedConnections', JSON.stringify(updatedReceived));
      
      // Update local state
      setConnections(connections.filter(c => c._id !== connectionId));
      alert('Connection removed! (Demo Mode)');
    }
  };

  const filteredConnections = connections.filter(conn =>
    (conn.name || conn.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading connections...</div>;
  }

  return (
    <div className="connections-container">
      <div className="connections-header">
        <h1> Connections</h1>
        <p>Manage your professional network</p>
      </div>

      <div className="connections-tabs">
        <button
          className={`tab-btn ${tab === 'connections' ? 'active' : ''}`}
          onClick={() => setTab('connections')}
        >
           Connections ({connections.length})
        </button>
        <button
          className={`tab-btn ${tab === 'requests' ? 'active' : ''}`}
          onClick={() => setTab('requests')}
        >
           Pending Requests ({pendingRequests.length})
        </button>
      </div>

      <div className="connections-content">
        {tab === 'connections' ? (
          <>
            {connections.length > 0 && (
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search connections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            )}
            {filteredConnections.length === 0 ? (
              <div className="no-connections">
                <p> {searchTerm ? 'No connections found' : 'No connections yet. Start connecting!'}</p>
              </div>
            ) : (
              <div className="connections-grid">
                {filteredConnections.map((conn) => (
                  <div key={conn._id} className="connection-card">
                    <img 
                      src={conn.avatar || 'https://api.dicebear.com/7.x/avataaars/svg'} 
                      alt={conn.name} 
                      className="connection-avatar"
                    />
                    <div className="connection-info">
                      <h3>{conn.name}</h3>
                      <p className="connection-role">{conn.role === 'recruiter' ? 'Recruiter' : 'Student'}</p>
                      {conn.company && <p className="connection-company">@ {conn.company}</p>}
                      {conn.location && <p className="connection-location"> {conn.location}</p>}
                    </div>
                    <div className="connection-actions">
                      <button 
                        className="btn-message"
                        onClick={() => navigate('/messages')}
                      >
                        Message
                      </button>
                      <button 
                        className="btn-view-profile"
                        onClick={() => navigate(`/profile/${conn._id}`)}
                      >
                         View
                      </button>
                      <button 
                        className="btn-remove-conn"
                        onClick={() => handleRemoveConnection(conn._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {pendingRequests.length === 0 ? (
              <div className="no-requests">
                <p> No pending requests</p>
              </div>
            ) : (
              <div className="requests-list">
                {pendingRequests.map((req) => (
                  <div key={req._id} className="request-card">
                    <img 
                      src={req.sender?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg'} 
                      alt={req.sender?.name} 
                      className="request-avatar"
                    />
                    <div className="request-info">
                      <h3>{req.sender?.name}</h3>
                      <p className="request-role">{req.sender?.role === 'recruiter' ? 'Recruiter' : 'Student'}</p>
                      {req.sender?.company && <p className="request-company">@ {req.sender.company}</p>}
                      {req.sender?.bio && <p className="request-bio">{req.sender.bio}</p>}
                    </div>
                    <div className="request-actions">
                      <button 
                        className="btn-accept"
                        onClick={() => handleAcceptRequest(req._id, req.sender?._id)}
                      >
                         Accept
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => handleRejectRequest(req._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Connections;



