import React from 'react';
import { getServiceIcon, getStatusColor, validateStatusTransition } from '../utils/statusUtils.jsx';

const BookingsTab = ({
  bookings,
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
  updatingBooking,
  handleUpdateBookingStatus
}) => {
  const filteredBookings = bookings.filter(booking => {
    const statusMatch = selectedStatus === 'all' || booking.status === selectedStatus;
    const dateMatch = !selectedDate || 
      new Date(booking.preferredDate).toISOString().split('T')[0] === selectedDate;
    return statusMatch && dateMatch;
  });

  const getStatusDisplayName = (status) => {
    const statusNames = {
      'pending': 'Pending',
      'scheduled': 'Scheduled',
      'session-active': 'Active Session',
      'documents-ready': 'Completed',
      'canceled': 'Canceled'
    };
    return statusNames[status] || status;
  };

  const getServiceDisplayName = (serviceType) => {
    const serviceNames = {
      'general': 'General Notary',
      'loan_signing': 'Loan Signing',
      'estate_planning': 'Estate Planning'
    };
    return serviceNames[serviceType] || serviceType;
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">{bookings.filter(b => b.status === 'pending').length}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{bookings.filter(b => b.status === 'scheduled').length}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'session-active').length}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'documents-ready').length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="session-active">Active Session</option>
              <option value="documents-ready">Completed</option>
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
          {filteredBookings.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No sessions found matching the selected filters
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  {/* Booking Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-3">
                      {getServiceIcon(booking.serviceType)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{booking.bookingId}</p>
                        <p className="text-sm text-gray-500">{booking.firstName} {booking.lastName}</p>
                        <p className="text-xs text-gray-400">{getServiceDisplayName(booking.serviceType)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <p className="text-sm text-gray-900">{booking.email}</p>
                    <p className="text-sm text-gray-500">{booking.phone}</p>
                    {booking.address && (
                      <p className="text-xs text-gray-400">{booking.address}</p>
                    )}
                  </div>

                  {/* Schedule */}
                  <div>
                    <p className="text-sm text-gray-900">
                      {booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'No date set'}
                    </p>
                    <p className="text-sm text-gray-500">{booking.preferredTime || 'No time set'}</p>
                    <p className="text-xs text-gray-400">${booking.price}</p>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusDisplayName(booking.status)}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                        disabled={updatingBooking === booking._id}
                      >
                        <option value="pending" disabled={!validateStatusTransition(booking.status, 'pending')}>
                          Pending
                        </option>
                        <option value="scheduled" disabled={!validateStatusTransition(booking.status, 'scheduled')}>
                          Scheduled
                        </option>
                        <option value="session-active" disabled={!validateStatusTransition(booking.status, 'session-active')}>
                          Active Session
                        </option>
                        <option value="documents-ready" disabled={!validateStatusTransition(booking.status, 'documents-ready')}>
                          Completed
                        </option>
                        <option value="canceled" disabled={!validateStatusTransition(booking.status, 'canceled')}>
                          Canceled
                        </option>
                      </select>
                      {updatingBooking === booking._id && (
                        <span className="text-xs text-blue-600">Updating...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsTab;
