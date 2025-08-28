import React from 'react';

const CustomersTab = ({ bookings }) => {
  const customers = Array.from(new Map(
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
  ).values());

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Customers</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {customers.map((customer) => (
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
  );
};

export default CustomersTab;
