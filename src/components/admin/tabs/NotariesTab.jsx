import React from 'react';

const NotariesTab = ({ notaries }) => {
  return (
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
  );
};

export default NotariesTab;
