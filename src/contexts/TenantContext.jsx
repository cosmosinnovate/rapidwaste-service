import React, { createContext, useContext, useState, useEffect } from 'react';

const TenantContext = createContext(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [subdomain, setSubdomain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMainDomain, setIsMainDomain] = useState(false);
  const [isAdminDomain, setIsAdminDomain] = useState(false);

  const extractSubdomain = (hostname) => {
    // Handle localhost for development
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      const parts = hostname.split('.');
      return parts.length > 1 ? parts[0] : null;
    }

    // Handle production domains
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      return parts[0];
    }
    
    return null;
  };

  const loadTenant = async (subdomain) => {
    if (!subdomain || subdomain === 'www' || subdomain === 'admin') {
      if (subdomain === 'admin') {
        setIsAdminDomain(true);
      } else {
        setIsMainDomain(true);
      }
      setSubdomain(null);
      setTenant(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSubdomain(subdomain);

    try {
      const response = await fetch(`/api/tenants/subdomain/${subdomain}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError(`Tenant not found: ${subdomain}`);
        } else {
          setError('Failed to load tenant information');
        }
        return;
      }

      const tenantData = await response.json();
      setTenant(tenantData);
      
      // Apply tenant branding
      if (tenantData.branding) {
        applyTenantBranding(tenantData.branding);
      }
    } catch (err) {
      setError('Failed to load tenant information');
      console.error('Error loading tenant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTenantBranding = (branding) => {
    const root = document.documentElement;
    
    if (branding.primaryColor) {
      root.style.setProperty('--primary-color', branding.primaryColor);
    }
    
    if (branding.secondaryColor) {
      root.style.setProperty('--secondary-color', branding.secondaryColor);
    }
    
    if (branding.fontFamily) {
      root.style.setProperty('--font-family', branding.fontFamily);
    }
    
    if (branding.customCSS) {
      // Apply custom CSS
      const styleId = 'tenant-custom-css';
      let styleElement = document.getElementById(styleId);
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = branding.customCSS;
    }
  };

  const clearTenant = () => {
    setTenant(null);
    setSubdomain(null);
    setError(null);
    setIsMainDomain(false);
    setIsAdminDomain(false);
    
    // Clear custom branding
    const root = document.documentElement;
    root.style.removeProperty('--primary-color');
    root.style.removeProperty('--secondary-color');
    root.style.removeProperty('--font-family');
    
    const styleElement = document.getElementById('tenant-custom-css');
    if (styleElement) {
      styleElement.remove();
    }
  };

  useEffect(() => {
    const hostname = window.location.hostname;
    const extractedSubdomain = extractSubdomain(hostname);
    
    if (extractedSubdomain) {
      loadTenant(extractedSubdomain);
    } else {
      setIsMainDomain(true);
    }
  }, []);

  const value = {
    tenant,
    subdomain,
    isLoading,
    error,
    isMainDomain,
    isAdminDomain,
    loadTenant,
    clearTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
