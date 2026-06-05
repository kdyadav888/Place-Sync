import React, { useState, useEffect } from 'react';

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
    try {
      // API call to fetch workshops
      setWorkshops([
        { id: 1, title: 'React Hooks Deep Dive', date: '2026-05-20', capacity: 50, registered: 35, status: 'upcoming' },
        { id: 2, title: 'Building REST APIs', date: '2026-05-15', capacity: 40, registered: 40, status: 'live' },
        { id: 3, title: 'Database Design', date: '2026-05-10', capacity: 30, registered: 30, status: 'completed' },
      ]);
    } catch (error) {
      console.error('Error loading workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workshops-container">
      <div className="page-header">
        <h1>Workshops</h1>
        <button className="btn btn-primary"> Create Workshop</button>
      </div>

      {loading ? (
        <div className="loading">Loading workshops...</div>
      ) : (
        <div className="workshops-list">
          {workshops.map((workshop) => (
            <div key={workshop.id} className="workshop-card">
              <div className="workshop-header">
                <h3>{workshop.title}</h3>
                <span className={`status-badge ${workshop.status}`}>{workshop.status}</span>
              </div>
              <div className="workshop-info">
                <p> {new Date(workshop.date).toLocaleDateString()}</p>
                <p> {workshop.registered}/{workshop.capacity} Registered</p>
              </div>
              <div className="workshop-actions">
                <button className="btn btn-secondary btn-small">Manage</button>
                <button className="btn btn-secondary btn-small">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workshops;

