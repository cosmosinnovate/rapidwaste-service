import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';

const LoginForm = ({ onSuccess, onCancel, defaultRole = 'customer' }) => {
  const { login, register, loading, error, clearError } = useAuth();
  const { isDefaultTenant, tenant } = useTenant();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: defaultRole,
    address: '',
    city: '',
    zipCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let result;
    if (isRegistering) {
      result = await register(formData);
    } else {
      result = await login(formData.email, formData.password);
    }

    if (result.success && onSuccess) {
      onSuccess(result.user);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    clearError();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isRegistering ? 'Create Account' : 'Sign In'}
          </h2>
          {onCancel && (
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name *"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone *"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input-field"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="input-field"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-md font-bold hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button type="button" onClick={toggleMode} className="ml-1 text-primary-600 font-medium hover:underline">
              {isRegistering ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>

        {isDefaultTenant ? (
          <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Demo Accounts:</h3>
            <div className="text-[10px] text-gray-600 space-y-1">
              <div><strong>Admin:</strong> admin@rapidmoveclear.com / admin123</div>
              <div><strong>Driver:</strong> driver@rapidmoveclear.com / password123</div>
            </div>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Portal Access:</strong> Use the administrator email and password you created during registration for <strong>{tenant?.name}</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
