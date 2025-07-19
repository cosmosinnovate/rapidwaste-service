import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('rapidwaste_token');
        const storedUser = localStorage.getItem('rapidwaste_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Set auth token for API service
          apiService.setAuthToken(storedToken);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('rapidwaste_token');
        localStorage.removeItem('rapidwaste_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');

      const response = await apiService.login(email, password);

      if (response.success) {
        const { access_token, user: userData } = response.data;
        
        // Store in state
        setToken(access_token);
        setUser(userData);
        
        // Store in localStorage
        localStorage.setItem('rapidwaste_token', access_token);
        localStorage.setItem('rapidwaste_user', JSON.stringify(userData));
        
        // Set auth token for API service
        apiService.setAuthToken(access_token);
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError('');

      const response = await apiService.register(userData);

      if (response.success) {
        const { access_token, user: newUser } = response.data;
        
        // Store in state
        setToken(access_token);
        setUser(newUser);
        
        // Store in localStorage
        localStorage.setItem('rapidwaste_token', access_token);
        localStorage.setItem('rapidwaste_user', JSON.stringify(newUser));
        
        // Set auth token for API service
        apiService.setAuthToken(access_token);
        
        return { success: true, user: newUser };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);
    setError('');
    
    // Clear localStorage
    localStorage.removeItem('rapidwaste_token');
    localStorage.removeItem('rapidwaste_user');
    
    // Remove auth token from API service
    apiService.clearAuthToken();
  };

  const clearError = () => {
    setError('');
  };

  const isAuthenticated = !!user && !!token;
  const isDriver = user?.role === 'driver';
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isDriver,
    isAdmin,
    isCustomer,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 