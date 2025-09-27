import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';
import ApiService from '../services/api';

// Import modular components
import OverviewTab from './admin/tabs/OverviewTab';
import BookingsTab from './admin/tabs/BookingsTab';
import NotariesTab from './admin/tabs/NotariesTab';
import CustomersTab from './admin/tabs/CustomersTab';
import TenantManagementTab from './admin/TenantManagementTab';
import TenantOnboardingDashboard from './TenantOnboardingDashboard';

// Import utilities
import { validateStatusTransition } from './admin/utils/statusUtils.jsx';

const AdminDashboard = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [notaries, setNotaries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [updatingBooking, setUpdatingBooking] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching dashboard data...');

      // Fetch bookings
      console.log('Fetching bookings...');
      const bookingsResponse = await ApiService.getAllBookings();
      console.log('Bookings response:', bookingsResponse);
      const allBookings = bookingsResponse.data || [];
      setBookings(allBookings);

      // Fetch notaries
      console.log('Fetching notaries...');
      const notariesResponse = await ApiService.getAvailableNotaries();
      console.log('Notaries response:', notariesResponse);
      setNotaries(notariesResponse.data || []);

      // Calculate stats
      console.log('Calculating stats with bookings:', allBookings.length);
      const totalBookings = allBookings.length;
      const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
      const activeSessions = allBookings.filter(b => b.status === 'session-active').length;
      const completedToday = allBookings.filter(b => {
        const today = new Date().toISOString().split('T')[0];
        const bookingDate = new Date(b.preferredDate).toISOString().split('T')[0];
        return b.status === 'documents-ready' && bookingDate === today;
      }).length;

      const totalRevenue = allBookings
        .filter(b => b.status === 'documents-ready')
        .reduce((sum, b) => sum + (b.price || 0), 0);

      const availableNotaries = notariesResponse.data?.filter(n => n.isActive !== false).length || 0;

      const calculatedData = {
        totalBookings,
        pendingBookings,
        activeSessions,
        completedToday,
        totalRevenue,
        availableNotaries,
        totalNotaries: notariesResponse.data?.length || 0,
      };
      
      console.log('Calculated dashboard data:', calculatedData);
      setDashboardData(calculatedData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(`Failed to load dashboard data: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status, retryCount = 0) => {
    const booking = bookings.find(b => b._id === bookingId);
    
    // Validate status transition
    if (booking && !validateStatusTransition(booking.status, status)) {
      setError(`Invalid status transition from ${booking.status} to ${status}. Please follow the correct workflow: pending → scheduled → session-active → documents-ready`);
      return;
    }

    try {
      setUpdatingBooking(bookingId);
      setError('');
      setSuccessMessage('');
      
      // Add contextual data based on status
      const additionalData = {};
      if (status === 'documents-ready') {
        additionalData.adminNotes = 'Notarization completed by admin';
      } else if (status === 'session-active') {
        additionalData.adminNotes = 'Notary session started by admin';
      } else if (status === 'canceled') {
        additionalData.adminNotes = 'Booking cancelled by admin';
      }
      
      await ApiService.updateBookingStatus(bookingId, status, additionalData);
      await fetchDashboardData(); // Refresh data
      setUpdatingBooking(null);
      setSuccessMessage(`Booking status updated to ${status} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating booking status:', error);
      setUpdatingBooking(null);
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      
      // Offer retry for network errors
      if (retryCount < 2 && (error.code === 'NETWORK_ERROR' || error.name === 'NetworkError')) {
        setError(`Network error occurred. Retrying... (${retryCount + 1}/2)`);
        setTimeout(() => {
          handleUpdateBookingStatus(bookingId, status, retryCount + 1);
        }, 1000);
        return;
      }
      
      setError(`Failed to update booking status: ${errorMessage}${retryCount > 0 ? ' (After retrying)' : ''}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isAdmin]);

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Admin Access Required</h2>
              <p className="text-gray-600 mt-2">Please log in with your admin credentials to access the dashboard.</p>
            </div>
            <LoginForm onClose={() => setShowLoginModal(false)} />
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 18.5c-.77.833-.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Access Denied</h2>
            <p className="text-gray-600 mt-2">You need admin privileges to access this dashboard.</p>
            <button
              onClick={logout}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NotaryNow Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.firstName} {user?.lastName}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: 'home' },
              { id: 'bookings', name: 'Notarization Sessions', icon: 'clipboard' },
              { id: 'notaries', name: 'Notaries', icon: 'user-check' },
              { id: 'customers', name: 'Customers', icon: 'users' },
              { id: 'tenants', name: 'Tenants', icon: 'building' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 font-bold text-lg"
            >
              ×
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage('')}
              className="text-green-500 hover:text-green-700 font-bold text-lg"
            >
              ×
            </button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab 
            dashboardData={dashboardData}
            bookings={bookings}
            notaries={notaries}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsTab 
            bookings={bookings}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            updatingBooking={updatingBooking}
            handleUpdateBookingStatus={handleUpdateBookingStatus}
          />
        )}

        {activeTab === 'notaries' && (
          <NotariesTab notaries={notaries} />
        )}

        {activeTab === 'customers' && (
          <CustomersTab bookings={bookings} />
        )}

        {activeTab === 'tenants' && (
          <TenantOnboardingDashboard />
        )}
      </div>


    </div>
  );
};

export default AdminDashboard; 