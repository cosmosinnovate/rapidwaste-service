import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyBranding = (branding) => {
    if (branding) {
      const { primaryColor, secondaryColor } = branding;
      if (primaryColor) document.documentElement.style.setProperty('--primary-600', primaryColor);
      if (secondaryColor) document.documentElement.style.setProperty('--emergency-600', secondaryColor);
    }
  };

  const fetchTenantBySlug = useCallback(async (slug) => {
    try {
      const response = await apiService.request(`/tenants/slug/${slug}`);
      if (response && response.success && response.data) {
        setTenant(response.data);
        apiService.setTenantId(response.data._id);
        applyBranding(response.data.branding);
        return response.data;
      }
    } catch (err) {
      console.error('Fetch tenant by slug error:', err);
    }
    return null;
  }, []);

  const fetchTenantById = useCallback(async (id) => {
    try {
      const response = await apiService.request(`/tenants/${id}`);
      if (response && response.success && response.data) {
        setTenant(response.data);
        apiService.setTenantId(response.data._id);
        applyBranding(response.data.branding);
        return response.data;
      }
    } catch (err) {
      console.error('Fetch tenant by id error:', err);
    }
    return null;
  }, []);

  const initializeTenant = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Check URL for override
      const urlParams = new URLSearchParams(window.location.search);
      const urlSlug = urlParams.get('tenant');
      
      // 2. Check localStorage for remembered user/tenant
      const storedUser = localStorage.getItem('rapidmove_user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      let activeTenant = null;

      if (urlSlug) {
        activeTenant = await fetchTenantBySlug(urlSlug);
      } else if (user?.tenantId) {
        // Critical: Set the tenantId in apiService immediately before fetching details
        apiService.setTenantId(user.tenantId);
        activeTenant = await fetchTenantById(user.tenantId);
      } else {
        // Default
        activeTenant = await fetchTenantBySlug('rapidmoveclear');
      }

      if (!activeTenant) {
        throw new Error('Could not resolve company identity');
      }
    } catch (err) {
      setError(err.message || 'Connection Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeTenant();
  }, [fetchTenantBySlug, fetchTenantById]);

  const value = {
    tenant,
    loading,
    error,
    refreshTenant: initializeTenant,
    setTenantById: fetchTenantById,
    isDefaultTenant: tenant?.slug === 'rapidmoveclear' || !tenant,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Rapid Move SaaS</p>
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
