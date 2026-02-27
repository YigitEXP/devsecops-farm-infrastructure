import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost/api';

export const register = async (username, password) => {
    const response = await axios.post(`${API_URL}/register`, {
        username: username.toLowerCase(),
        password
    });
    return response.data;
};
