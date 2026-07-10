import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, saveToken, removeToken, saveAdminData, getAdminData, removeAdminData } from '../utils/token';
import { authService } from '../services/auth.service';
import { ROLE_PERMISSIONS } from '../constants/rbac.constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = getToken();
      if (token) {
        setIsAuthenticated(true);
        const storedAdmin = getAdminData();
        if (storedAdmin) {
          setAdmin(storedAdmin);
          setPermissions(ROLE_PERMISSIONS[storedAdmin.role] || []);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    if (response.success && response.data) {
      saveToken(response.data.accessToken);
      if (response.data.admin) {
        saveAdminData(response.data.admin);
      }
      setAdmin(response.data.admin);
      setPermissions(ROLE_PERMISSIONS[response.data.admin.role] || []);
      setIsAuthenticated(true);
    }
    return response;
  };

  const logout = () => {
    removeToken();
    removeAdminData();
    setAdmin(null);
    setPermissions([]);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, permissions, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
