import { useTenant } from '../contexts/TenantContext';

const Services = () => {
  const { tenant } = useTenant();
  
  const services = [
    {
      id: 'regular',
      name: 'Standard Move & Clear',
      price: `$${tenant?.settings?.basePriceRegular || 800}`,
      priceNote: 'Starting at',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      description: 'The perfect solution for scheduled relocations and comprehensive space clearing.',
      features: [
        'Professional moving team',
        'Standard box & item hauling',
        'Responsible item disposal',
        'SMS status updates',
        'Licensed & insured crew'
      ],
      timeline: 'Scheduled arrival',
      popular: false
    },
    {
      id: 'emergency',
      name: 'Priority Same-Day',
      price: `$${tenant?.settings?.basePriceEmergency || 1200}`,
      priceNote: 'Starting at',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'Urgent relocation or clearing needs? Our priority team is ready for immediate deployment.',
      features: [
        'Guaranteed same-day service',
        'Priority dispatching',
        'Complete packing & clearing',
        'Real-time truck tracking',
        '24/7 priority support',
        'Elite relocation team'
      ],
      timeline: 'Within 4 hours',
      popular: true
    },
    {
      id: 'bulk',
      name: 'Heavy Furniture & Bulk',
      price: `$${tenant?.settings?.basePriceBulk || 450}`,
      priceNote: 'Starting at',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      description: 'Expert transport or disposal for oversized items, pianos, and heavy machinery.',
      features: [
        'Specialized heavy lifting',
        'Multi-crew coordination',
        'Safe transport guarantee',
        'Eco-disposal for large items',
        'Professional equipment',
        'Complete load & haul'
      ],
      addOns: [
        'Additional heavy item: +$150 each',
        'Oversized load (100lb+): +$250',
        'Extra-mile transport: Custom quote'
      ],
      timeline: '24-72 hours',
      popular: false,
      customQuote: true
    }
  ];

  const servicesTitle = tenant?.content?.servicesTitle || "Relocation & Clearing Solutions";
  const servicesSubtitle = tenant?.content?.servicesSubtitle || "Top-tier moving and disposal services tailored to your needs. Transparent pricing and elite care for every item we handle.";

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Elite Services</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {servicesTitle.includes('&') ? (
              <>
                {servicesTitle.split('&')[0]} & <span className="text-gradient">{servicesTitle.split('&')[1]}</span>
              </>
            ) : servicesTitle}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {servicesSubtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                service.popular ? 'border-primary-500 scale-105 z-10' : 'border-transparent'
              }`}
            >
              {service.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <div className="bg-primary-50 w-16 h-16 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{service.price}</span>
                  <span className="ml-1 text-sm text-gray-500">{service.priceNote}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <svg className="h-5 w-5 text-success-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Timeline</p>
                  <p className="text-sm font-semibold text-gray-900">{service.timeline}</p>
                </div>
                <a 
                  href="#booking" 
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${
                    service.popular 
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Information */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Relocation Estimates</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Studio / 1-Bedroom (Local)</span>
                  <span className="font-semibold text-gray-900">Avg. $800 - $1,200</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">2-Bedroom Home (Local)</span>
                  <span className="font-semibold text-gray-900">Avg. $1,500 - $2,800</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">3-Bedroom+ Home (Local)</span>
                  <span className="font-semibold text-gray-900">Avg. $3,500 - $6,500+</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Long Distance (100+ miles)</span>
                  <span className="font-semibold text-primary-600">Avg. $4,500 - $15,000+</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                *Estimates based on industry benchmarks. Final price includes labor, travel, and disposal fees.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The {tenant?.name || 'Rapid'} Advantage</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="h-6 w-6 text-success-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900">Transparent Hourly Rates</span>
                    <p className="text-gray-600 text-sm">No hidden "inventory" fees for local moves</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="h-6 w-6 text-success-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900">White-Glove Care</span>
                    <p className="text-gray-600 text-sm">Licensed, insured, and background-checked specialists</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="h-6 w-6 text-success-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900">All-In-One Solution</span>
                    <p className="text-gray-600 text-sm">We move what you keep & clear what you don't</p>
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
