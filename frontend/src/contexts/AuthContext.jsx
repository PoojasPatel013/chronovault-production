// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Update the API configuration in AuthContext.jsx
const api = axios.create({
  baseURL: 'https://chronovault-production.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add token refresh interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post('/auth/refresh');
        const token = response.data.token;
        Cookies.set('jwt', token, { 
          expires: 7,
          secure: false, // Allow local development
          sameSite: 'lax'
        });
        
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear the token and redirect to login
        Cookies.remove('jwt');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('jwt');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.status === 200 && response.data.success) {
          setUser(response.data.data.user); // ✅ Corrected
          setIsAuthenticated(true);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        Cookies.remove('jwt');
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // Authentication functions
  const signup = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Signup failed');
    }

    const { token, user } = response.data;
    Cookies.set('jwt', token, { expires: 7, secure: false, sameSite: 'lax' });
    setUser(user);
    setIsAuthenticated(true);
    setError('');
    return true;
  } catch (error) {
    setError(error.response?.data?.message || error.message || 'Signup failed');
    return false;
  }
};

  const login = async (credentials) => {
    try {
      // Add credentials to request
      const response = await api.post('/auth/login', credentials, {
        withCredentials: true
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { token, user } = response.data;
      
      // Store token in cookie
      Cookies.set('jwt', token, { 
        expires: 7,
        secure: false, // Allow local development
        sameSite: 'lax'
      });
      
      // Update user state
      setUser(user);
      setIsAuthenticated(true);
      setError('');
      return user;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || 'Login failed');
      Cookies.remove('jwt'); // Clean up token on failure
      return null;
    }
  };

  const logout = () => {
    // Clear cookie
    Cookies.remove('jwt');
    // Clear user state
    setUser(null);
    setIsAuthenticated(false);
    setError('');
    return true;
  };

  // Initialize auth state
  useEffect(() => {
    setLoading(true);
    const token = Cookies.get('jwt');
    
    if (!token) {
      setLoading(false);
      setUser(null);
      setError('');
      return;
    }

    api.get('/auth/me')
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data.user);
          setError('');
        } else {
          throw new Error('Invalid response from server');
        }
      })
      .catch((error) => {
        console.error('Token verification failed:', error);
        Cookies.remove('jwt');
        setError('Session expired. Please login again.');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const loginWithGoogle = (userData, token) => {
    Cookies.set('jwt', token, {
      expires: 7,
      secure: false,
      sameSite: 'lax'
    });
  
    setUser(userData);
    setIsAuthenticated(true);
    setError('');
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signup,
        login,
        logout,
        loading,
        error,
        loginWithGoogle,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;


