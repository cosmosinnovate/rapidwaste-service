import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { TenantProvider, useTenant } from './contexts/TenantContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import BookingFormWithPayment from './components/BookingFormWithPayment'
import Footer from './components/Footer'
import DriverDashboard from './components/DriverDashboard'
import AdminDashboard from './components/AdminDashboard'
import TenantRegistration from './components/TenantRegistration'
import SaaSLandingPage from './components/SaaSLandingPage'

function AppContent() {
  const [currentView, setCurrentView] = useState('main')
  const [quickQuoteData, setQuickQuoteData] = useState(null)
  
  const { user, isAuthenticated, isDriver, isAdmin } = useAuth();
  const { tenant, isDefaultTenant, error: tenantError } = useTenant();

  const handleQuickQuote = (data) => {
    setQuickQuoteData(data);
  };

  // Determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    if (isAdmin) return <AdminDashboard />;
    if (isDriver) return <DriverDashboard />;
    return <DriverDashboard />;
  };

  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-gray-50">
        <TenantRegistration onBack={() => setCurrentView('main')} />
      </div>
    );
  }

  // If on the root domain/default tenant, show the SaaS Sales Page
  if (isDefaultTenant && currentView === 'main') {
    return (
      <div className="min-h-screen font-sans antialiased">
        <SaaSLandingPage onSignUp={() => setCurrentView('register')} />
        
        {/* Floating Staff Portal Button for Saas Page */}
        <div className="fixed bottom-4 right-4 z-50">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Staff Portal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {currentView === 'dashboard' ? (
        <div className="bg-gray-50 min-h-screen">
          {getDashboardComponent()}
          <div className="fixed bottom-4 right-4 z-50">
            <button 
              onClick={() => setCurrentView('main')}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-lg font-medium hover:bg-gray-50 transition-all"
            >
              ← Back to Main Site
            </button>
          </div>
        </div>
      ) : (
        <>
          <Header />
          <main>
            <Hero onQuickQuote={handleQuickQuote} />
            <Services />
            <BookingFormWithPayment initialData={quickQuoteData} />
          </main>
          <Footer />
          
          {/* Admin/Driver Access Button for White-labeled Site */}
          <div className="fixed bottom-4 right-4 z-50">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="bg-primary-900 hover:bg-black text-white px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>
                {isAuthenticated 
                  ? (isAdmin ? 'Admin Portal' : 'Driver Portal')
                  : 'Mover Login'
                }
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TenantProvider>
  )
}

export default App
