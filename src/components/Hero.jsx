import { useState } from 'react';
import { useTenant } from '../contexts/TenantContext';

const Hero = ({ onQuickQuote }) => {
  const { tenant } = useTenant();
  
  const [quickQuote, setQuickQuote] = useState({
    address: '',
    bagCount: '1-5',
    serviceType: 'regular'
  });

  const heroTitle = tenant?.content?.heroTitle || "Seamless Moving & Space Clearing";
  const heroSubtitle = tenant?.content?.heroSubtitle || `Expert care for the things you keep, and responsible disposal for the things you don't. Experience a stress-free relocation with ${tenant?.name || 'our'} white-glove moving and clearing specialists.`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuickQuote(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    if (onQuickQuote) {
      onQuickQuote(quickQuote);
      // Scroll to booking form
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="home" className="bg-gradient-to-br from-primary-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Full-Service Relocation & Disposal</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {heroTitle.includes('&') ? (
                  <>
                    {heroTitle.split('&')[0]} &
                    <span className="text-gradient block">{heroTitle.split('&')[1]}</span>
                  </>
                ) : heroTitle}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {heroSubtitle}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">5-Star</div>
                <div className="text-sm text-gray-600">Premium Service</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">Priority</div>
                <div className="text-sm text-gray-600">Same-Day Options</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">100%</div>
                <div className="text-sm text-gray-600">Care Guarantee</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking" className="bg-primary-600 hover:opacity-90 text-primary-fg px-8 py-4 rounded-xl font-bold text-lg text-center transition-all shadow-lg hover:shadow-xl">
                Priority Booking
              </a>
              <a href="#services" className="bg-white border-2 border-primary-100 text-primary-600 hover:border-primary-600 px-8 py-4 rounded-xl font-bold text-lg text-center transition-all">
                Our Services
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>White-Glove Moving</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Professional Clearing</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Licensed & Insured</span>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="space-y-6">
                {/* Premium Badge */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-800">Priority Concierge</h3>
                      <p className="text-sm text-primary-600 mt-1">
                        Stress-free moving and space clearing starts here.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Booking */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Get Your Instant Quote</h3>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      name="address"
                      value={quickQuote.address}
                      onChange={handleInputChange}
                      placeholder="Pickup Address" 
                      className="input-field text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select 
                        name="bagCount"
                        value={quickQuote.bagCount}
                        onChange={handleInputChange}
                        className="input-field text-sm"
                      >
                        <option value="">Move Size</option>
                        <option value="1-5">Studio / 1-BR</option>
                        <option value="6-10">2-Bedroom</option>
                        <option value="11+">3+ Bedroom</option>
                        <option value="11+">Heavy Haul</option>
                      </select>
                      <select className="input-field text-sm">
                        <option value="">Distance</option>
                        <option value="local">Local (&lt; 50 mi)</option>
                        <option value="short">Short (50-100 mi)</option>
                        <option value="long">Long (100+ mi)</option>
                      </select>
                    </div>
                    <select 
                      name="serviceType"
                      value={quickQuote.serviceType}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                    >
                      <option value="regular">Standard Move & Clear (${tenant?.settings?.basePriceRegular || 800})</option>
                      <option value="emergency">Priority Same-Day (+${tenant?.settings?.basePriceEmergency - tenant?.settings?.basePriceRegular || 400})</option>
                      <option value="bulk">Specialty Heavy Haul</option>
                    </select>
                    <button 
                      onClick={handleCalculate}
                      className="bg-primary-600 hover:opacity-90 text-primary-fg w-full py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                    >
                      Calculate Priority Quote
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Booking Concierge</p>
                    <p className="font-bold text-lg text-gray-900">{tenant?.phone || '(800) RAPID-MOVE'}</p>
                    <p className="text-xs text-gray-500">Available 24/7 for priority relocations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
