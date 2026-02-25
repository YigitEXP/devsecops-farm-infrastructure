import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mimarın Notu: Backend Pydantic (UserRegisterSchema) beklediği için 
        // veriyi temiz bir JSON objesi olarak paketliyoruz.
        const loginData = {
            username: username.toLowerCase(),
            password: password
        };

        try {
            // Veriyi Body içinde gönderiyoruz (JSON formatında)
            const response = await axios.post("http://localhost/api/login", loginData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Başarılı girişte Backend'den gelen access_token'ı alıyoruz
            const token = response.data.access_token;
            
            // Token'ı mühürle ve üst bileşene bildir
            localStorage.setItem('token', token);
            onLoginSuccess(token);
            setMessage("Giriş başarılı! Yönlendiriliyorsunuz...");

        } catch (error) {
            console.error("Login Hatası:", error.response?.data);
            
            // Pydantic/FastAPI hata dizilerini (Object) metne çeviren güvenlik katmanı
            const detail = error.response?.data?.detail;
            
            if (Array.isArray(detail)) {
                // 422 hatası durumunda ilk mesajı ekrana bas
                setMessage(`Format Hatası: ${detail[0].msg}`);
            } else {
                // 401 veya diğer hatalar durumunda direkt mesajı bas
                setMessage(detail || "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Giriş Yap</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Kullanıcı Adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Giriş Yap</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Login;