import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import LoginForm from './LoginForm';
import ApiService from '../services/api';
import TenantSettings from './TenantSettings';

const AdminDashboard = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [bookingsRes, driversRes] = await Promise.all([
        ApiService.getAllBookings(),
        ApiService.getAllDrivers()
      ]);

      const allBookings = bookingsRes.data || [];
      console.log('Dashboard Data Loaded:', { 
        bookingsCount: allBookings.length, 
        driversCount: driversRes.data?.length 
      });
      setBookings(allBookings);
      setDrivers(driversRes.data || []);

      // Calculate stats
      const totalRevenue = allBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);

      setDashboardData({
        totalBookings: allBookings.length,
        pendingBookings: allBookings.filter(b => b.status === 'pending').length,
        inProgress: allBookings.filter(b => b.status === 'in-progress').length,
        totalRevenue,
        activeDrivers: driversRes.data?.filter(d => d.status === 'available').length || 0,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDriver = async (bookingId, driverId) => {
    try {
      await ApiService.assignDriver(bookingId, driverId);
      setSuccessMessage('Driver assigned successfully');
      fetchDashboardData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Assign driver error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to assign driver';
      setError(`Error: ${msg}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin && tenant?._id) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isAdmin, tenant?._id]);

  if (!isAuthenticated) return <LoginForm defaultRole="admin" />;

  const filteredBookings = bookings.filter(booking => {
    const statusMatch = selectedStatus === 'all' || booking.status === selectedStatus;
    
    // Safer date matching to prevent crashes on missing dates
    let dateMatch = true;
    if (selectedDate && booking.preferredDate) {
      try {
        const bDate = new Date(booking.preferredDate).toISOString().split('T')[0];
        dateMatch = bDate === selectedDate;
      } catch (e) {
        dateMatch = false;
      }
    } else if (selectedDate) {
      dateMatch = false;
    }
    
    return statusMatch && dateMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-left">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-600 p-2 rounded-lg text-white font-bold text-xl">RM</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{tenant?.name} Command Center</h1>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-tighter">Mover Administrator Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-medium">Hello, {user?.firstName}</span>
              <button onClick={logout} className="text-sm bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg font-bold transition-all">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl mb-8 w-fit">
          {['overview', 'bookings', 'drivers', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 font-medium border border-red-100">{error}</div>}
        {successMessage && <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 font-medium border border-green-100 animate-bounce">{successMessage}</div>}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `$${dashboardData?.totalRevenue?.toLocaleString()}`, color: 'text-green-600' },
                { label: 'Active Jobs', value: dashboardData?.inProgress, color: 'text-blue-600' },
                { label: 'Pending Quotes', value: dashboardData?.pendingBookings, color: 'text-orange-600' },
                { label: 'Fleet Status', value: `${dashboardData?.activeDrivers} Ready`, color: 'text-primary-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left">
              <div className="p-6 border-b border-gray-50 font-black text-gray-900 uppercase tracking-tight">Recent Live Activity</div>
              <div className="divide-y divide-gray-50">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900">{booking.customerName}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{booking.address}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <p className="text-sm font-bold mt-1 text-gray-900">${booking.estimatedPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-gray-900">Relocation Management</h2>
              <div className="flex gap-2">
                <select 
                  value={selectedStatus} 
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="bg-white border-gray-200 rounded-lg text-sm font-bold px-4 py-2 outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="bg-white border-gray-200 rounded-lg text-sm font-bold px-4 py-2 outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredBookings.length === 0 ? (
                <div className="bg-white p-20 text-center rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold">No bookings found for this criteria.</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">ID: {booking.bookingId}</span>
                          </div>
                          <h3 className="text-xl font-black text-gray-900">{booking.customerName}</h3>
                          <a href={`tel:${booking.phone}`} className="text-sm font-bold text-primary-600 hover:underline">📞 {booking.phone}</a>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-gray-900">${booking.estimatedPrice}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Est. Total</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 bg-gray-50/50 p-6 rounded-xl mb-6">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">📍 Pickup Address</p>
                          <p className="text-sm font-bold text-gray-900">{booking.address}</p>
                          <p className="text-sm text-gray-600">{booking.city}, {booking.zipCode}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">📅 Appointment</p>
                          <p className="text-sm font-bold text-gray-900">
                            {booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Date Pending'}
                          </p>
                          <p className="text-sm font-bold text-primary-600">⏰ {booking.preferredTime || 'Time Pending'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">📦 Inventory</p>
                          <p className="text-sm font-bold text-gray-900 capitalize">{booking.serviceType} Service</p>
                          <p className="text-sm text-gray-600">{booking.bagCount} items estimated</p>
                        </div>
                      </div>

                      {booking.specialInstructions && (
                        <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100 text-left">
                          <p className="text-[10px] font-black text-orange-400 uppercase mb-1">Customer Notes</p>
                          <p className="text-sm text-orange-800 font-medium italic">"{booking.specialInstructions}"</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 items-center pt-6 border-t border-gray-50">
                        {/* Driver Assignment */}
                        <div className="flex items-center space-x-2 mr-auto">
                          <p className="text-[10px] font-black text-gray-400 uppercase mr-2">Assign Driver:</p>
                          <select 
                            onChange={(e) => handleAssignDriver(booking._id, e.target.value)}
                            value={booking.driverId?._id || ''}
                            className="text-xs font-bold bg-gray-100 border-none rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-200"
                          >
                            <option value="">Unassigned</option>
                            {drivers.map(d => (
                              <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-left">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Fleet Roster</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {drivers.map(driver => (
                <div key={driver._id} className="flex items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-lg mr-4">
                    {driver.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{driver.firstName} {driver.lastName}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID: {driver.driverId}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-black uppercase ${driver.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {driver.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && <TenantSettings />}
      </div>
    </div>
  );
};

export default AdminDashboard;
