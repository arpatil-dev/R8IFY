import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';


const StoreOwnerDashboard = () => {
  const [user, setUser] = useState(null);
  const [ownedStores, setOwnedStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [errorStores, setErrorStores] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Fetch stores owned by this user
      if (parsedUser.role === 'STORE_OWNER') {
        setLoadingStores(true);
        api.get(`/stores/owner/${parsedUser.id}`)
          .then(res => {
            console.log(res.data.data[0]);
            setOwnedStores(res.data.data || []);
            setErrorStores(null);
          })
          .catch(err => {
            setErrorStores(err.response?.data?.message || 'Failed to fetch stores');
          })
          .finally(() => setLoadingStores(false));
      }
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


      {/* Store Analytics Cards - Dynamic for each owned store */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loadingStores ? (
          <div className="col-span-4 text-center py-8">Loading stores...</div>
        ) : errorStores ? (
          <div className="col-span-4 text-center text-red-500 py-8">{errorStores}</div>
        ) : ownedStores.length === 0 ? (
          <div className="col-span-4 text-center py-8">No stores found for this owner.</div>
        ) : (
          ownedStores.map(store => (
            <div key={store.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>
              <div className="mb-2 text-sm text-gray-500">{store.email}</div>
              <div className="mb-2 text-sm text-gray-500">{store.address}</div>
              <div className="flex items-center mb-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">Active</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <span className="block text-xs text-gray-500">Reviews</span>
                  <span className="text-lg font-bold text-yellow-600">{store.ratings?.length || 0}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Avg Rating</span>
                  <span className="text-lg font-bold text-green-600">{
                    store.ratings && store.ratings.length > 0
                      ? (store.ratings.reduce((acc, r) => acc + r.value, 0) / store.ratings.length).toFixed(2)
                      : '0.00'
                  }</span>
                </div>
              </div>
              {/* Link to ratings page */}
              <div className="mt-4">
                <Link
                  to="/store-ratings"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  View users who rated this store
                </Link>
              </div>
            </div>
          ))
        )}
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