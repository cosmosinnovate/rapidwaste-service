const WhyWhiteLabel = () => {
  return (
    <section id="why-white-label" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>Turnkey Solution</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Turnkey Solution for <span className="text-gradient-blue">Notary Businesses</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Launch your own branded notary service without coding. Keep your clients, we power the tech. 
            Scale your business with our secure, 50-state compliant solution.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Boost Revenue */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 text-green-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">📈 Boost Revenue</h3>
            <p className="text-gray-600 text-center">
              Expand your service offerings and increase client retention with a professional platform that works 24/7.
            </p>
          </div>

          {/* Fast Setup */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">⚡ Fast Setup</h3>
            <p className="text-gray-600 text-center">
              Go from idea to launch in days, not months. No technical expertise required—just your brand and vision.
            </p>
          </div>

          {/* Secure & Compliant */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 text-purple-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🔒 Secure & Compliant</h3>
            <p className="text-gray-600 text-center">
              Bank-grade security and nationwide legal compliance built-in. Focus on your business, not regulations.
            </p>
          </div>

          {/* Fully Customizable */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 text-orange-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M15 5l2 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🎨 Fully Customizable</h3>
            <p className="text-gray-600 text-center">
              Your logo, colors, and branding throughout. Clients see your business, not ours.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              "It's like Shopify for Notaries"
            </h3>
            <p className="text-gray-600 mb-6">
              Your Business. Your Brand. Our Tech.
            </p>
            <a href="#demo" className="btn-primary inline-block px-8 py-3">
              See How It Works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWhiteLabel;
