import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LandingPage.css'; 

const LandingPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  // Quick Login Form State
  const [quickLogin, setQuickLogin] = useState({
    email: '',
    password: ''
  });

  // Handle Quick Login
  const handleQuickLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/login', quickLogin);
      
      if (response.data.success) {
        sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  // Handle Sign Up Navigation
  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="landing-container">
      <div className="left-section">
        <div className="image-content">
          <h1>Find Your Dream Job</h1>
          <p>Connect with the best opportunities in tech</p>
          <img 
            src="https://img.freepik.com/free-vector/hiring-concept-illustration_114360-532.jpg" 
            alt="Job seeking" 
          />
        </div>
      </div>
      
      <div className="right-section">
        <div className="top-auth">
          <h2>Quick Login</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form className="quick-login" onSubmit={handleQuickLogin}>
            <h2>Email</h2>  {/* Added Email Heading */}
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                placeholder="Email" 
                value={quickLogin.email}
                onChange={(e) => setQuickLogin({...quickLogin, email: e.target.value})}
                required
              />
            </div>

            <h2>Password</h2>  {/* Added Password Heading */}
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                placeholder="Password"
                value={quickLogin.password}
                onChange={(e) => setQuickLogin({...quickLogin, password: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>

        <div className="bottom-auth">
          <h2>New Here?</h2>
          <p>Create an account to access all features</p>
          <div className="signup-features">
            <div className="feature">
              <i className="fas fa-search"></i>
              <span>Search Jobs</span>
            </div>
            <div className="feature">
              <i className="fas fa-file-alt"></i>
              <span>Track Applications</span>
            </div>
            <div className="feature">
              <i className="fas fa-bell"></i>
              <span>Get Notifications</span>
            </div>
          </div>
          <button className="signup-btn" onClick={handleSignupClick}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
