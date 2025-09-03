// frontend/src/components/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'https://chronovault-production.onrender.com/api',  // Added /api to baseURL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to handle token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('jwt');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;