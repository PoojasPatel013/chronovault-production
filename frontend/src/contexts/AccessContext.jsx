import { createContext, useContext, useEffect, useState } from 'react';
import api from '../components/api'; // ✅ Import centralized axios instance

const AccessContext = createContext();

export const AccessProvider = ({ children }) => {
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAccess = async () => {
    try {
      const res = await api.get('/access/me'); // ✅ Axios GET request
      setAccess(res.data);                    // Axios already parses JSON
    } catch (err) {
      console.error('Failed to fetch access control:', err);
    } finally {
      setLoading(false);
    }
  };

  const logUsage = async (minutesUsed) => {
    try {
      const res = await api.post('/access/log-usage', { minutesUsed }); // ✅ Axios POST
      setAccess(res.data.access);
    } catch (err) {
      console.error('Failed to log usage:', err);
    }
  };

  useEffect(() => {
    fetchAccess();
  }, []);

  return (
    <AccessContext.Provider value={{ access, loading, logUsage, refreshAccess: fetchAccess }}>
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => useContext(AccessContext);
