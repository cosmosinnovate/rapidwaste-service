const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      {/* Emergency Contact Strip */}
      <div className="bg-emergency-600 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-2 md:mb-0">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-bold text-lg">24/7 Emergency Hotline</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="tel:+1-800-RAPID-WASTE" className="text-2xl font-bold hover:text-emergency-200 transition-colors">
                (800) RAPID-WASTE
              </a>
              <a href="sms:+1-800-RAPID-WASTE" className="bg-white text-emergency-600 px-4 py-2 rounded-lg font-semibold hover:bg-emergency-50 transition-colors">
                Text Us
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
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">RapidWaste</h3>
                  <p className="text-gray-400">Emergency Pickup Service</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Professional emergency waste management service addressing the critical worker shortage crisis. 
                We provide reliable, same-day pickup solutions when regular services fail.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-success-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Licensed & Insured</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-success-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Vetted Professional Drivers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-success-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Eco-Friendly Disposal</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold mb-6">Our Services</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#services" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                    <span>Emergency Same-Day Pickup</span>
                    <span className="bg-emergency-600 text-xs px-2 py-1 rounded-full">$50</span>
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                    <span>Regular Trash Pickup</span>
                    <span className="bg-primary-600 text-xs px-2 py-1 rounded-full">$45</span>
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                    <span>Bulk Item Removal</span>
                    <span className="bg-primary-600 text-xs px-2 py-1 rounded-full">$79</span>
                  </a>
                </li>
                <li>
                  <a href="#booking" className="text-gray-300 hover:text-white transition-colors">
                    Online Booking System
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                    24/7 Customer Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className="text-lg font-bold mb-6">Contact & Support</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Emergency Hotline</p>
                  <a href="tel:+1-800-RAPID-WASTE" className="text-white font-bold text-lg hover:text-primary-400 transition-colors">
                    (800) RAPID-WASTE
                  </a>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm mb-1">Customer Service</p>
                  <a href="tel:+1-555-SUPPORT" className="text-gray-300 hover:text-white transition-colors">
                    (555) SUPPORT
                  </a>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Email Support</p>
                  <a href="mailto:help@rapidwaste.com" className="text-gray-300 hover:text-white transition-colors">
                    help@rapidwaste.com
                  </a>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Emergency Email</p>
                  <a href="mailto:emergency@rapidwaste.com" className="text-emergency-400 hover:text-emergency-300 transition-colors font-semibold">
                    emergency@rapidwaste.com
                  </a>
                </div>

                <div className="pt-4">
                  <p className="text-gray-400 text-sm mb-2">Service Areas</p>
                  <p className="text-gray-300 text-sm">
                    Currently serving metro areas affected by waste management worker shortages. 
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
              <p>&copy; 2024 RapidWaste Emergency Services. All rights reserved.</p>
              <p className="mt-1">Crisis response waste management solutions.</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Safety Guidelines
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 