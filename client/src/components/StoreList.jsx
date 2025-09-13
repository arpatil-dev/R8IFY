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
        <span
          key={i}
          className={`cursor-${interactive ? 'pointer' : 'default'} text-2xl ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={interactive ? () => onStarClick(i) : undefined}
        >
          ★
        </span>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <div key={store.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{store.name || 'Unnamed Store'}</h4>
                <span className="text-sm text-gray-500">ID: {store.id}</span>
              </div>
              
              {store.address && (
                <p className="text-gray-600 text-sm mb-2">{store.address}</p>
              )}
              
              {store.phone && (
                <p className="text-gray-600 text-sm mb-2">📞 {store.phone}</p>
              )}
              
              {store.email && (
                <p className="text-gray-600 text-sm mb-2">✉️ {store.email}</p>
              )}

              {/* Average Rating Display */}
              <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {renderStars(Math.round(store.averageRating || 0))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {store.averageRating > 0 
                      ? `${store.averageRating.toFixed(1)} avg` 
                      : 'No ratings yet'
                    }
                  </span>
                </div>
                {store.totalRatings > 0 && (
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {store.totalRatings} review{store.totalRatings !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* User's Rating Status */}
              {userRatings[store.id] && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-blue-700 mr-2">Your rating:</span>
                      <div className="flex">
                        {renderStars(userRatings[store.id].value || userRatings[store.id].rating)}
                      </div>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {userRatings[store.id].value || userRatings[store.id].rating}/5
                    </span>
                  </div>
                  {userRatings[store.id].comment && (
                    <p className="text-sm text-blue-600 mt-1 italic">
                      "{userRatings[store.id].comment}"
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => openRatingModal(store)}
                className={`w-full mt-3 py-2 px-4 rounded-md transition duration-200 ${
                  userRatings[store.id]
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {userRatings[store.id] ? 'Edit Your Rating' : 'Rate This Store'}
              </button>
            </div>
          ))}
        </div>
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex justify-center">
                  {renderStars(rating, true, setRating)}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share your experience..."
                />
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