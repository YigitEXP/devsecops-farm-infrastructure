import React, { useEffect, useState } from 'react';
import { getMyInfo } from '../services/authService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token'); // Mührü yerel hafızadan alıyoruz
      if (!token) {
        setError('Token bulunamadı, lütfen giriş yap.');
        return;
      }

      try {
        const data = await getMyInfo(token); // Senin yazdığın servis fonksiyonu
        setUser(data);
      } catch (err) {
        setError('Oturum süresi dolmuş veya geçersiz token.');
        localStorage.removeItem('token'); // Bozuk tokenı temizliyoruz
      }
    };

    fetchUser();
  }, []);

  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (!user) return <div>Yükleniyor...</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '10px', borderRadius: '5px', justifyContent: 'center', width: '50vw', margin: '20%' }}>
      <h3 style={{ justifyContent: 'center', marginLeft: "20px" }}>🛡️ Güvenli Profil Alanı</h3>
      <p><strong>Kullanıcı Adı:</strong> {user.username}</p>
      <p><strong>Token Ömrü (Exp):</strong> {user.details.exp}</p>
      <p><em>Bu bilgiler doğrudan bulletproof Backend'den geldi</em></p>
    </div>
  );
};

export default Profile;