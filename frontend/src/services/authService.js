import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost/api';  

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, { 
        username: username, 
        password: password 
    });
    
    return response.data;
};

export const getMyInfo = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        
        },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }};