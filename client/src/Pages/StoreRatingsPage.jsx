import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const StoreRatingsPage = () => {
  const [user, setUser] = useState(null);
  const [ownedStores, setOwnedStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRatings, setTotalRatings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'STORE_OWNER') {
        fetchStoreRatings(parsedUser.id);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStoreRatings = async (userId) => {
    try {
      setLoading(true);
      const response = await api.get(`/stores/owner/${userId}`);
      const stores = response.data.data || [];
      setOwnedStores(stores);
      
      // Calculate overall statistics
      const allRatings = stores.flatMap(store => store.ratings || []);
      const total = allRatings.length;
      const average = total > 0 
        ? allRatings.reduce((acc, r) => acc + (r.value || r.rating), 0) / total 
        : 0;
      
      setTotalRatings(total);
      setAverageRating(average.toFixed(1));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch store ratings');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-amber-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
            <p className="text-gray-600 text-lg">Loading store reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className='pl-2'>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Reviews</h1>
              <p className="text-gray-600 text-md">
                Monitor and manage customer feedback across all your stores
              </p>
            </div>
            <button
              onClick={() => fetchStoreRatings(user?.id)}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          
          
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Reviews</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={() => fetchStoreRatings(user?.id)}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && ownedStores.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You don't have any stores registered yet. Contact the administrator to add your store to the platform.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
        {/* Store Reviews */}
        {!error && ownedStores.length > 0 && (
          <div className="space-y-8">
            {ownedStores.map((store) => (
              <div key={store.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Store Header */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{store.name}</h2>
                      {store.address && (
                        <div className="flex items-start text-gray-600 text-sm">
                          <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="leading-relaxed">{store.address}</span>
                        </div>
                      )}
                    </div>
                    <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 sm:ml-6 min-w-0 sm:min-w-[160px]">
                      <div className="text-xs sm:text-sm text-gray-600 mb-1 text-center">Store Rating</div>
                      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="flex justify-center">
                          {renderStars(Math.round(store.ratings?.length > 0 
                            ? store.ratings.reduce((acc, r) => acc + (r.value || r.rating), 0) / store.ratings.length 
                            : 0))}
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                          {store.ratings?.length > 0 
                            ? (store.ratings.reduce((acc, r) => acc + (r.value || r.rating), 0) / store.ratings.length).toFixed(1)
                            : '0.0'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {store.ratings?.length || 0} review{(store.ratings?.length || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Content */}
                <div className="p-4 sm:p-8">
                  {store.ratings && store.ratings.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                      <div className="grid gap-4 sm:gap-6">
                        {store.ratings.map((rating, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-xl p-4 sm:p-6 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 mb-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg mr-3 sm:mr-4 flex-shrink-0">
                                  {rating.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                    {rating.user?.name || 'Anonymous User'}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-600 truncate">{rating.user?.email}</p>
                                </div>
                              </div>
                              <div className="flex flex-row sm:flex-col items-center sm:items-end space-x-3 sm:space-x-0 sm:space-y-1">
                                <div className="flex items-center">
                                  <div className="flex">
                                    {renderStars(rating.value || rating.rating)}
                                  </div>
                                  <span className="ml-2 font-bold text-gray-900 text-sm sm:text-base">
                                    {rating.value || rating.rating}/5
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 whitespace-nowrap">
                                  {formatDate(rating.createdAt)}
                                </div>
                              </div>
                            </div>
                            
                            {rating.comment && (
                              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                                <div className="flex items-start">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-gray-700 italic leading-relaxed text-sm sm:text-base">"{rating.comment}"</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        This store hasn't received any customer reviews yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoreRatingsPage;
