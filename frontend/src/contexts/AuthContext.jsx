// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../components/api"; // axios instance (withCredentials: true)

// Context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // On mount → try to get user from cookie
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        if (res.status === 200 && res.data?.success && res.data?.data?.user) {
          setUser(res.data.data.user);
          setIsAuthenticated(true);
          setError("");
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error("Auth init failed:", e);
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
      const res = await api.post("/auth/register", userData, { withCredentials: true });
      if (!res.data?.success) throw new Error(res.data?.message || "Signup failed");
      // Cookie is already set by backend
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError("");
      return true;
    } catch (e) {
      console.error("Signup error:", e);
      setError(e.response?.data?.message || e.message || "Signup failed");
      return false;
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials, { withCredentials: true });
      if (!res.data?.success) throw new Error(res.data?.message || "Login failed");
      // Cookie is already set by backend
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError("");
      return res.data.user;
    } catch (e) {
      console.error("Login error:", e);
      setError(e.response?.data?.message || e.message || "Login failed");
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  };

  // Google OAuth login (cookie already set by backend)
  const loginWithGoogle = async () => {
    try {
      const res = await api.get("/auth/me", { withCredentials: true });
      if (res.status === 200 && res.data?.success && res.data?.data?.user) {
        setUser(res.data.data.user);
        setIsAuthenticated(true);
        setError("");
      } else {
        throw new Error("Failed to fetch user after Google login");
      }
    } catch (e) {
      console.error("Google login error:", e);
      setUser(null);
      setIsAuthenticated(false);
      setError("Google login failed");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (_) {}
    setUser(null);
    setIsAuthenticated(false);
    setError("");
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signup,
        login,
        loginWithGoogle,
        logout,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthProvider;
