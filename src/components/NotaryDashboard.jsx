import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';
import ApiService from '../services/api';

const NotaryDashboard = () => {
  const { user, logout, isAuthenticated, isDriver: isNotary } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const notaryId = user?.driverId || 'N0001';

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'session-active': return 'bg-yellow-100 text-yellow-800';
      case 'docs-ready': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  useEffect(() => {
    if (isAuthenticated && isNotary) {
      fetchAllData();
    }
  }, [selectedStatus, selectedDate, isAuthenticated, isNotary]);

  const fetchAllData = async () => {
    if (!isAuthenticated || !isNotary) {
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
    if (!isAuthenticated || !isNotary) {
      return;
    }

    try {
      const response = await ApiService.getNotaryDashboard(notaryId);
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      throw err;
    }
  };

  const fetchBookings = async () => {
    if (!isAuthenticated || !isNotary) {
      return;
    }

    try {
      const filters = {
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        date: selectedDate,
      };
      
      const response = await ApiService.getNotaryBookings(notaryId, filters);
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      throw err;
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    if (!isAuthenticated || !isNotary) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await ApiService.updateBookingStatus(bookingId, { status: newStatus });
      if (response.success) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
      setError('Failed to update booking status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="bg-blue-600 p-3 rounded-lg inline-block mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Notary Portal Access</h2>
              <p className="text-gray-600">Please sign in to access the notary dashboard</p>
            </div>
            <LoginForm 
              onSuccess={() => {}} 
              onCancel={null} 
              defaultRole="notary"
            />
          </div>
        </div>
      )}

      <div className={!isAuthenticated ? 'blur-sm pointer-events-none' : ''}>
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notary Dashboard</h1>
                  <p className="text-gray-600">
                    Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Notary'} ({notaryId})
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Today's Stats</p>
                  <p className="font-bold text-blue-600">
                    {dashboardData?.todaysStats?.totalBookings || 0} Sessions • 
                    ${dashboardData?.todaysStats?.earnings || 0} Total
                  </p>
                </div>
                
                {isAuthenticated && isNotary ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'N'}
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
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:border-blue-600"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Notary Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Sessions ({bookings.length})</option>
                  <option value="scheduled">Scheduled ({bookings.filter(b => b.status === 'scheduled').length})</option>
                  <option value="session-active">Session Active ({bookings.filter(b => b.status === 'session-active').length})</option>
                  <option value="docs-ready">Documents Ready ({bookings.filter(b => b.status === 'docs-ready').length})</option>
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
              
              <div className="flex items-end">
                <button className="btn-secondary w-full">
                  📊 Export Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6">
              <div 
                className={`rounded-lg p-4 text-center cursor-pointer transition-all ${selectedStatus === 'scheduled' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-blue-50 hover:bg-blue-100'}`}
                onClick={() => setSelectedStatus(selectedStatus === 'scheduled' ? 'all' : 'scheduled')}
              >
                <div className="text-2xl font-bold text-blue-600">{bookings.filter(b => b.status === 'scheduled').length}</div>
                <div className="text-sm text-blue-500">Scheduled</div>
              </div>
              <div 
                className={`rounded-lg p-4 text-center cursor-pointer transition-all ${selectedStatus === 'session-active' ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'bg-yellow-50 hover:bg-yellow-100'}`}
                onClick={() => setSelectedStatus(selectedStatus === 'session-active' ? 'all' : 'session-active')}
              >
                <div className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'session-active').length}</div>
                <div className="text-sm text-yellow-500">Session Active</div>
              </div>
              <div 
                className={`rounded-lg p-4 text-center cursor-pointer transition-all ${selectedStatus === 'docs-ready' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-green-50 hover:bg-green-100'}`}
                onClick={() => setSelectedStatus(selectedStatus === 'docs-ready' ? 'all' : 'docs-ready')}
              >
                <div className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'docs-ready').length}</div>
                <div className="text-sm text-green-500">Documents Ready</div>
              </div>
              <div 
                className={`rounded-lg p-4 text-center cursor-pointer transition-all ${selectedStatus === 'cancelled' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-red-50 hover:bg-red-100'}`}
                onClick={() => setSelectedStatus(selectedStatus === 'cancelled' ? 'all' : 'cancelled')}
              >
                <div className="text-2xl font-bold text-red-600">{bookings.filter(b => b.status === 'cancelled').length}</div>
                <div className="text-sm text-red-500">Cancelled</div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading sessions...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
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

          {!loading && !error && (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id || booking.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
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
                        <h4 className="font-medium text-gray-900 mb-2">Session Details</h4>
                        <p className="text-gray-600 text-sm mb-1">{booking.specialInstructions}</p>
                        <div className="text-blue-600 font-medium">
                          {booking.preferredDate ? (
                            <div>
                              <span>{new Date(booking.preferredDate).toLocaleDateString()} at {booking.preferredTime}</span>
                            </div>
                          ) : 'Date not set'}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                        <p className="text-gray-600 text-sm">{booking.email}</p>
                        <p className="text-gray-600 text-sm">{booking.phone}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Payment</h4>
                        <p className="text-gray-600 text-sm">{booking.paymentStatus}</p>
                        <p className="text-gray-600 text-sm">${booking.estimatedPrice}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4 flex justify-end space-x-2">
                      <button className="btn-secondary">View Details</button>
                      <button onClick={() => updateBookingStatus(booking._id, 'session-active')} className="btn-primary">Start Session</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotaryDashboard;
