import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const StoreOwnerDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your store and track performance</p>
      </div>

      {user && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Owner Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner Name</label>
              <p className="mt-1 text-sm text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {user.role}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Store Address</label>
              <p className="mt-1 text-sm text-gray-900">{user.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Store Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Store Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                <dd className="text-lg font-medium text-gray-900">0</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Store Reviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Reviews</dt>
                <dd className="text-lg font-medium text-gray-900">0</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg Rating</dt>
                <dd className="text-lg font-medium text-gray-900">0.0</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Store Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Store Status</dt>
                <dd className="text-lg font-medium text-green-600">Active</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Management</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors text-left">
              Update Store Info
            </button>
            <button className="w-full bg-green-50 text-green-700 px-4 py-2 rounded-md hover:bg-green-100 transition-colors text-left">
              Manage Products
            </button>
            <button className="w-full bg-purple-50 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors text-left">
              Store Hours
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Engagement</h3>
          <div className="space-y-3">
            <button className="w-full bg-yellow-50 text-yellow-700 px-4 py-2 rounded-md hover:bg-yellow-100 transition-colors text-left">
              View Reviews
            </button>
            <button className="w-full bg-red-50 text-red-700 px-4 py-2 rounded-md hover:bg-red-100 transition-colors text-left">
              Respond to Reviews
            </button>
            <button className="w-full bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors text-left">
              Customer Feedback
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics & Reports</h3>
          <div className="space-y-3">
            <button className="w-full bg-teal-50 text-teal-700 px-4 py-2 rounded-md hover:bg-teal-100 transition-colors text-left">
              Performance Report
            </button>
            <button className="w-full bg-orange-50 text-orange-700 px-4 py-2 rounded-md hover:bg-orange-100 transition-colors text-left">
              Customer Insights
            </button>
            <Link
              to="/profile"
              className="w-full bg-gray-50 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-left block"
            >
              Account Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Reviews</h3>
        </div>
        <div className="px-6 py-4">
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start promoting your store to get customer reviews!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;