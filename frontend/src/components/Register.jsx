import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');

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
    
 

    // Sadece gerekli olan iki alanı alalım
    const { username, password } = formData;

    console.log("Gönderilen Veri:", { username, password });

    try {
        // DÜZELTME: URL'i temiz tut, sonuna bir şey ekleme. 
        // İkinci parametre olan nesne otomatik olarak JSON Body olur.
        const response = await axios.post("http://localhost/api/register", { 
            username, 
            password 
        });
        
        setMessage(response.data.message);
    } catch (error) {
        // Hata detayını konsolda görelim ki neyin eksik olduğunu anlayalım
        console.log("FastAPI Hata Detayı:", error.response?.data);
        setMessage(error.response?.data?.detail || "Kayıt hatası!");
    }
};

    return (
        <div className="register-container">
            <h2>Sisteme Kayıt Ol</h2>
            <form onSubmit={handleSubmit}>
                {/* TODO 6: Input alanlarını oluştur (Username, Password, Confirm Password) */}
                {/* Her input'un 'value' ve 'onChange' özelliklerini bağla. */}
                <input
                    type="text"
                    name="username"
                    placeholder="Kullanıcı Adı"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Şifre"
                    value={formData.password}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Şifre Tekrarı"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                <button type="submit">Kayıt Ol</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;