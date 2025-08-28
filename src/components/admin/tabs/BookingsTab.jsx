import React from 'react';
import { getServiceIcon, getStatusColor, validateStatusTransition } from '../utils/statusUtils.jsx';

const BookingsTab = ({ 
  bookings, 
  selectedStatus, 
  setSelectedStatus, 
  selectedDate, 
  setSelectedDate, 
  updatingBooking, 
  handleUpdateBookingStatus,
  setSelectedBookingForDocs,
  setShowDocumentModal,
  documents
}) => {
  const filteredBookings = bookings.filter(booking => {
    const statusMatch = selectedStatus === 'all' || booking.status === selectedStatus;
    const dateMatch = !selectedDate || 
      new Date(booking.preferredDate).toISOString().split('T')[0] === selectedDate;
    return statusMatch && dateMatch;
  });

  return (
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
                    {documents[booking._id]?.length > 0 && (
                      <p className="text-xs text-blue-600">
                        📎 {documents[booking._id].length} documents
                      </p>
                    )}
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
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setSelectedBookingForDocs(booking);
                        setShowDocumentModal(true);
                      }}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 border"
                    >
                      📎 Documents
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingsTab;
