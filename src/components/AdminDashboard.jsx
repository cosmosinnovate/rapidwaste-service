import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';
import ApiService from '../services/api';

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

  const validateStatusTransition = (currentStatus, newStatus) => {
    const validTransitions = {
      pending: ['scheduled', 'canceled'],
      scheduled: ['session-active', 'canceled'],
      'session-active': ['documents-ready', 'canceled'],
      'documents-ready': [],
      canceled: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'session-active': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'documents-ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'general':
        return (
          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'loan_signing':
        return (
          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'estate_planning':
        return (
          <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
    }
  };

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

  const filteredBookings = bookings.filter(booking => {
    const statusMatch = selectedStatus === 'all' || booking.status === selectedStatus;
    const dateMatch = !selectedDate || 
      new Date(booking.preferredDate).toISOString().split('T')[0] === selectedDate;
    return statusMatch && dateMatch;
  });

  console.log('bookings', bookings);

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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-100 p-4 rounded text-sm">
                <p>Debug: dashboardData = {dashboardData ? 'loaded' : 'null'}</p>
                <p>Debug: bookings count = {bookings.length}</p>
                <p>Debug: notaries count = {notaries.length}</p>
              </div>
            )}
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v2m0 8a2 2 0 002 2h2m8-12h2a2 2 0 012 2v2m0 8a2 2 0 01-2 2h-2M9 5v14m6-14v14" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Sessions</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {dashboardData ? dashboardData.totalBookings : bookings.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Sessions</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {dashboardData ? dashboardData.pendingBookings : bookings.filter(b => b.status === 'pending').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          ${dashboardData ? dashboardData.totalRevenue : bookings.filter(b => b.status === 'documents-ready').reduce((sum, b) => sum + (b.price || 0), 0)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Available Notaries</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {dashboardData ? `${dashboardData.availableNotaries}/${dashboardData.totalNotaries}` : `${notaries.filter(n => n.isActive !== false).length}/${notaries.length}`}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Notarization Sessions</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {bookings.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No notarization sessions found
                  </div>
                ) : (
                  bookings.slice(0, 5).map((booking) => (
                    <div key={booking._id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getServiceIcon(booking.serviceType)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {booking.firstName} {booking.lastName} - {booking.bookingId}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.serviceType} notarization • {booking.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className="text-sm text-gray-500">${booking.price}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">New User (Pending)</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="session-active">Processing (Active Session)</option>
                    <option value="documents-ready">Processed (Ready)</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedStatus('all');
                      setSelectedDate('');
                    }}
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Notarization Sessions ({filteredBookings.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <div key={booking._id} className="px-6 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          {getServiceIcon(booking.serviceType)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{booking.bookingId}</p>
                            <p className="text-sm text-gray-500">{booking.firstName} {booking.lastName}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{booking.address}</p>
                        <p className="text-sm text-gray-500">{booking.city}, {booking.zipCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">
                          {new Date(booking.preferredDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">{booking.preferredTime}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <p className="text-sm text-gray-500">${booking.price}</p>
                        </div>
                        <div className="space-x-2">
                          <select
                            value={booking.status}
                            onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                            disabled={updatingBooking === booking._id}
                          >
                            <option value="pending" disabled={!validateStatusTransition(booking.status, 'pending')}>
                              New User (Pending)
                            </option>
                            <option value="scheduled" disabled={!validateStatusTransition(booking.status, 'scheduled')}>
                              Scheduled
                            </option>
                            <option value="session-active" disabled={!validateStatusTransition(booking.status, 'session-active')}>
                              Processing (Active Session)
                            </option>
                            <option value="documents-ready" disabled={!validateStatusTransition(booking.status, 'documents-ready')}>
                              Processed (Ready)
                            </option>
                            <option value="canceled" disabled={!validateStatusTransition(booking.status, 'canceled')}>
                              Canceled
                            </option>
                          </select>
                          {updatingBooking === booking._id && (
                            <span className="text-xs text-blue-600 ml-2">Updating...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notaries Tab */}
        {activeTab === 'notaries' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Notaries ({notaries.length})</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {notaries.map((notary) => (
                <div key={notary._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {notary.firstName?.[0]}{notary.lastName?.[0]}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notary.firstName} {notary.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{notary.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notary.isActive !== false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {notary.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                      <p className="text-sm text-gray-500">
                        {notary.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Customers</h3>
            </div>
            <div className="divide-y divide-gray-200">

              {Array.from(new Map(
                bookings.map(booking => [
                  booking.customerId?._id || booking.email,
                  {
                    id: booking.customerId?._id || booking.email,
                    name: booking.customerName,
                    email: booking.customerEmail,
                    phone: booking.customerPhone,
                    address: booking.customerAddress,
                    totalBookings: bookings.filter(b => 
                      (b.customerId?._id || b.email) === (booking.customerId?._id || booking.email)
                    ).length,
                    lastBooking: Math.max(...bookings
                      .filter(b => (b.customerId?._id || b.email) === (booking.customerId?._id || booking.email))
                      .map(b => new Date(b.createdAt).getTime())
                    )
                  }
                ])
              ).values()).map((customer) => (
                <div key={customer.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {customer.name?.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{customer.totalBookings} sessions</p>
                      <p className="text-sm text-gray-500">
                        Last: {new Date(customer.lastBooking).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 