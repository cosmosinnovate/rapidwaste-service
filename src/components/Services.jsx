const Services = () => {
  const services = [
    {
      id: 'general',
      name: 'General Notary Work',
      price: '$15',
      priceNote: 'per signature + fees',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: 'Personal and Professional documents (Ex. Power of Attorney\'s, etc.)',
      features: [
        'Oaths & Affirmations',
        'Acknowledgements',
        'Certified Copies',
        'Fast & Secure Sessions'
      ],
      timeline: '10-15 min session',
      popular: true
    },
    {
      id: 'loan_signing',
      name: 'Loan Documents',
      price: '$100-$250',
      priceNote: 'per package',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
      description: 'First Buyer, HELOC, Refinance, Reverse Mortgage, Seller\'s Package, and more!',
      features: [
        'First Time Buyer Packages',
        'HELOCs & Refinances',
        'Reverse Mortgages',
        'Seller\'s Packages'
      ],
      timeline: '30-60 min session',
      popular: false
    },
    {
      id: 'estate_planning',
      name: 'Estate Planning',
      price: '$120-$400',
      priceNote: 'per package',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: 'Certified Notary Trust Delivery Agent in handling Estate Planning Notarizations',
      features: [
        'Trust Documents',
        'Will Notarizations',
        'Estate Planning Forms',
        'Trust Delivery Services'
      ],
      timeline: '45-90 min session',
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
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Our Notary Services</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Notary <span className="text-gradient-blue">Solutions</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From simple document notarizations to complex international apostilles, we provide a full range of online services to meet your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <div key={service.id} className={`service-card relative ${service.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 rounded-lg ${service.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
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
                    <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 border-t">
                <div className="text-center text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{service.timeline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works section */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our simple, 3-step process makes online notarization a breeze.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-blue-100 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
              <h4 className="font-semibold text-gray-900 mb-2">Upload Document</h4>
              <p className="text-sm text-gray-600">Securely upload your document for notarization.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-blue-100 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
              <h4 className="font-semibold text-gray-900 mb-2">Verify Identity</h4>
              <p className="text-sm text-gray-600">Complete quick identity verification online.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-blue-100 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
              <h4 className="font-semibold text-gray-900 mb-2">Meet Notary Live</h4>
              <p className="text-sm text-gray-600">Connect with a certified notary via video.</p>
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
              <p>All prices include secure video session, document preparation, and compliance verification.</p>
              <p className="mt-2">Contact us for custom pricing on large volume or specialized services.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;