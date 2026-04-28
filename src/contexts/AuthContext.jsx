import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import { useTenant } from './TenantContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { setTenantById } = useTenant();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('rapidmove_token');
        const storedRefreshToken = localStorage.getItem('rapidmove_refresh_token');
        const storedUser = localStorage.getItem('rapidmove_user');
        
        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(user);
          // Set auth tokens and tenant for API service
          apiService.setAuthToken(storedToken);
          if (user.tenantId) {
            apiService.setTenantId(user.tenantId);
          }
          if (storedRefreshToken) {
            apiService.setRefreshToken(storedRefreshToken);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('rapidmove_token');
        localStorage.removeItem('rapidmove_refresh_token');
        localStorage.removeItem('rapidmove_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleAutoLogout = () => {
      setUser(null);
      setToken(null);
      setError('');
    };

    window.addEventListener('auth-logout', handleAutoLogout);
    return () => window.removeEventListener('auth-logout', handleAutoLogout);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');

      // We might not have tenantId from context if user navigated directly to login
      // but apiService.tenantId should be set by TenantProvider
      const response = await apiService.login(email, password, apiService.tenantId);

      if (response.success) {
        const { access_token, refresh_token, user: userData } = response.data;
        
        // Sync branding immediately
        if (userData.tenantId) {
          await setTenantById(userData.tenantId);
        }

        // Store in state
        setToken(access_token);
        setUser(userData);
        
        // Store in localStorage
        localStorage.setItem('rapidmove_token', access_token);
        localStorage.setItem('rapidmove_refresh_token', refresh_token);
        localStorage.setItem('rapidmove_user', JSON.stringify(userData));
        
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

      const response = await apiService.register({
        ...userData,
        tenantId: apiService.tenantId
      });

      if (response.success) {
        const { access_token, refresh_token, user: newUser } = response.data;
        
        // Sync branding immediately
        if (newUser.tenantId) {
          await setTenantById(newUser.tenantId);
        }

        setToken(access_token);
        setUser(newUser);
        
        localStorage.setItem('rapidmove_token', access_token);
        localStorage.setItem('rapidmove_refresh_token', refresh_token);
        localStorage.setItem('rapidmove_user', JSON.stringify(newUser));
        
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

  const logout = () => {
    setUser(null);
    setToken(null);
    setError('');
    localStorage.removeItem('rapidmove_token');
    localStorage.removeItem('rapidmove_refresh_token');
    localStorage.removeItem('rapidmove_user');
    apiService.clearAuthToken();
    // Refresh to clear tenant context if needed or redirect
    window.location.href = '/';
  };

  const clearError = () => setError('');

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
