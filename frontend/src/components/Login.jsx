import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { login } from '../services/authService';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await login(username, password);
            const token = response.access_token;
            
            localStorage.setItem('token', token);
            onLoginSuccess(token);
            setMessage("✓ Kimlik doğrulama başarılı!");

        } catch (error) {
            console.error("Login Hatası:", error.response?.data);
            
            const detail = error.response?.data?.detail;
            
            if (Array.isArray(detail)) {
                setMessage(`⚠ Format Hatası: ${detail[0].msg}`);
            } else {
                setMessage(detail || "⚠ Erişim reddedildi. Bilgilerinizi kontrol edin.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getMessageType = () => {
        if (message.includes('✓')) return 'success';
        if (message.includes('⚠')) return 'error';
        return 'info';
    };

    return (
        <div className="auth-container">
            <div className="glass-card auth-card">
                <h2 className="auth-title">
                    <span>🔐</span> Sistem Girişi
                </h2>
                
                <form onSubmit={handleSubmit} className="cyber-form">
                    <div className="input-group">
                        <input
                            type="text"
                            id="username"
                            className="cyber-input"
                            placeholder=" "
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <label htmlFor="username" className="input-label">
                            Kullanıcı Adı
                        </label>
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="password"
                            id="password"
                            className="cyber-input"
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                        <label htmlFor="password" className="input-label">
                            Şifre
                        </label>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="cyber-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="cyber-loader" style={{ padding: 0 }}>
                                <span></span><span></span><span></span>
                            </span>
                        ) : (
                            '🔓 Giriş Yap'
                        )}
                    </button>
                </form>
                
                {message && (
                    <div className={`cyber-message ${getMessageType()}`}>
                        {message}
                    </div>
                )}
                
                <p className="auth-toggle">
                    Hesabınız yok mu? <Link to="/register">Kayıt olun</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;