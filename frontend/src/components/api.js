// frontend/src/components/api.js
import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'https://chronovault-production.onrender.com/api',  // Added /api to baseURL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;