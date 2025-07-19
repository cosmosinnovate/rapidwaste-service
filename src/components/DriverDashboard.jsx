import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';
import ApiService from '../services/api';

const DriverDashboard = () => {
  const { user, logout, isAuthenticated, isDriver } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Get driver ID from authenticated user
  const driverId = user?.driverId || 'D0001';

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-emergency-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'emergency':
        return (
          <svg className="h-5 w-5 text-emergency-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 18.5c-.77.833-.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'bulk':
        return (
          <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
    }
  };



  // Fetch dashboard data and bookings
  useEffect(() => {
    // Only fetch data if user is authenticated as a driver
    if (isAuthenticated && isDriver) {
      fetchAllData();
    }
  }, [selectedStatus, selectedDate, isAuthenticated, isDriver]);

  const fetchAllData = async () => {
    // Only set loading if user is authenticated
    if (!isAuthenticated || !isDriver) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchBookings()
      ]);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    // Double-check authentication before making API call
    if (!isAuthenticated || !isDriver) {
      return;
    }

    try {
      const response = await ApiService.getDriverDashboard(driverId);
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      throw err; // Re-throw to be caught by fetchAllData
    }
  };

  const fetchBookings = async () => {
    // Double-check authentication before making API call
    if (!isAuthenticated || !isDriver) {
      return;
    }

    try {
      const filters = {
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        date: selectedDate,
      };
      
      const response = await ApiService.getDriverBookings(driverId, filters);
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      throw err; // Re-throw to be caught by fetchAllData
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    // Check authentication before allowing action
    if (!isAuthenticated || !isDriver) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await ApiService.updateBookingStatus(bookingId, { status: newStatus });
      if (response.success) {
        // Refresh all data after status update
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
      setError('Failed to update booking status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Authentication Overlay */}
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="bg-primary-600 p-3 rounded-lg inline-block mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Driver Portal Access</h2>
              <p className="text-gray-600">Please sign in to access the driver dashboard</p>
            </div>
            <LoginForm 
              onSuccess={() => {}} // Auth context will handle state update
              onCancel={null} // No cancel for driver portal
              defaultRole="driver"
            />
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className={!isAuthenticated ? 'blur-sm pointer-events-none' : ''}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-600 p-3 rounded-lg">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
                  <p className="text-gray-600">
                    Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Driver'} ({driverId})
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Today's Stats</p>
                  <p className="font-bold text-primary-600">
                    {dashboardData?.todaysStats?.totalBookings || 0} Pickups • 
                    ${dashboardData?.todaysStats?.earnings || 0} Total
                  </p>
                </div>
                
                {/* Authentication Status */}
                {isAuthenticated && isDriver ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'D'}
                      </span>
                    </div>
                    <div className="text-sm text-right">
                      <div className="text-gray-900 font-medium">
                        {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
                      </div>
                      <div className="text-gray-500 capitalize">{user?.role}</div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        window.location.reload();
                      }}
                      className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:border-primary-600"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Driver Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Bookings ({bookings.length})</option>
                  <option value="pending">Pending ({bookings.filter(b => b.status === 'pending').length})</option>
                  <option value="scheduled">Scheduled ({bookings.filter(b => b.status === 'scheduled').length})</option>
                  <option value="in-progress">In Progress ({bookings.filter(b => b.status === 'in-progress').length})</option>
                  <option value="completed">Completed ({bookings.filter(b => b.status === 'completed').length})</option>
                  <option value="cancelled">Cancelled ({bookings.filter(b => b.status === 'cancelled').length})</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select className="input-field">
                  <option value="all">All Services</option>
                  <option value="emergency">Emergency</option>
                  <option value="regular">Regular</option>
                  <option value="bulk">Bulk</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="btn-primary w-full">
                  🗺️ Route Optimizer
                </button>
              </div>
              
              <div className="flex items-end">
                <button className="btn-secondary w-full">
                  📊 Export Report
                </button>
              </div>
            </div>

            {/* Status Overview Cards */}
            <div className="grid grid-cols-5 gap-4 mt-6">
              <div 
                className={`rounded-lg p-4 text-center cursor-pointer transition-all ${
                  selectedStatus === 'pending' ? 'bg-gray-100 ring-2 ring-gray-400' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedStatus(selectedStatus === 'pending' ? 'all' : 'pending')}
              >
                <div className="text-2xl font-bold text-gray-600">{bookings.filter(b => b.status === 'pending').length}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div 
                className={`rounded-lg p-4 text-center cursor-pointer transition-all ${
                  selectedStatus === 'scheduled' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-blue-50 hover:bg-blue-100'
                }`}
                onClick={() => setSelectedStatus(selectedStatus === 'scheduled' ? 'all' : 'scheduled')}
              >
                <div className="text-2xl font-bold text-blue-600">{bookings.filter(b => b.status === 'scheduled').length}</div>
                <div className="text-sm text-blue-500">Scheduled</div>
              </div>
              <div 
                className={`rounded-lg p-4 text-center cursor-pointer transition-all ${
                  selectedStatus === 'in-progress' ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'bg-yellow-50 hover:bg-yellow-100'
                }`}
                onClick={() => setSelectedStatus(selectedStatus === 'in-progress' ? 'all' : 'in-progress')}
              >
                <div className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'in-progress').length}</div>
                <div className="text-sm text-yellow-500">In Progress</div>
              </div>
              <div 
                className={`rounded-lg p-4 text-center cursor-pointer transition-all ${
                  selectedStatus === 'completed' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-green-50 hover:bg-green-100'
                }`}
                onClick={() => setSelectedStatus(selectedStatus === 'completed' ? 'all' : 'completed')}
              >
                <div className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'completed').length}</div>
                <div className="text-sm text-green-500">Completed</div>
              </div>
              <div 
                className={`rounded-lg p-4 text-center cursor-pointer transition-all ${
                  selectedStatus === 'cancelled' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-red-50 hover:bg-red-100'
                }`}
                onClick={() => setSelectedStatus(selectedStatus === 'cancelled' ? 'all' : 'cancelled')}
              >
                <div className="text-2xl font-bold text-red-600">{bookings.filter(b => b.status === 'cancelled').length}</div>
                <div className="text-sm text-red-500">Cancelled</div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 18.5c-.77.833-.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => { setError(''); fetchAllData(); }}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Bookings List */}
          {!loading && !error && (
            <div className="space-y-4">
                           {bookings.map((booking) => (
              <div key={booking._id || booking.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getServiceIcon(booking.serviceType)}
                                      <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.customerName}</h3>
                    <p className="text-gray-600">ID: {booking.bookingId || booking.id}</p>
                  </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <span className={`text-sm font-medium ${getPriorityColor(booking.priority)}`}>
                      {booking.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📍 Pickup Details</h4>
                    <p className="text-gray-600 text-sm mb-1">{booking.address}, {booking.city}</p>
                    <div className="text-primary-600 font-medium">
                      {booking.preferredDate ? (
                        <div>
                          <span>📅 {new Date(booking.preferredDate).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                          {booking.preferredTime && (
                            <div className="text-sm">⏰ {booking.preferredTime}</div>
                          )}
                        </div>
                      ) : booking.scheduledTime ? (
                        <span>⏰ {booking.scheduledTime}</span>
                      ) : (
                        <span className="text-orange-600">📋 Scheduling needed</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📋 Service Info</h4>
                    <div className="flex items-center space-x-2 mb-1">
                      {getServiceIcon(booking.serviceType)}
                      <span className="text-gray-600 text-sm">
                        {booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1)} Pickup
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">Bags: {booking.bagCount}</p>
                    {booking.urgentPickup && (
                      <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        🚨 Urgent
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">💰 Payment</h4>
                    <p className="text-green-600 font-bold text-lg">${booking.actualPrice || booking.estimatedPrice}</p>
                    <p className="text-gray-600 text-sm">{booking.actualPrice ? 'Final total' : 'Estimated total'}</p>
                  </div>
                </div>

                {booking.specialInstructions && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <h4 className="font-medium text-yellow-800 mb-1">📝 Special Instructions</h4>
                    <p className="text-yellow-700 text-sm">{booking.specialInstructions}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <a 
                      href={`tel:${booking.phone}`}
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Call Customer</span>
                    </a>
                    
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 font-medium">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Navigate</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {booking.status === 'scheduled' && (
                      <button 
                        onClick={() => updateBookingStatus(booking._id || booking.id, 'in-progress')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          isAuthenticated && isDriver 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-pointer hover:bg-gray-400'
                        }`}
                        title={!(isAuthenticated && isDriver) ? 'Sign in as driver to start pickup' : ''}
                      >
                        {isAuthenticated && isDriver ? 'Start Pickup' : '🔒 Start Pickup'}
                      </button>
                    )}
                    {booking.status === 'in-progress' && (
                      <button 
                        onClick={() => updateBookingStatus(booking._id || booking.id, 'completed')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          isAuthenticated && isDriver 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-pointer hover:bg-gray-400'
                        }`}
                        title={!(isAuthenticated && isDriver) ? 'Sign in as driver to complete pickup' : ''}
                      >
                        {isAuthenticated && isDriver ? 'Complete' : '🔒 Complete'}
                      </button>
                    )}
                    {booking.status === 'completed' && (
                      <span className="text-green-600 text-sm font-medium">✅ Completed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
                        ))}
            </div>
          )}

          {/* No Bookings State */}
          {!loading && !error && bookings.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293L16 18H8l-2.707-2.707A1 1 0 004.586 15H2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">No bookings match your current filters.</p>
            </div>
          )}
        </div>
      
      {/* End of blurred content */}
      </div>

      {/* Login Modal (outside of blurred content) */}
      {showLoginModal && (
        <LoginForm 
          onSuccess={() => setShowLoginModal(false)}
          onCancel={() => setShowLoginModal(false)}
          defaultRole="driver"
        />
      )}
    </div>
  );
};

export default DriverDashboard; 