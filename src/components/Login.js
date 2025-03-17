import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'; 
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Attempting login with:', formData);

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      console.log('Login response:', response.data);

      if (response.data.success) {
        // Store user data in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
        console.log('Login successful, redirecting...');
        
        // Use both navigate and window.location to ensure redirect works
        navigate('/dashboard');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login to KodeJobs</h2>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            onClick={() => console.log('Login button clicked')}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 