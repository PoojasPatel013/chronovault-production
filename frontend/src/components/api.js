// frontend/src/components/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://chronovault-production.onrender.com/api',
  withCredentials: true, // ✅ sends the HttpOnly cookie
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// No need for request interceptor anymore

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


export default api;
