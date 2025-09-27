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
        const storedToken = localStorage.getItem('notary_now_token');
        const storedRefreshToken = localStorage.getItem('notary_now_refresh_token');
        const storedUser = localStorage.getItem('notary_now_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Set auth tokens for API service
          apiService.setAuthToken(storedToken);
          if (storedRefreshToken) {
            apiService.setRefreshToken(storedRefreshToken);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('notary_now_token');
        localStorage.removeItem('notary_now_refresh_token');
        localStorage.removeItem('notary_now_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for automatic logout events from API service
  useEffect(() => {
    const handleAutoLogout = () => {
      console.log('Auto logout triggered due to refresh token failure');
      setUser(null);
      setToken(null);
      setError('');
    };

    window.addEventListener('auth-logout', handleAutoLogout);
    
    return () => {
      window.removeEventListener('auth-logout', handleAutoLogout);
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');

      const response = await apiService.login(email, password);

      if (response.success) {
        const { access_token, refresh_token, user: userData } = response.data;
        
        // Store in state
        setToken(access_token);
        setUser(userData);
        
        // Store in localStorage
        storeAuthData(access_token, refresh_token, userData);
        
        // Set auth tokens for API service
        apiService.setAuthToken(access_token);
        apiService.setRefreshToken(refresh_token);
        
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
        const { access_token, refresh_token, user: newUser } = response.data;
        
        // Store in state
        setToken(access_token);
        setUser(newUser);
        
        // Store in localStorage
        storeAuthData(access_token, refresh_token, newUser);
        
        // Set auth tokens for API service
        apiService.setAuthToken(access_token);
        apiService.setRefreshToken(refresh_token);
        
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

  const storeAuthData = (access_token, refresh_token, userData) => {
    // Store in localStorage
    localStorage.setItem('notary_now_token', access_token);
    localStorage.setItem('notary_now_refresh_token', refresh_token);
    localStorage.setItem('notary_now_user', JSON.stringify(userData));
  };

  const clearLocalStorageAuth = () => {
    localStorage.removeItem('notary_now_token');
    localStorage.removeItem('notary_now_refresh_token');
    localStorage.removeItem('notary_now_user');
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);
    setError('');
    
    clearLocalStorageAuth();

    // Remove auth tokens from API service
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