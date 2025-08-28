import React from 'react';
import { getServiceIcon, getStatusColor } from '../utils/statusUtils.jsx';

const DocumentsTab = ({ 
  bookings, 
  documents, 
  setSelectedBookingForDocs, 
  setShowDocumentModal, 
  setSelectedBookingForInvoice, 
  setShowInvoiceModal,
  generateFinalPDF 
}) => {
  return (
    <div className="space-y-6">
      {/* Document Management Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Document Management</h3>
          <div className="text-sm text-gray-500">
            {Object.keys(documents).reduce((total, bookingId) => 
              total + (documents[bookingId]?.length || 0), 0
            )} documents uploaded
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-600 font-semibold">
              {bookings.filter(b => b.status === 'documents-ready').length}
            </div>
            <div className="text-sm text-blue-600">Completed Sessions</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-600 font-semibold">
              {bookings.filter(b => b.paymentStatus === 'paid').length}
            </div>
            <div className="text-sm text-green-600">Paid Sessions</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-purple-600 font-semibold">
              {bookings.filter(b => b.status === 'session-active').length}
            </div>
            <div className="text-sm text-purple-600">Active Sessions</div>
          </div>
        </div>
      </div>

      {/* Bookings with Document Management */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Notarization Sessions - Document Management
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <div key={booking._id} className="px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Booking Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-3">
                    {getServiceIcon(booking.serviceType)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.bookingId}</p>
                      <p className="text-sm text-gray-500">{booking.firstName} {booking.lastName}</p>
                      <p className="text-xs text-gray-400">{booking.serviceType} • ${booking.price}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Date */}
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Documents */}
                <div>
                  <div className="text-sm text-gray-900">
                    {documents[booking._id]?.length || 0} documents
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBookingForDocs(booking);
                      setShowDocumentModal(true);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                  >
                    Manage Documents
                  </button>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  {booking.status === 'documents-ready' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedBookingForInvoice(booking);
                          setShowInvoiceModal(true);
                        }}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Generate Invoice
                      </button>
                      <button
                        onClick={() => generateFinalPDF(booking)}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Final PDF
                      </button>
                    </>
                  )}
                  {booking.status === 'session-active' && (
                    <button
                      onClick={() => {
                        setSelectedBookingForDocs(booking);
                        setShowDocumentModal(true);
                      }}
                      className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      Upload Documents
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
