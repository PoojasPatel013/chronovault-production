// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
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
      const res = await api.get('/auth/me', { withCredentials: true });
      if (res.data?.success) {
        setUser(res.data.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
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
    if (!res.data?.success) throw new Error('Signup failed');

    setUser(res.data.user);
    setIsAuthenticated(true);
    return true;
  } catch (e) {
    setError(e.response?.data?.message || e.message || 'Signup failed');
    return false;
  }
};

  // Login
  const login = async (credentials) => {
  try {
    const res = await api.post('/auth/login', credentials, { withCredentials: true });
    if (!res.data?.success) throw new Error('Login failed');

    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data.user;
  } catch (e) {
    setError(e.response?.data?.message || e.message || 'Login failed');
    return null;
  }
};

  // Google path just reuses the same state/cookie approach
  // Google login (no cookies.set anymore)
const loginWithGoogle = async (credential) => {
  try {
    const res = await api.post('/auth/google', { credential }, { withCredentials: true });
    if (res.data?.success) {
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError('');
      return res.data.user;
    } else {
      throw new Error(res.data?.message || 'Google login failed');
    }
  } catch (err) {
    console.error("Google login error:", err);
    setError(err.response?.data?.message || err.message || 'Google login failed');
    return null;
  }
};


  // Logout (optional server call to clear its cookie if you use it)
  const logout = async () => {
  try { await api.post('/auth/logout'); } catch {}
  setUser(null);
  setIsAuthenticated(false);
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
