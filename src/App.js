import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import LandingPage from './utils/LandingPage';
import Navbar from './utils/Navbar';
import './styles/App.css';
function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation(); // Get the current route

  return (
    <div className="App">
      {/* Show Navbar only if the current page is NOT LandingPage and NOT Dashboard */}
      {location.pathname !== '/' && location.pathname !== '/dashboard' && <Navbar />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
