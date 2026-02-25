import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="App" style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: '50px' }}>
        <h1>🛡️ Secure Guard System</h1>
        <hr style={{ width: '50%', marginBottom: '30px' }} />

        <Routes>
          {/* DURUM 1: Ana Sayfa (/) kontrolü */}
          <Route path="/" element={
            !token ? (
              <Login onLoginSuccess={(newToken) => setToken(newToken)} />
            ) : (
              <div>
                <Profile />
                <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '5px' }}>
                  Güvenli Çıkış Yap
                </button>
              </div>
            )
          } />

          {/* DURUM 2: Register Sayfası */}
          <Route path="/register" element={<Register />} />

          {/* DURUM 3: Login Sayfası (Doğrudan erişim için) */}
          <Route path="/login" element={
            token ? <Navigate to="/" /> : <Login onLoginSuccess={(newToken) => setToken(newToken)} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;