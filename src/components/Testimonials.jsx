const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Martinez",
      title: "Owner, Martinez Notary Services",
      location: "Austin, TX",
      quote: "I was able to launch my branded site in less than a week! My clients love the professional look—it feels like I run a big firm.",
      rating: 5,
      image: "👩‍💼"
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Certified Notary Public",
      location: "San Francisco, CA",
      quote: "The white-label platform transformed my business. I went from handling 5 clients a week to 25+ with the automated booking system.",
      rating: 5,
      image: "👨‍💻"
    },
    {
      id: 3,
      name: "Jennifer Thompson",
      title: "Thompson Legal Notary",
      location: "Miami, FL",
      quote: "Best investment I've made for my notary business. The compliance features alone saved me thousands in legal consultation fees.",
      rating: 5,
      image: "👩‍⚖️"
    },
    {
      id: 4,
      name: "Robert Williams",
      title: "Williams & Associates Notary",
      location: "Chicago, IL",
      quote: "From solo notary to managing a team of 8 notaries—all thanks to the scalable platform. Our revenue increased 400% in 6 months.",
      rating: 5,
      image: "👨‍💼"
    }
  ];

  const stats = [
    {
      number: "500+",
      label: "Notary Businesses Launched",
      description: "Across all 50 states"
    },
    {
      number: "98%",
      label: "Customer Satisfaction",
      description: "Based on user surveys"
    },
    {
      number: "24/7",
      label: "Support Available",
      description: "When you need help"
    },
    {
      number: "3x",
      label: "Average Revenue Increase",
      description: "Within first 6 months"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Customer Success Stories</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Loved by Notaries <span className="text-gradient-blue">Nationwide</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of successful notary professionals who've transformed their businesses with our white-label platform.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 text-lg mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center">
                <div className="text-4xl mr-4">{testimonial.image}</div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-blue-600 text-sm">{testimonial.title}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted & Compliant Platform
            </h3>
            <p className="text-gray-600">
              Built with enterprise-grade security and nationwide legal compliance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* 50 States Compliant */}
            <div className="flex flex-col items-center">
              <div className="bg-green-100 text-green-600 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">50 States Compliant</h4>
              <p className="text-gray-600 text-sm">Nationwide legal coverage built-in</p>
            </div>

            {/* Bank-Grade Security */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Bank-Grade Security</h4>
              <p className="text-gray-600 text-sm">SSL encryption & secure data handling</p>
            </div>

            {/* BBB Accredited */}
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 text-purple-600 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">BBB Accredited</h4>
              <p className="text-gray-600 text-sm">A+ rating with Better Business Bureau</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
