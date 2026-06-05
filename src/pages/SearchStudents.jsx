import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { connectionsAPI } from '../utils/api';
import '../styles/RecruiterDashboard.css';

const SearchStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [sentConnections, setSentConnections] = useState([]);
  const { token } = useAuth();

  // Load sent connections from localStorage on mount
  useEffect(() => {
    console.log('SearchStudents mounted, loading data...');
    const saved = JSON.parse(localStorage.getItem('sentConnections') || '[]');
    console.log('Loaded sent connections from localStorage:', saved);
    setSentConnections(saved);
  }, []);

  const demoStudents = [
    {
      _id: 'student1',
      name: 'Rohit Sharma',
      email: 'rohit.sharma@email.com',
      location: 'Pune, India',
      company: 'ABC Tech',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'CSS'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit',
    },
    {
      _id: 'student2',
      name: 'Anjali Verma',
      email: 'anjali.verma@email.com',
      location: 'Chennai, India',
      company: 'XYZ Solutions',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali',
    },
    {
      _id: 'student3',
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      location: 'Hyderabad, India',
      company: 'Tech Startup',
      skills: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes', 'GraphQL'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    },
    {
      _id: 'student4',
      name: 'Divya Patel',
      email: 'divya.patel@email.com',
      location: 'Bangalore, India',
      company: 'StartupLab',
      skills: ['JavaScript', 'React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Divya',
    },
    {
      _id: 'student5',
      name: 'Aman Kumar',
      email: 'aman.kumar@email.com',
      location: 'Delhi, India',
      company: 'BigTech Corp',
      skills: ['Full Stack', 'MERN', 'AWS', 'DevOps', 'CI/CD'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aman',
    },
    {
      _id: 'student6',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      location: 'Mumbai, India',
      company: 'DataTech',
      skills: ['Data Science', 'Python', 'Machine Learning', 'SQL', 'Tableau'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!search.trim()) {
      setToast({ message: 'Please enter a search term', type: 'info' });
      return;
    }

    setLoading(true);

    try {
      // Try to fetch real students
      const params = new URLSearchParams({
        search: search || '',
        role: 'student',
      });

      const response = await fetch(`/api/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.users && data.users.length > 0) {
        setStudents(data.users);
        setToast({ message: ` Found ${data.users.length} students!`, type: 'success' });
      } else {
        throw new Error('No students found');
      }
    } catch (error) {
      console.error('Error searching students:', error);
      // Filter demo data by search
      const filtered = demoStudents.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase())) ||
        s.location.toLowerCase().includes(search.toLowerCase())
      );
      setStudents(filtered);
      setToast({ 
        message: filtered.length > 0 
          ? ` Found ${filtered.length} students in demo data!` 
          : 'No students found with those criteria', 
        type: 'info' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (student) => {
    const alreadySent = isConnectionSent(student._id);
    
    if (alreadySent) {
      // Cancel the request
      if (!window.confirm('Cancel this connection request?')) return;
      
      const updated = sentConnections.filter(conn => conn.targetId !== student._id);
      setSentConnections(updated);
      localStorage.setItem('sentConnections', JSON.stringify(updated));
      console.log('Connection cancelled and saved to localStorage');
      
      setToast({ 
        message: ` Connection request cancelled`, 
        type: 'info' 
      });
      return;
    }

    // Create connection object IMMEDIATELY
    const connectionId = Date.now();
    const connection = {
      id: connectionId,
      targetId: student._id,
      targetName: student.name,
      targetEmail: student.email,
      sentAt: new Date().toISOString(),
      status: 'pending',
    };
    
    // Save to state and localStorage SYNCHRONOUSLY (before async operations)
    const updated = [...sentConnections, connection];
    setSentConnections(updated);
    localStorage.setItem('sentConnections', JSON.stringify(updated));
    console.log('Connection saved to localStorage immediately:', updated);
    
    // Create notification for recipient SYNCHRONOUSLY
    createReceivedConnectionNotification(student, connectionId);
    
    setToast({ 
      message: ` Connection request sent to ${student.name}!`, 
      type: 'success' 
    });

    // Try API call (but already saved locally)
    try {
      console.log('Attempting API call for connection request');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await connectionsAPI.request(student._id, headers);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        console.log('API call failed, but connection already saved locally');
      }
    } catch (error) {
      console.log('API error (expected in demo mode), connection already saved locally:', error.message);
    }
  };

  // Create notification for receiving user
  const createReceivedConnectionNotification = (student, connectionId) => {
    const notification = {
      id: connectionId,
      type: 'Connection',
      title: `New Connection Request from ${student.name}`,
      message: `${student.name} (${student.email}) sent you a connection request`,
      fromId: student._id,
      fromName: student.name,
      fromEmail: student.email,
      fromAvatar: student.avatar,
      connectionId: connectionId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    
    const receivedConnections = JSON.parse(localStorage.getItem('receivedConnections') || '[]');
    receivedConnections.push(notification);
    localStorage.setItem('receivedConnections', JSON.stringify(receivedConnections));
    console.log('Notification saved to localStorage:', receivedConnections);
  };

  // Helper function to check if connection already sent
  const isConnectionSent = (studentId) => {
    return sentConnections.some(conn => conn.targetId === studentId);
  };

  useEffect(() => {
    // Show demo students on initial load
    setStudents(demoStudents);
  }, []);

  return (
    <div className="search-students-container">
      <div className="recruiter-header">
        <h1>Search Students</h1>
        <p>Find and connect with talented candidates across India</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by name, email, skills, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {loading ? (
        <div className="loading">Searching...</div>
      ) : students.length === 0 ? (
        <div className="no-data">
          <p>No students found. Try a different search!</p>
        </div>
      ) : (
        <div className="students-grid">
          {students.map((student) => (
            <div key={student._id} className="student-card">
              <img
                src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                alt={student.name}
                className="student-avatar"
              />
              <h3>{student.name}</h3>
              <p className="student-email"> {student.email}</p>
              {student.company && <p className="student-company"> {student.company}</p>}
              {student.location && <p className="student-location">Location: {student.location}</p>}

              {student.skills && student.skills.length > 0 && (
                <div className="student-skills">
                  {student.skills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <button 
                onClick={() => handleConnect(student)}
                className={`btn-connect ${isConnectionSent(student._id) ? 'sent' : ''}`}
              >
                {isConnectionSent(student._id) ? ' Request Sent' : ' Send Connection'}
              </button>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default SearchStudents;

