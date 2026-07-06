import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, saveToken, removeToken, saveUsername, getUsername, removeUsername } from '../utils/token';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = getToken();
      if (token) {
        setIsAuthenticated(true);
        const storedUsername = getUsername();
        if (storedUsername) {
          setAdmin({ username: storedUsername });
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
      if (response.data.admin?.username) {
        saveUsername(response.data.admin.username);
      }
      setAdmin(response.data.admin);
      setIsAuthenticated(true);
    }
    return response;
  };

  const logout = () => {
    removeToken();
    removeUsername();
    setAdmin(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, loading, login, logout }}>
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
