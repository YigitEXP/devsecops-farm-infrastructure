import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/registerService';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) =>{
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setMessage("⚠ Passwords don't match!");
            return;
        }

        if (formData.password.length < 8) {
            setMessage("⚠ Password must be at least 8 characters!");
            return;
        }
        
        setIsLoading(true);
    
        // Sadece gerekli olan iki alanı alalım
        const { username, password } = formData;

        try {
            // DÜZELTME: URL'i temiz tut, sonuna bir şey ekleme. 
            // İkinci parametre olan nesne otomatik olarak JSON Body olur.
            const response = await register(username, password);
            
            setMessage("✓ " + response.message);
            setFormData({ username: '', password: '', confirmPassword: '' });
        } catch (error) {
            // Hata detayını konsolda görelim ki neyin eksik olduğunu anlayalım
            console.log("FastAPI Error Detail:", error.response?.data);
            setMessage("⚠ " + (error.response?.data?.detail || "Registration fail"));
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
                    <span>📝</span> New Account
                </h2>
                
                <form onSubmit={handleSubmit} className="cyber-form">
                    <div className="input-group">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="cyber-input"
                            placeholder=" "
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                        <label htmlFor="username" className="input-label">
                            Username
                        </label>
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="cyber-input"
                            placeholder=" "
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                        <label htmlFor="password" className="input-label">
                            Password (min. 8 characters)
                        </label>
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="cyber-input"
                            placeholder=" "
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                        <label htmlFor="confirmPassword" className="input-label">
                            Confirm Password
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
                            '🔒 Register'
                        )}
                    </button>
                </form>
                
                {message && (
                    <div className={`cyber-message ${getMessageType()}`}>
                        {message}
                    </div>
                )}
                
                <p className="auth-toggle">
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;