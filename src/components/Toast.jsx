import React, { useState, useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type = 'success', duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'success' && <span className="toast-icon"></span>}
        {type === 'error' && <span className="toast-icon">X</span>}
        {type === 'info' && <span className="toast-icon"></span>}
        <span className="toast-message">{message}</span>
      </div>
      <div className="toast-progress"></div>
    </div>
  );
};

export default Toast;

