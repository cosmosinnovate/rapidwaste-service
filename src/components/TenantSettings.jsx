import { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';
import ApiService from '../services/api';

const TenantSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const [activeSubTab, setActiveSubTab] = useState('general'); // 'general', 'pricing', 'page-editor'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    phone: '',
    customDomain: '',
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#dc2626',
    },
    settings: {
      basePriceRegular: 800,
      basePriceEmergency: 1200,
      basePriceBulk: 450,
      requireDeposit: true,
      allowInstantBooking: true,
    },
    content: {
      heroTitle: '',
      heroSubtitle: '',
      servicesTitle: '',
      servicesSubtitle: '',
    }
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        contactEmail: tenant.contactEmail || '',
        phone: tenant.phone || '',
        customDomain: tenant.customDomain || '',
        branding: {
          primaryColor: tenant.branding?.primaryColor || '#2563eb',
          secondaryColor: tenant.branding?.secondaryColor || '#dc2626',
        },
        settings: {
          basePriceRegular: tenant.settings?.basePriceRegular || 800,
          basePriceEmergency: tenant.settings?.basePriceEmergency || 1200,
          basePriceBulk: tenant.settings?.basePriceBulk || 450,
          requireDeposit: tenant.settings?.requireDeposit ?? true,
          allowInstantBooking: tenant.settings?.allowInstantBooking ?? true,
        },
        content: {
          heroTitle: tenant.content?.heroTitle || '',
          heroSubtitle: tenant.content?.heroSubtitle || '',
          servicesTitle: tenant.content?.servicesTitle || '',
          servicesSubtitle: tenant.content?.servicesSubtitle || '',
        }
      });
    }
  }, [tenant]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await ApiService.updateTenant(tenant._id, formData);
      if (response.success) {
        setSuccessMessage('Settings updated successfully!');
        if (refreshTenant) await refreshTenant();
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px] text-left">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-6 space-y-2">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-3">Configuration</h3>
        {[
          { id: 'general', name: 'Business Info', icon: '🏢' },
          { id: 'pricing', name: 'Pricing Engine', icon: '💰' },
          { id: 'branding', name: 'Visual Identity', icon: '🎨' },
          { id: 'page-editor', name: 'Landing Page', icon: '🌐' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSubTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeSubTab === item.id 
                ? 'bg-white text-primary-600 shadow-sm border border-gray-100' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 md:p-12 relative">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex-1">
            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-8 font-bold border border-green-100 flex items-center animate-fade-in">
                <span className="mr-2">✅</span> {success}
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 font-bold border border-red-100">
                {error}
              </div>
            )}

            {/* General Business Info */}
            {activeSubTab === 'general' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Business Profile</h2>
                  <p className="text-gray-500 text-sm mt-1 font-medium">Manage your core company contact information.</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">Legal Company Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field font-bold" required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase mb-2">Primary Contact Email</label>
                      <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="input-field font-bold" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase mb-2">Business Phone</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-field font-bold" required />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-50">
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">Custom White-Label Domain</label>
                    <input type="text" name="customDomain" value={formData.customDomain} onChange={handleChange} placeholder="e.g. moves.yourbrand.com" className="input-field font-mono text-sm" />
                    <p className="text-[10px] text-primary-600 mt-2 font-bold italic">* Pro Feature: Alerts our team for manual DNS setup.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Logic */}
            {activeSubTab === 'pricing' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Pricing Engine</h2>
                  <p className="text-gray-500 text-sm mt-1 font-medium">Configure your base rates and booking logic.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">Standard ($)</label>
                    <input type="number" name="settings.basePriceRegular" value={formData.settings.basePriceRegular} onChange={handleChange} className="input-field font-black text-primary-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">Priority ($)</label>
                    <input type="number" name="settings.basePriceEmergency" value={formData.settings.basePriceEmergency} onChange={handleChange} className="input-field font-black text-red-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">Heavy/Bulk ($)</label>
                    <input type="number" name="settings.basePriceBulk" value={formData.settings.basePriceBulk} onChange={handleChange} className="input-field font-black text-purple-600" />
                  </div>
                </div>
                <div className="space-y-4 pt-6">
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <input type="checkbox" id="requireDeposit" name="settings.requireDeposit" checked={formData.settings.requireDeposit} onChange={handleChange} className="h-5 w-5 text-primary-600 rounded" />
                    <label htmlFor="requireDeposit" className="text-sm font-bold text-gray-700">Require online deposit to secure booking</label>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <input type="checkbox" id="allowInstantBooking" name="settings.allowInstantBooking" checked={formData.settings.allowInstantBooking} onChange={handleChange} className="h-5 w-5 text-primary-600 rounded" />
                    <label htmlFor="allowInstantBooking" className="text-sm font-bold text-gray-700">Allow instant scheduling without admin review</label>
                  </div>
                </div>
              </div>
            )}

            {/* Visual Branding */}
            {activeSubTab === 'branding' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Visual Identity</h2>
                  <p className="text-gray-500 text-sm mt-1 font-medium">Update your brand colors and logo.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col items-center">
                    <label className="block text-xs font-black text-gray-400 uppercase mb-4">Primary Brand Color</label>
                    <input type="color" name="branding.primaryColor" value={formData.branding.primaryColor} onChange={handleChange} className="h-24 w-24 p-2 rounded-full border-4 border-white shadow-xl cursor-pointer" />
                    <span className="mt-4 font-mono font-black text-gray-900 uppercase tracking-widest">{formData.branding.primaryColor}</span>
                  </div>
                  <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col items-center">
                    <label className="block text-xs font-black text-gray-400 uppercase mb-4">Secondary Accent</label>
                    <input type="color" name="branding.secondaryColor" value={formData.branding.secondaryColor} onChange={handleChange} className="h-24 w-24 p-2 rounded-full border-4 border-white shadow-xl cursor-pointer" />
                    <span className="mt-4 font-mono font-black text-gray-900 uppercase tracking-widest">{formData.branding.secondaryColor}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Page Editor (Landing Page Content) */}
            {activeSubTab === 'page-editor' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Page Editor</h2>
                  <p className="text-gray-500 text-sm mt-1 font-medium">Customize the marketing copy on your storefront.</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2 text-primary-600">Main Hero Headline</label>
                    <input type="text" name="content.heroTitle" value={formData.content.heroTitle} onChange={handleChange} placeholder="The default is: Seamless Moving & Space Clearing" className="input-field font-bold text-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">Hero Sub-headline</label>
                    <textarea name="content.heroSubtitle" value={formData.content.heroSubtitle} onChange={handleChange} rows={3} className="input-field text-sm leading-relaxed" placeholder="Detailed pitch under your main title..." />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase mb-2">Services Section Title</label>
                      <input type="text" name="content.servicesTitle" value={formData.content.servicesTitle} onChange={handleChange} className="input-field font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase mb-2">Services Description</label>
                      <input type="text" name="content.servicesSubtitle" value={formData.content.servicesSubtitle} onChange={handleChange} className="input-field text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Persistent Footer Actions */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Changes save instantly to your portal</p>
            <button
              type="submit"
              disabled={loading}
              className={`px-10 py-4 rounded-2xl font-black text-white transition-all shadow-lg hover:shadow-2xl uppercase tracking-widest text-sm ${
                loading ? 'bg-gray-300' : 'bg-primary-600 hover:bg-primary-700 transform hover:-translate-y-1'
              }`}
            >
              {loading ? 'Processing...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantSettings;
