import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  fallback = null
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return fallback;
    }

    // For driver role, show login form immediately
    if (requiredRole === 'driver') {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Driver Portal</h2>
              <p className="text-gray-600 mt-2">Please sign in to access the driver dashboard</p>
            </div>
            <LoginForm 
              onSuccess={() => {}} // Page will reload with authenticated state
              onCancel={null} // No cancel option for driver portal
              defaultRole="driver"
            />
          </div>
        </div>
      );
    }

    // Default authentication required UI
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Authentication Required
        </h3>
        <p className="text-gray-600 mb-4">
          You need to sign in to access this feature.
        </p>
        <div className="text-sm text-gray-500">
          Contact admin for access
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-600">
          You don't have permission to access this feature.
          <br />
          Required role: <span className="font-medium">{requiredRole}</span>
          <br />
          Your role: <span className="font-medium">{user.role}</span>
        </p>
      </div>
    );
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute; 