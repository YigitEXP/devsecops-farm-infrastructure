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

    // TODO 1: HandleChange fonksiyonunu yaz. 
    // Kullanıcı yazdıkça formData state'ini güncellemeli.
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
            setMessage("⚠ Şifreler eşleşmiyor!");
            return;
        }

        if (formData.password.length < 8) {
            setMessage("⚠ Şifre en az 8 karakter olmalıdır!");
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
            console.log("FastAPI Hata Detayı:", error.response?.data);
            setMessage("⚠ " + (error.response?.data?.detail || "Kayıt hatası!"));
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
                    <span>📝</span> Yeni Hesap
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
                            Kullanıcı Adı
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
                            Şifre (min. 8 karakter)
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
                            Şifre Tekrarı
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
                            '🔒 Kayıt Ol'
                        )}
                    </button>
                </form>
                
                {message && (
                    <div className={`cyber-message ${getMessageType()}`}>
                        {message}
                    </div>
                )}
                
                <p className="auth-toggle">
                    Zaten hesabınız var mı? <Link to="/">Giriş yapın</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;