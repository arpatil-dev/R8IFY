import { useState, useEffect } from 'react';
import api from '../utils/api';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRatings, setUserRatings] = useState({}); // Store user's ratings by storeId
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [existingRating, setExistingRating] = useState(null); // Current user's rating for selected store
  const [expandedCards, setExpandedCards] = useState({}); // Track expanded state for each store card

  useEffect(() => {
    fetchStores();
    fetchUserRatings();
  }, []);

  useEffect(() => {
    // Filter stores based on search query
    if (searchQuery.trim() === '') {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store =>
        store.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  }, [searchQuery, stores]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stores');
      console.log('Stores response:', response);
      
      const storesData = response.data.data?.stores || response.data.data || [];
      
      // Fetch average rating for each store
      const storesWithRatings = await Promise.all(
        storesData.map(async (store) => {
          try {
            const ratingResponse = await api.get(`/stores/${store.id}/average-rating`);
            console.log(`Rating for store ${store.id}:`, ratingResponse);
            
            const averageRating = ratingResponse.data?.averageRating || ratingResponse.data?.data?.averageRating || 0;
            const totalRatings = ratingResponse.data?.totalRatings || ratingResponse.data?.data?.totalRatings || 0;
            
            return {
              ...store,
              averageRating: averageRating,
              totalRatings: totalRatings
            };
          } catch (error) {
            console.error(`Error fetching rating for store ${store.id}:`, error);
            return {
              ...store,
              averageRating: 0,
              totalRatings: 0
            };
          }
        })
      );
      
      setStores(storesWithRatings);
      setFilteredStores(storesWithRatings);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setError('Failed to load stores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) return;
      
      const user = JSON.parse(userData);
      const response = await api.get(`/ratings/user/${user.id}`);
      console.log('User ratings response:', response);
      
      const ratingsData = response.data?.data || response.data || [];
      const ratingsMap = {};
      
      // Create a map of storeId -> rating for quick lookup
      ratingsData.forEach(rating => {
        console.log(rating.storeId)
        ratingsMap[rating.storeId] = rating; // Store the complete rating object, not just rating.value
      });
      
      setUserRatings(ratingsMap);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      // Don't show error for ratings as it's not critical for the main functionality
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    
    // Check if user has already rated this store
    const userRating = userRatings[store.id];
    console.log("Rating it is : ",userRating)
    if (userRating) {
      // Pre-populate with existing rating
      setExistingRating(userRating);
      setRating(userRating.value || userRating.rating); // Handle both possible property names
      setComment(userRating.comment || '');
    } else {
      // New rating
      setExistingRating(null);
      setRating(0);
      setComment('');
    }
  };

  const closeRatingModal = () => {
    setSelectedStore(null);
    setRating(0);
    setComment('');
    setExistingRating(null);
  };

  const toggleCardExpansion = (storeId) => {
    setExpandedCards(prev => ({
      ...prev,
      [storeId]: !prev[storeId]
    }));
  };

  const submitRating = async (e) => {
    e.preventDefault();
    if (!selectedStore || rating === 0) return;

    try {
      setSubmitLoading(true);
      
      let response;
      console.log(selectedStore)
      if (existingRating) {
        // Update existing rating using PUT endpoint
        response = await api.put(`/ratings/${existingRating.id}`, {
          rating: rating,
          comment: comment.trim()
        });
        console.log('Rating updated:', response);
        alert('Rating updated successfully!');
      } else {
        // Create new rating using POST endpoint
        response = await api.post(`/stores/${selectedStore.id}/ratings`, {
          rating: rating,
          comment: comment.trim()
        });
        console.log('Rating submitted:', response);
        alert('Rating submitted successfully!');
      }
      
      closeRatingModal();
      
      // Refresh both stores (to get updated averages) and user ratings
      fetchStores();
      fetchUserRatings();
    } catch (error) {
      console.error('Error with rating:', error);
      const action = existingRating ? 'update' : 'submit';
      alert(error.response?.data?.message || `Failed to ${action} rating. Please try again.`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 cursor-${interactive ? 'pointer' : 'default'} ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          } transition-colors duration-200`}
          fill="currentColor"
          viewBox="0 0 24 24"
          onClick={interactive ? () => onStarClick(i) : undefined}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-gray-600">Loading stores...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">All Stores</h3>
        <button
          onClick={() => {
            fetchStores();
            fetchUserRatings();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Refresh
        </button>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search stores by name or address..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stores List */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          {searchQuery ? 'No stores found matching your search.' : 'No stores available.'}
        </div>
      ) : (
        <>
          {/* Desktop View - Full Cards */}
          <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStores.map((store) => {
              const avgRating = store.averageRating || 0;
              
              return (
                <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  {/* Store Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{store.name || 'Unnamed Store'}</h3>
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
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex mr-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(avgRating) ? 'text-blue-500' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
                          <span className="text-gray-600 ml-1">average</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white text-gray-600 shadow-sm">
                        {store.totalRatings || 0} review{(store.totalRatings || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openRatingModal(store)}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {userRatings[store.id] ? 'Edit Rating' : 'Rate Store'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Mobile View - Compact/Expandable Cards */}
          <div className="md:hidden space-y-4">
            {filteredStores.map((store) => (
              <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Compact Header - Always Visible */}
                <button
                  onClick={() => toggleCardExpansion(store.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {store.name || 'Unnamed Store'}
                      </h3>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(Math.round(store.averageRating || 0))}
                        </div>
                        <span className="text-xs font-medium text-blue-700">
                          {store.averageRating > 0 ? store.averageRating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {store.totalRatings} review{store.totalRatings !== 1 ? 's' : ''}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${expandedCards[store.id] ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Content */}
                <div className={`transition-all duration-300 ease-in-out ${expandedCards[store.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="px-4 pb-4 border-t border-gray-100">
                    {/* Store Details */}
                    <div className="space-y-2 my-4">
                      {store.address && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{store.address}</span>
                        </div>
                      )}
                      
                      {store.phone && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{store.phone}</span>
                        </div>
                      )}
                      
                      {store.email && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{store.email}</span>
                        </div>
                      )}
                    </div>

                    {/* User's Rating Status */}
                    {userRatings[store.id] && (
                      <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center">
                          <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-3 h-3 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">Your Rating</p>
                            <div className="flex items-center mt-1">
                              <div className="flex mr-2">
                                {renderStars(userRatings[store.id].value || userRatings[store.id].rating)}
                              </div>
                              <span className="text-sm font-semibold text-blue-800">
                                {userRatings[store.id].value || userRatings[store.id].rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => openRatingModal(store)}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                        userRatings[store.id]
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                      }`}
                    >
                      {userRatings[store.id] ? (
                        <span className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Your Rating
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Rate This Store
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Rating Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h4 className="text-lg font-semibold mb-4">
              {existingRating ? 'Edit Your Rating for' : 'Rate'} {selectedStore.name}
            </h4>
            
            {existingRating && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Current Rating:</strong> {existingRating.value || existingRating.rating} star{(existingRating.value || existingRating.rating) !== 1 ? 's' : ''}
                  {existingRating.comment && (
                    <span> - "{existingRating.comment}"</span>
                  )}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  You can update your rating and comment below.
                </p>
              </div>
            )}
            
            <form onSubmit={submitRating}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Your Rating
                </label>
                <div className="flex justify-center items-center gap-1 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {renderStars(rating, true, setRating)}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {rating} out of 5 stars
                  </p>
                )}
              </div>

              

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeRatingModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rating === 0 || submitLoading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {submitLoading 
                    ? (existingRating ? 'Updating...' : 'Submitting...') 
                    : (existingRating ? 'Update Rating' : 'Submit Rating')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreList;