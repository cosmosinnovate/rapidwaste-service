const WhiteLabelBenefits = () => {
  return (
    <section id="benefits" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>B2B Value Proposition</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Partner <span className="text-gradient-blue">With Us?</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your notary business with our white-label platform. It's like Shopify for Notaries—
            your business, your brand, our technology.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Speed to Market */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="bg-green-100 text-green-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Speed to Market</h3>
            <p className="text-gray-600 mb-4">Launch in days, not months</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• No development time</li>
              <li>• Pre-built templates</li>
              <li>• Instant deployment</li>
            </ul>
          </div>

          {/* Cost Savings */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Savings</h3>
            <p className="text-gray-600 mb-4">No dev team needed</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• No hiring developers</li>
              <li>• No infrastructure costs</li>
              <li>• Predictable pricing</li>
            </ul>
          </div>

          {/* Compliance */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="bg-purple-100 text-purple-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Compliance</h3>
            <p className="text-gray-600 mb-4">Nationwide legal coverage</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• 50-state compliant</li>
              <li>• Bank-grade security</li>
              <li>• Legal documentation</li>
            </ul>
          </div>

          {/* Scalability */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="bg-orange-100 text-orange-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Scalability</h3>
            <p className="text-gray-600 mb-4">From solo notaries to large firms</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• Multi-notary support</li>
              <li>• Enterprise features</li>
              <li>• Custom integrations</li>
            </ul>
          </div>
        </div>

        {/* Marketing Gimmicks Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Transform Your Notary Business Today
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join hundreds of notary professionals who've already launched their branded platforms
            </p>
          </div>

          {/* Key Marketing Messages */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                "Your Notary Business, Powered by Our Tech"
              </h4>
              <p className="text-gray-600">
                Keep 100% of your client relationships while we handle all the technical complexity behind the scenes.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                "Compliant, Secure, and Built for Growth"
              </h4>
              <p className="text-gray-600">
                Enterprise-grade security and nationwide compliance built-in, so you can focus on growing your business.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">
                White-Label Notary = More Clients + Less Tech Stress
              </h4>
              <p className="text-blue-100 mb-6">
                Start building your branded notary service today with our turnkey platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#demo" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                  Book a Demo
                </a>
                <a href="#pricing" className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhiteLabelBenefits;
