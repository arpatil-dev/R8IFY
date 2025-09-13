import { useState, useEffect } from 'react';
import api from '../utils/api';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchStores();
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
      setStores(storesData);
      setFilteredStores(storesData);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setError('Failed to load stores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setRating(0);
    setComment('');
  };

  const closeRatingModal = () => {
    setSelectedStore(null);
    setRating(0);
    setComment('');
  };

  const submitRating = async (e) => {
    e.preventDefault();
    if (!selectedStore || rating === 0) return;

    try {
      setSubmitLoading(true);
      const response = await api.post(`/stores/${selectedStore.id}/ratings`, {
        rating: rating,
        comment: comment.trim()
      });
      
      console.log('Rating submitted:', response);
      alert('Rating submitted successfully!');
      closeRatingModal();
      
      // Refresh stores to get updated ratings
      fetchStores();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert(error.response?.data?.message || 'Failed to submit rating. Please try again.');
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
          onClick={fetchStores}
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
              {store.averageRating && (
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {renderStars(Math.round(store.averageRating))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({store.averageRating.toFixed(1)} avg)
                  </span>
                </div>
              )}

              <button
                onClick={() => openRatingModal(store)}
                className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Rate This Store
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h4 className="text-lg font-semibold mb-4">Rate {selectedStore.name}</h4>
            
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
                  {submitLoading ? 'Submitting...' : 'Submit Rating'}
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