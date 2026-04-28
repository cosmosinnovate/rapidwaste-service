import { useTenant } from '../contexts/TenantContext';

const Footer = () => {
  const { tenant } = useTenant();

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      {/* Priority Contact Strip */}
      <div className="bg-primary-900 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-2 md:mb-0">
              <svg className="h-6 w-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-bold text-lg">Priority Booking Line</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href={`tel:${tenant?.phone}`} className="text-2xl font-bold hover:text-primary-400 transition-colors">
                {tenant?.phone || '(800) RAPID-MOVE'}
              </a>
              <a href={`sms:${tenant?.phone}`} className="bg-white text-primary-900 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Text Concierge
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-600 p-3 rounded-lg">
                  {tenant?.logo ? (
                    <img src={tenant.logo} alt={tenant.name} className="h-8 w-8 object-contain invert brightness-0" />
                  ) : (
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{tenant?.name || 'Rapid Move & Clear'}</h3>
                  <p className="text-gray-400">Premium Relocation & Clearing</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                The ultimate solution for seamless relocations and complete space clearing. 
                We handle the heavy lifting, from moving your prized possessions to responsibly disposing of the rest.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-success-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Licensed & Fully Insured</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-success-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">White-Glove Moving Specialists</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold mb-6">Our Services</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#services" className="text-gray-300 hover:text-white transition-colors flex items-center justify-between">
                    <span>Priority Move & Clear</span>
                    <span className="bg-primary-600 text-[10px] px-2 py-1 rounded-full">${tenant?.settings?.basePriceEmergency || 1200}+</span>
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-300 hover:text-white transition-colors flex items-center justify-between">
                    <span>Standard Relocation</span>
                    <span className="bg-primary-600 text-[10px] px-2 py-1 rounded-full">${tenant?.settings?.basePriceRegular || 800}+</span>
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-300 hover:text-white transition-colors flex items-center justify-between">
                    <span>Heavy Furniture Haul</span>
                    <span className="bg-primary-600 text-[10px] px-2 py-1 rounded-full">${tenant?.settings?.basePriceBulk || 450}+</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className="text-lg font-bold mb-6">Contact & Support</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Priority Concierge</p>
                  <a href={`tel:${tenant?.phone}`} className="text-white font-bold text-lg hover:text-primary-400 transition-colors">
                    {tenant?.phone || '(800) RAPID-MOVE'}
                  </a>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Support Email</p>
                  <a href={`mailto:${tenant?.contactEmail}`} className="text-gray-300 hover:text-white transition-colors">
                    {tenant?.contactEmail || 'concierge@rapidmoveclear.com'}
                  </a>
                </div>

                <div className="pt-4">
                  <p className="text-gray-400 text-sm mb-2">Service Areas</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Premium local and long-distance relocation services across all major metro areas.
                    <a href="#contact" className="text-primary-400 hover:text-primary-300 ml-1">Check availability</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>&copy; 2026 {tenant?.name || 'Rapid Move & Clear'}. All rights reserved.</p>
              <p className="mt-1">The gold standard in relocation and space management.</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Insurance Coverage
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
