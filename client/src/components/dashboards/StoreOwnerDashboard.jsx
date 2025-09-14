import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const StoreOwnerDashboard = () => {
  const [user, setUser] = useState(null);
  const [ownedStores, setOwnedStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [errorStores, setErrorStores] = useState(null);
  const [storeStats, setStoreStats] = useState({
    totalStores: 0,
    totalRatings: 0,
    averageRating: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'STORE_OWNER') {
        fetchStoreData(parsedUser.id);
      }
    }
  }, []);

  const fetchStoreData = async (userId) => {
    try {
      setLoadingStores(true);
      const response = await api.get(`/stores/owner/${userId}`);
      const stores = response.data.data || [];
      setOwnedStores(stores);
      
      // Calculate stats
      const totalStores = stores.length;
      const allRatings = stores.flatMap(store => store.ratings || []);
      const totalRatings = allRatings.length;
      const averageRating = totalRatings > 0 
        ? allRatings.reduce((acc, r) => acc + (r.value || r.rating), 0) / totalRatings 
        : 0;
      
      setStoreStats({
        totalStores,
        totalRatings,
        averageRating: averageRating.toFixed(1)
      });
      
      setErrorStores(null);
    } catch (err) {
      setErrorStores(err.response?.data?.message || 'Failed to fetch stores');
    } finally {
      setLoadingStores(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Welcome back, {user?.name?.split(' ')[0] || 'Store Owner'}! 🏪
                </h1>
                <p className="text-purple-100 text-lg">
                  Manage your stores and track customer feedback
                </p>
              </div>
              <div className="mt-6 md:mt-0">
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-sm text-purple-100 mb-1">Total Stores</div>
                  <div className="text-2xl font-bold">{storeStats.totalStores}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* View Ratings */}
            <Link to="/store-ratings" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow block">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Store Ratings</h3>
              <p className="text-gray-600 text-sm mb-4">View and manage customer reviews</p>
              <span className="text-amber-600 font-medium text-sm hover:text-amber-700">
                View All →
              </span>
            </Link>

            {/* Profile Management */}
            <Link to="/profile" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow block">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Settings</h3>
              <p className="text-gray-600 text-sm mb-4">Update your account information</p>
              <span className="text-blue-600 font-medium text-sm hover:text-blue-700">
                Manage →
              </span>
            </Link>
          </div>
        </div>

        {/* Store Analytics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Store Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Total Reviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStores ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      storeStats.totalRatings
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStores ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      `${storeStats.averageRating}/5`
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    }) : 'Recently'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h-8zM8 7v8a1 1 0 001 1h6a1 1 0 001-1V7H8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* My Stores */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Stores</h2>
          
          {loadingStores ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
              <p className="text-gray-600 text-lg">Loading your stores...</p>
            </div>
          ) : errorStores ? (
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Stores</h3>
              <p className="text-red-600 mb-4">{errorStores}</p>
              <button 
                onClick={() => fetchStoreData(user?.id)}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : ownedStores.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No stores yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You don't have any stores registered yet. Contact the administrator to add your store to the platform.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ownedStores.map((store) => {
                const storeRatings = store.ratings || [];
                const avgRating = storeRatings.length > 0 
                  ? (storeRatings.reduce((acc, r) => acc + (r.value || r.rating), 0) / storeRatings.length).toFixed(1)
                  : 0;
                
                return (
                  <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    {/* Store Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{store.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Store Details */}
                    <div className="space-y-2 mb-4">
                      {store.address && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{store.address}</span>
                        </div>
                      )}
                      
                      {store.email && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">{store.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Rating Stats */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex mr-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.round(avgRating) ? 'text-amber-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold text-gray-900">{avgRating}</span>
                            <span className="text-gray-600 ml-1">average</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white text-gray-600 shadow-sm">
                          {storeRatings.length} review{storeRatings.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to="/store-ratings"
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Reviews
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;