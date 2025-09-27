const Services = () => {
  const platformFeatures = [
    {
      id: 'branded_landing',
      name: 'Branded Landing Page',
      badge: 'Your Logo Here',
      mockup: 'Landing Page Preview',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Professional landing page with your branding, colors, and logo throughout',
      features: [
        'Custom Logo & Colors',
        'Your Business Name',
        'Branded Domain Options',
        'Mobile Responsive Design'
      ],
      setup: 'Ready in minutes',
      popular: true
    },
    {
      id: 'booking_system',
      name: 'Booking & Payments',
      badge: 'Fully Integrated',
      mockup: 'Booking Flow Preview',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Complete scheduling system with payment processing and client notifications',
      features: [
        'Real-time Scheduling',
        'Payment Processing',
        'Client Notifications',
        'Automated Reminders'
      ],
      setup: 'Plug & play',
      popular: false
    },
    {
      id: 'admin_dashboard',
      name: 'Admin Dashboard',
      badge: 'Multi-Notary Support',
      mockup: 'Dashboard Preview',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: 'Comprehensive management dashboard for notaries and business owners',
      features: [
        'Appointment Management',
        'Revenue Analytics',
        'Client Database',
        'Performance Reports'
      ],
      setup: 'Instant access',
      popular: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>Platform Showcase</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            A Modern Notary Experience—<span className="text-gradient-blue">With Your Branding</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Screenshots and mockups of the booking flow, pricing table, and customer dashboard with your brand logo watermark. 
            Add, remove, or customize services with your own pricing strategy.
          </p>
        </div>

        {/* Platform Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {platformFeatures.map((feature) => (
            <div key={feature.id} className={`service-card relative ${feature.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {feature.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 rounded-lg ${feature.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.name}</h3>
                  <p className="text-sm text-gray-600">{feature.setup}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-lg font-bold text-blue-600">{feature.badge}</span>
                  <span className="text-gray-600">{feature.mockup}</span>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {feature.features.map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 border-t">
                <div className="text-center text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{feature.setup}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works section - B2B Focus */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works for Your Business</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Your customers see your brand, while we handle the technology. A seamless 3-step process for notary business owners.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-blue-100 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
              <h4 className="font-semibold text-gray-900 mb-2">Setup Your Brand</h4>
              <p className="text-sm text-gray-600">Add your logo, colors, and business information to create your branded platform.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-blue-100 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
              <h4 className="font-semibold text-gray-900 mb-2">Configure Services</h4>
              <p className="text-sm text-gray-600">Set your pricing, availability, and service offerings to match your business model.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-blue-100 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
              <h4 className="font-semibold text-gray-900 mb-2">Launch & Grow</h4>
              <p className="text-sm text-gray-600">Go live with your branded notary service and start accepting bookings from day one.</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <div className="bg-blue-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions or Need Help?</h3>
            <p className="text-gray-600 mb-6">
              Our support team is available 24/7 to assist you.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-lg font-semibold text-blue-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2z" />
                </svg>
                <span>(888) NOTARY-NOW</span>
              </div>
              <div className="text-sm text-gray-500">Available 24/7 for support</div>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="text-center mt-16">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Pricing Information</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">General Notary Work</h4>
                <p className="text-sm text-gray-600 mb-3">$15 per signature + $10 service fee</p>
                <p className="text-xs text-gray-500">Perfect for personal documents, contracts, and basic notarizations</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Loan Documents</h4>
                <p className="text-sm text-gray-600 mb-3">$100 - $250 per package</p>
                <p className="text-xs text-gray-500">Comprehensive loan signing services for all mortgage types</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Estate Planning</h4>
                <p className="text-sm text-gray-600 mb-3">$120 - $400 per package</p>
                <p className="text-xs text-gray-500">Specialized notary services for trusts, wills, and estate documents</p>
              </div>
            </div>
            <div className="mt-6 text-sm text-gray-600">
              <p>All prices include secure document preparation, and compliance verification.</p>
              <p className="mt-2">Contact us for custom pricing on large volume or specialized services.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;