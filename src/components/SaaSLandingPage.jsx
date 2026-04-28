import { useTenant } from '../contexts/TenantContext';

const SaaSLandingPage = ({ onSignUp }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-primary-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-800/50 border border-primary-700 text-primary-200 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>The #1 Revenue Engine for Independent Movers</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Book more moves, while you're <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-300">on the job.</span>
          </h1>
          
          <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop losing $1,000+ jobs to missed calls and slow quotes. Rapid Move SaaS is the "Shopify for Movers"—an automated growth engine that turns leads into paid deposits 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={onSignUp}
              className="bg-white text-primary-900 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-primary-50 transition-all shadow-2xl"
            >
              Start My 14-Day Free Trial
            </button>
            <a href="#features" className="bg-primary-800 text-white border border-primary-700 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-primary-700 transition-all">
              See How It Works
            </a>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-primary-300 text-sm">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Instant Setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Problem Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-500 uppercase tracking-widest mb-4">The Reality</h2>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Movers miss 40% of inbound calls. <br/>
                <span className="text-red-600">That's $5,000+ lost per week.</span>
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                You can't answer the phone while you're carrying a couch. But your customers won't wait. 
                They want an instant price, a guaranteed slot, and a professional experience.
              </p>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary-600">
                  <h4 className="font-bold text-gray-900 mb-1">Old Way:</h4>
                  <p className="text-gray-600 italic text-sm">"I'll call you back with a quote in 3 hours" → Customer goes to a competitor.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                  <h4 className="font-bold text-gray-900 mb-1">Rapid Move Way:</h4>
                  <p className="text-gray-600 italic text-sm">Customer gets instant quote → Pays deposit → Job appears on your calendar automatically.</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="bg-primary-100 h-12 w-12 rounded-2xl flex items-center justify-center text-primary-600 mb-6 font-bold text-xl">1</div>
                <h4 className="text-xl font-bold mb-3">Instant Quote Engine</h4>
                <p className="text-gray-500 text-sm">Stop guessing. Our MoveBuddha-powered estimator gives accurate prices based on home size and mileage.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="bg-primary-100 h-12 w-12 rounded-2xl flex items-center justify-center text-primary-600 mb-6 font-bold text-xl">2</div>
                <h4 className="text-xl font-bold mb-3">Deposit-First Booking</h4>
                <p className="text-gray-500 text-sm">Lock in customers immediately with Stripe-powered deposits. No more no-shows.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="bg-primary-100 h-12 w-12 rounded-2xl flex items-center justify-center text-primary-600 mb-6 font-bold text-xl">3</div>
                <h4 className="text-xl font-bold mb-3">Professional White-Label</h4>
                <p className="text-gray-500 text-sm">Your logo, your colors, your domain. Look like a 7-figure moving enterprise from day one.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="bg-primary-100 h-12 w-12 rounded-2xl flex items-center justify-center text-primary-600 mb-6 font-bold text-xl">4</div>
                <h4 className="text-xl font-bold mb-3">Auto-Dispatch Dashboard</h4>
                <p className="text-gray-600 text-sm">Manage trucks, drivers, and schedules in one centralized operating system.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Urgency */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Launch your automated portal in 60 seconds.</h2>
          <div className="max-w-4xl mx-auto bg-primary-50 rounded-3xl p-12 border border-primary-100">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary-600 mb-2">100%</p>
                <p className="text-gray-600 text-sm font-medium uppercase tracking-wider">Lead Recovery</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-600 mb-2">24/7</p>
                <p className="text-gray-600 text-sm font-medium uppercase tracking-wider">Automated Sales</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-600 mb-2">+28%</p>
                <p className="text-gray-600 text-sm font-medium uppercase tracking-wider">Avg. Booking Value</p>
              </div>
            </div>
            <button 
              onClick={onSignUp}
              className="mt-12 bg-primary-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-all"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; 2026 Rapid Move SaaS. The operating system for growth-minded movers.</p>
        </div>
      </footer>
    </div>
  );
};

export default SaaSLandingPage;
