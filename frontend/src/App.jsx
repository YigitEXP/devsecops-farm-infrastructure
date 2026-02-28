import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import MouseGlow from './components/MouseGlow';
import './CyberStyles.css';

// Navigasyon Kontrolü
const Navigation = ({ token }) => {
  const location = useLocation();
  if (token) return null;

  return (
    <nav className="nav-links">
      <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Login</Link>
      <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>Register</Link>
    </nav>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (x, y) => {
    setMousePos({ x, y });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="app-container">
        <MouseGlow onMouseMove={handleMouseMove} />
        
        <header className="cyber-header">
          <h1 className="cyber-title">
            <span className="shield-icon">🛡️</span> Bulletproof Security
          </h1>
          <p className="cyber-subtitle">Ultra Secure Authentication System</p>
        </header>

        <Navigation token={token} />

        <main className="content-area">
          <Routes>
            <Route path="/" element={
              !token ? (
                <Login onLoginSuccess={(newToken) => setToken(newToken)} />
              ) : (
                <div className="dashboard-container">
                  <Profile />
                  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button onClick={handleLogout} className="cyber-button danger">
                      🔒 Secure Logout
                    </button>
                  </div>
                </div>
              )
            } />
            <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
            <Route path="/login" element={token ? <Navigate to="/" /> : <Login onLoginSuccess={(newToken) => setToken(newToken)} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;