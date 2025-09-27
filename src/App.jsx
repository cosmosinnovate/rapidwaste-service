import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import WhyWhiteLabel from './components/WhyWhiteLabel'
import Services from './components/Services'
import WhiteLabelBenefits from './components/WhiteLabelBenefits'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import BookingForm from './components/BookingForm'
import Footer from './components/Footer'
import DemoPage from './components/DemoPage'
import NotaryDashboard from './components/NotaryDashboard'
import AdminDashboard from './components/AdminDashboard'
import TenantOnboardingDashboard from './components/TenantOnboardingDashboard'

function AppContent() {
  const [currentView, setCurrentView] = useState('main') // 'main', 'demo', 'dashboard', or 'tenant'
  const { user, isAuthenticated, isDriver, isAdmin } = useAuth();

  // Handle hash-based routing for demo page
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#demo') {
      setCurrentView('demo');
    } else if (hash === '#dashboard') {
      setCurrentView('dashboard');
    } else if (hash === '#tenant') {
      setCurrentView('tenant');
    } else {
      setCurrentView('main');
    }

    // Handle browser back/forward buttons
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#demo') {
        setCurrentView('demo');
      } else if (hash === '#dashboard') {
        setCurrentView('dashboard');
      } else if (hash === '#tenant') {
        setCurrentView('tenant');
      } else {
        setCurrentView('main');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when view changes
  useEffect(() => {
    if (currentView === 'demo' && window.location.hash !== '#demo') {
      window.location.hash = '#demo';
    } else if (currentView === 'dashboard' && window.location.hash !== '#dashboard') {
      window.location.hash = '#dashboard';
    } else if (currentView === 'tenant' && window.location.hash !== '#tenant') {
      window.location.hash = '#tenant';
    } else if (currentView === 'main' && window.location.hash !== '') {
      window.location.hash = '';
    }
  }, [currentView]);

  // Determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    if (isAdmin) {
      return <AdminDashboard />;
    } else if (isDriver) {
      return <NotaryDashboard />;
    } else {
      // Default to notary dashboard for backwards compatibility
      return <NotaryDashboard />;
    }
  };

  return (
    <>
      {currentView === 'dashboard' ? (
        <div className="min-h-screen bg-gray-50">
          {getDashboardComponent()}
          <div className="fixed bottom-4 right-4">
            <button 
              onClick={() => setCurrentView('main')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium"
            >
              ← Back to Main Site
            </button>
          </div>
        </div>
      ) : currentView === 'tenant' ? (
        <div className="min-h-screen bg-gray-50">
          <TenantOnboardingDashboard />
          <div className="fixed bottom-4 left-4">
            <button 
              onClick={() => setCurrentView('main')}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-lg font-medium flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Platform</span>
            </button>
          </div>
        </div>
      ) : currentView === 'demo' ? (
        <div className="min-h-screen bg-gray-50">
          <DemoPage />
          <div className="fixed bottom-4 left-4">
            <button 
              onClick={() => setCurrentView('main')}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-lg font-medium flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Platform</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Hero />
            <WhyWhiteLabel />
            <Services />
            <WhiteLabelBenefits />
            <Pricing />
            <Testimonials />
            <BookingForm />
          </main>
          <Footer />
          
          {/* Admin/Driver Access Button */}
          <div className="fixed bottom-4 right-4">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>
                {isAuthenticated 
                  ? (isAdmin ? 'Admin Portal' : 'Notary Portal')
                  : 'Staff Portal'
                }
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App 