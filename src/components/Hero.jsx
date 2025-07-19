const Hero = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-primary-50 to-emergency-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emergency-100 text-emergency-800 px-4 py-2 rounded-full text-sm font-medium">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Crisis Response Active</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Emergency Waste
                <span className="text-gradient block">Pickup Service</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                When regular waste management fails, we deliver. Professional emergency pickup service addressing the critical worker shortage with same-day response and reliable cleanup solutions.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">24/7</div>
                <div className="text-sm text-gray-600">Emergency Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">&lt; 4hrs</div>
                <div className="text-sm text-gray-600">Same-Day Pickup</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">100%</div>
                <div className="text-sm text-gray-600">Reliability</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking" className="btn-emergency text-center">
                Emergency Booking - $50
              </a>
              <a href="#services" className="btn-primary text-center">
                View All Services
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Eco-Friendly Disposal</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Vetted Drivers</span>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="space-y-6">
                {/* Crisis Alert */}
                <div className="bg-emergency-50 border border-emergency-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-emergency-100 p-2 rounded-lg">
                      <svg className="h-6 w-6 text-emergency-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 18.5c-.77.833-.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-emergency-800">Worker Shortage Crisis</h3>
                      <p className="text-sm text-emergency-600 mt-1">
                        Regular waste services disrupted. Emergency response needed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Booking */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Quick Emergency Booking</h3>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Your Address" 
                      className="input-field text-sm"
                    />
                    <select className="input-field text-sm">
                      <option>Emergency Same-Day ($50)</option>
                      <option>Regular Pickup ($45)</option>
                      <option>Bulk Removal ($79)</option>
                    </select>
                    <button className="btn-emergency w-full">
                      Get Instant Quote
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Emergency Hotline</p>
                    <p className="font-bold text-lg text-gray-900">(800) RAPID-WASTE</p>
                    <p className="text-xs text-gray-500">Available 24/7 for urgent pickups</p>
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