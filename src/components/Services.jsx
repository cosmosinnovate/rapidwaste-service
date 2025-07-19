const Services = () => {
  const services = [
    {
      id: 'regular',
      name: 'Regular Trash Pickup',
      price: '$45',
      priceNote: 'Base rate',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      description: 'Scheduled pickup for regular household waste when your standard service is unavailable.',
      features: [
        'Up to 5 standard trash bags',
        'Next business day pickup',
        'Eco-friendly disposal',
        'SMS confirmation',
        'Professional drivers'
      ],
      timeline: '24-48 hours',
      popular: false
    },
    {
      id: 'emergency',
      name: 'Emergency Same-Day',
      price: '$50',
      priceNote: 'Base rate',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 18.5c-.77.833-.192 2.5 1.732 2.5z" />
        </svg>
      ),
      description: 'Urgent same-day pickup for emergency situations and critical waste removal needs.',
      features: [
        'Same-day pickup guaranteed',
        'Up to 5 standard trash bags',
        'Priority scheduling',
        'Real-time tracking',
        '24/7 emergency hotline',
        'Crisis response team'
      ],
      timeline: 'Within 4 hours',
      popular: true
    },
    {
      id: 'bulk',
      name: 'Bulk Item Removal',
      price: '$79',
      priceNote: 'Base rate',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      description: 'Heavy lifting and eco-disposal included. Includes 1 bulky item or up to 100 lbs.',
      features: [
        '24-72 hour pickup',
        'Heavy lifting service included',
        'Eco-friendly disposal',
        '1 bulky item or up to 100 lbs',
        'Professional crew',
        'Load & haul included'
      ],
      addOns: [
        'Extra bulky item: +$35 each',
        'Large load over 100 lbs: +$45',
        'Yard waste (bags over 5): +$5 per bag'
      ],
      timeline: '24-72 hours',
      popular: false,
      customQuote: true
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Professional Services</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Emergency Waste <span className="text-gradient">Solutions</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional waste management services designed to address the current crisis. 
            Dynamic pricing based on bag count and service urgency.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <div key={service.id} className={`service-card relative ${service.popular ? 'ring-2 ring-emergency-500' : ''}`}>
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emergency-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 rounded-lg ${service.popular ? 'bg-emergency-100 text-emergency-600' : 'bg-primary-100 text-primary-600'}`}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.timeline}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">{service.price}</span>
                  <span className="text-gray-600">{service.priceNote}</span>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {service.addOns && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">🔁</span>
                    Add-ons:
                  </h4>
                  <ul className="space-y-2">
                    {service.addOns.map((addon, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="mr-2 mt-1">•</span>
                        <span>{addon}</span>
                      </li>
                    ))}
                  </ul>
                  {service.customQuote && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="mr-2">🔧</span>
                        Need more than 3 items? Free quote available.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                  service.popular 
                    ? 'bg-emergency-600 hover:bg-emergency-700 text-white' 
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}>
                  📲 Book {service.name}
                </button>
                
                {service.customQuote && (
                  <button className="w-full py-2 px-6 rounded-lg font-medium border-2 border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-600 transition-colors duration-200">
                    Ask for Custom Quote
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Item Tips */}
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">💡 Bulk Item Removal Guide</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Make your bulk pickup smooth and cost-effective with these helpful tips.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">📏</span>
                Item Examples
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Recliner = 1 item</li>
                <li>• Dining table = 1-2 items</li>
                <li>• Washer + Dryer = 2 items</li>
                <li>• Mattress/Box spring = 1 item each</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">📷</span>
                Get Quick Quotes
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Send us a photo for instant pricing on large or unusual items.
              </p>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                📲 Send Photo Quote →
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">⚠️</span>
                Not Included
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hazardous waste</li>
                <li>• Demolition work</li>
                <li>• Items over 300 lbs</li>
                <li>• Liquids or chemicals</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dynamic Pricing</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">1-5 bags</span>
                  <span className="font-semibold text-gray-900">Base rate</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">6-10 bags</span>
                  <span className="font-semibold text-gray-900">+$5</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">11+ bags</span>
                  <span className="font-semibold text-gray-900">+$10</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Special disposal fees</span>
                  <span className="font-semibold text-gray-900">As applicable</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose RapidWaste?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="h-6 w-6 text-success-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900">Crisis Response Specialists</span>
                    <p className="text-gray-600 text-sm">Addressing worker shortage with immediate solutions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="h-6 w-6 text-success-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900">Professional & Reliable</span>
                    <p className="text-gray-600 text-sm">Licensed, insured, and background-checked drivers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="h-6 w-6 text-success-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900">Transparent Pricing</span>
                    <p className="text-gray-600 text-sm">No hidden fees, upfront pricing calculator</p>
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

export default Services; 