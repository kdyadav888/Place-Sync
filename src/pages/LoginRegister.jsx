import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import '../styles/Auth.css';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [registrationStep, setRegistrationStep] = useState('form'); // 'form', 'otp', 'complete'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle registration - Step 1: Send OTP
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.register(formData);

      const data = await response.json();

      if (response.ok) {
        setOtpEmail(formData.email);
        setRegistrationStep('otp');
        setSuccess('OTP sent to your email. Please check your inbox.');
        setError('');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification - Step 2: Verify OTP
  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.verifyOTP(otpEmail, otp.trim());

      const data = await response.json();

      if (response.ok) {
        setSuccess('Email verified! Logging you in...');
        login(data.user, data.token);
        setTimeout(() => {
          if (data.user.role === 'recruiter') {
            navigate('/recruiter-dashboard');
          } else if (data.user.role === 'trainer') {
            navigate('/trainer-dashboard');
          } else if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.resendOTP(otpEmail);

      const data = await response.json();

      if (response.ok) {
        setSuccess('New OTP sent to your email');
        setOtp('');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        if (data.user.role === 'recruiter') {
          navigate('/recruiter-dashboard');
        } else if (data.user.role === 'trainer') {
          navigate('/trainer-dashboard');
        } else if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', role: 'student' });
    setOtp('');
    setRegistrationStep('form');
    setError('');
    setSuccess('');
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        {isLogin ? (
          <>
            <h1>Login</h1>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group password-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showLoginPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? (
                      <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                        <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"></line>
                      </svg>
                    ) : (
                      <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button
                type="button"
                className="btn-link"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>
          </>
        ) : registrationStep === 'form' ? (
          <>
            <h1>Register</h1>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group password-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showRegisterPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password (minimum 6 characters)"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    title={showRegisterPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegisterPassword ? (
                      <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                        <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"></line>
                      </svg>
                    ) : (
                      <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select name="role" id="role" value={formData.role} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="trainer">Trainer</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-register"
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Register & Send OTP'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Verify Email</h1>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleOTPVerify}>
              <div className="form-group">
                <label>Verification Code</label>
                <p className="otp-email-info">
                  We've sent a 6-digit OTP to <strong>{otpEmail}</strong>
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                  className="otp-input"
                />
                <p className="otp-note">OTP expires in 15 minutes</p>
              </div>

              <button
                type="submit"
                className="btn-register"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify & Complete Registration'}
              </button>
            </form>

            <div className="otp-actions">
              <button
                type="button"
                className="btn-link"
                onClick={handleResendOTP}
                disabled={loading}
              >
                Resend OTP
              </button>
              <button
                type="button"
                className="btn-link"
                onClick={() => setRegistrationStep('form')}
              >
                Back to Registration
              </button>
            </div>
          </>
        )}

        <button
          type="button"
          className="toggle-btn"
          onClick={toggleAuthMode}
        >
          {isLogin ? 'Create an account' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default LoginRegister;



