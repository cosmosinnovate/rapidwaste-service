import { useState, useEffect } from 'react';
import ApiService from '../../services/api';

const TenantManagementTab = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [formData, setFormData] = useState({
    subdomain: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      fontFamily: 'Inter',
    },
    pricing: {
      general: { basePrice: 15, perSignature: 15, urgentFee: 25 },
      loan_signing: { basePrice: 175, documentThreshold: 10, additionalFee: 25 },
      estate_planning: { basePrice: 260, documentThreshold: 5, additionalFee: 50 },
    },
    settings: {
      allowUrgentBookings: true,
      maxDocumentsPerBooking: 20,
      maxWitnesses: 4,
      requireWitnesses: false,
      autoAssignNotaries: true,
      emailNotifications: true,
      smsNotifications: false,
    },
    allowedServiceTypes: ['general', 'loan_signing', 'estate_planning'],
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllTenants();
      setTenants(response.data || []);
    } catch (err) {
      setError('Failed to load tenants');
      console.error('Error fetching tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingTenant) {
        await ApiService.updateTenant(editingTenant._id, formData);
      } else {
        await ApiService.createTenant(formData);
      }
      setShowCreateModal(false);
      setEditingTenant(null);
      resetForm();
      fetchTenants();
    } catch (err) {
      setError(err.message || 'Failed to save tenant');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      subdomain: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      branding: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        fontFamily: 'Inter',
      },
      pricing: {
        general: { basePrice: 15, perSignature: 15, urgentFee: 25 },
        loan_signing: { basePrice: 175, documentThreshold: 10, additionalFee: 25 },
        estate_planning: { basePrice: 260, documentThreshold: 5, additionalFee: 50 },
      },
      settings: {
        allowUrgentBookings: true,
        maxDocumentsPerBooking: 20,
        maxWitnesses: 4,
        requireWitnesses: false,
        autoAssignNotaries: true,
        emailNotifications: true,
        smsNotifications: false,
      },
      allowedServiceTypes: ['general', 'loan_signing', 'estate_planning'],
    });
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setFormData({
      subdomain: tenant.subdomain,
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone || '',
      address: tenant.address || '',
      city: tenant.city || '',
      state: tenant.state || '',
      zipCode: tenant.zipCode || '',
      branding: tenant.branding || {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        fontFamily: 'Inter',
      },
      pricing: tenant.pricing || {
        general: { basePrice: 15, perSignature: 15, urgentFee: 25 },
        loan_signing: { basePrice: 175, documentThreshold: 10, additionalFee: 25 },
        estate_planning: { basePrice: 260, documentThreshold: 5, additionalFee: 50 },
      },
      settings: tenant.settings || {
        allowUrgentBookings: true,
        maxDocumentsPerBooking: 20,
        maxWitnesses: 4,
        requireWitnesses: false,
        autoAssignNotaries: true,
        emailNotifications: true,
        smsNotifications: false,
      },
      allowedServiceTypes: tenant.allowedServiceTypes || ['general', 'loan_signing', 'estate_planning'],
    });
    setShowCreateModal(true);
  };

  const handleToggleStatus = async (tenantId, currentStatus) => {
    try {
      if (currentStatus) {
        await ApiService.deactivateTenant(tenantId);
      } else {
        await ApiService.activateTenant(tenantId);
      }
      fetchTenants();
    } catch (err) {
      setError('Failed to update tenant status');
    }
  };

  const handleDelete = async (tenantId) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        await ApiService.deleteTenant(tenantId);
        fetchTenants();
      } catch (err) {
        setError('Failed to delete tenant');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tenant Management</h2>
        <button
          onClick={() => {
            setEditingTenant(null);
            resetForm();
            setShowCreateModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Add Tenant
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tenants List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subdomain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                      <div className="text-sm text-gray-500">{tenant.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tenant.subdomain}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tenant.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tenant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(tenant)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(tenant._id, tenant.isActive)}
                        className={`${
                          tenant.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {tenant.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(tenant._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingTenant ? 'Edit Tenant' : 'Create New Tenant'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subdomain *
                  </label>
                  <input
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({...formData, subdomain: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={formData.branding.primaryColor}
                    onChange={(e) => setFormData({
                      ...formData, 
                      branding: {...formData.branding, primaryColor: e.target.value}
                    })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={formData.branding.secondaryColor}
                    onChange={(e) => setFormData({
                      ...formData, 
                      branding: {...formData.branding, secondaryColor: e.target.value}
                    })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTenant(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingTenant ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagementTab;
