// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import api from '../components/api'; // ✅ reuse the shared axios client

export const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // On mount, if we have a JWT (stored on FE domain), fetch /auth/me with Bearer header (api.js handles header)
  useEffect(() => {
    const init = async () => {
      try {
        const token = Cookies.get('jwt');
        if (!token) {
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        const res = await api.get('/auth/me'); // will include Authorization from api.js
        if (res.status === 200 && res.data?.success && res.data?.data?.user) {
          setUser(res.data.data.user); // ✅ correct shape
          setIsAuthenticated(true);
          setError('');
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (e) {
        console.error('Auth init failed:', e);
        Cookies.remove('jwt');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Register
  const signup = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData, { withCredentials: true });
      if (!res.data?.success) throw new Error(res.data?.message || 'Signup failed');

      const { token, user } = res.data;
      Cookies.set('jwt', token, { expires: 7, secure: false, sameSite: 'lax' }); // FE cookie so api.js can read it
      setUser(user);
      setIsAuthenticated(true);
      setError('');
      return true;
    } catch (e) {
      console.error('Signup error:', e);
      setError(e.response?.data?.message || e.message || 'Signup failed');
      return false;
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials, { withCredentials: true });
      if (!res.data?.success) throw new Error(res.data?.message || 'Login failed');

      const { token, user } = res.data;
      Cookies.set('jwt', token, { expires: 7, secure: false, sameSite: 'lax' }); // FE cookie for api.js
      setUser(user);
      setIsAuthenticated(true);
      setError('');
      return user;
    } catch (e) {
      console.error('Login error:', e);
      setError(e.response?.data?.message || e.message || 'Login failed');
      Cookies.remove('jwt');
      return null;
    }
  };

  // Google path just reuses the same state/cookie approach
  const loginWithGoogle = (userData, token) => {
    Cookies.set('jwt', token, { expires: 7, secure: false, sameSite: 'lax' });
    setUser(userData);
    setIsAuthenticated(true);
    setError('');
  };

  // Logout (optional server call to clear its cookie if you use it)
  const logout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    Cookies.remove('jwt');
    setUser(null);
    setIsAuthenticated(false);
    setError('');
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signup, login, logout, loading, error, loginWithGoogle, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthProvider;
