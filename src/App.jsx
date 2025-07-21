import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import BookingFormWithPayment from './components/BookingFormWithPayment'
import Footer from './components/Footer'
import DriverDashboard from './components/DriverDashboard'
import AdminDashboard from './components/AdminDashboard'

function AppContent() {
  const [currentView, setCurrentView] = useState('main') // 'main' or 'dashboard'
  const { user, isAuthenticated, isDriver, isAdmin } = useAuth();

  // Determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    if (isAdmin) {
      return <AdminDashboard />;
    } else if (isDriver) {
      return <DriverDashboard />;
    } else {
      // Default to driver dashboard for backwards compatibility
      return <DriverDashboard />;
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
      ) : (
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Hero />
            <Services />
            <BookingFormWithPayment />
          </main>
          <Footer />
          
          {/* Admin/Driver Access Button */}
          <div className="fixed bottom-4 right-4">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="bg-emergency-600 hover:bg-emergency-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>
                {isAuthenticated 
                  ? (isAdmin ? 'Admin Portal' : 'Driver Portal')
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