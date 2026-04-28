import { useState } from 'react';
import apiService from '../services/api';

const TenantRegistration = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    slug: '',
    contactEmail: '',
    phone: '',
    adminFirstName: '',
    adminLastName: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from company name
    if (name === 'companyName') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, companyName: value, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.request('/tenants/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.success) {
        setSuccess(true);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Welcome to the future of moving services. Your dedicated company portal has been created. 
            You can now log in with your administrator account.
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
            <p className="text-sm font-medium text-gray-500 uppercase mb-2 tracking-wider">Your Login Details</p>
            <p className="text-gray-900"><strong>URL:</strong> localhost:5174/?tenant={formData.slug}</p>
            <p className="text-gray-900"><strong>Email:</strong> {formData.contactEmail}</p>
          </div>
          <button 
            onClick={() => window.location.href = `/?tenant=${formData.slug}`}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg"
          >
            Access My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-5">
          {/* Sidebar */}
          <div className="lg:col-span-2 bg-primary-600 p-10 text-white">
            <button 
              onClick={onBack}
              className="text-primary-100 hover:text-white mb-8 flex items-center space-x-2 transition-colors"
            >
              <span>← Back to main site</span>
            </button>
            <h2 className="text-3xl font-bold mb-6">Mover Sign Up</h2>
            <p className="text-primary-100 mb-8 leading-relaxed">
              Launch your moving company SaaS platform in seconds. Get automated quoting, 
              scheduling, and payments for your business.
            </p>
            <div className="space-y-6">
              {[
                'Instant Quote Engine',
                'Multi-Driver Scheduling',
                'Stripe Payment Integration',
                'Custom Brand Theming',
                'Automated SMS Notifications'
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="bg-white/20 p-1 rounded-full">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 p-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Register Your Company</h3>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. DC Pro Movers"
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                    Portal URL: <strong>{formData.slug || 'slug'}.rapidmove.com</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="md:col-span-2 border-t pt-6 mt-2">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-xs">Admin Account</span>
                    <span>Create Your Login</span>
                  </h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="adminFirstName"
                    value={formData.adminFirstName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="adminLastName"
                    value={formData.adminLastName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {loading ? 'Setting up your portal...' : 'Start My 14-Day Free Trial'}
                </button>
                <p className="text-center text-xs text-gray-500 mt-4">
                  No credit card required. Cancel anytime.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantRegistration;
