import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const MyRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchMyRatings();
  }, []);

  const fetchMyRatings = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('userData');
      if (!userData) {
        setError('User data not found. Please log in again.');
        return;
      }

      const user = JSON.parse(userData);
      const response = await api.get(`/ratings/user/${user.id}`);
      console.log('My ratings response:', response);
      
      const ratingsData = response.data?.data || response.data || [];
      setRatings(ratingsData);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setError('Failed to load your ratings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (rating) => {
    setSelectedRating(rating);
    setEditRating(rating.value || rating.rating);
    setEditComment(rating.comment || '');
  };

  const closeEditModal = () => {
    setSelectedRating(null);
    setEditRating(0);
    setEditComment('');
  };

  const handleUpdateRating = async (e) => {
    e.preventDefault();
    if (!selectedRating || editRating === 0) return;

    try {
      setUpdateLoading(true);
      const response = await api.put(`/ratings/${selectedRating.id}`, {
        rating: editRating,
        comment: editComment.trim()
      });
      
      console.log('Rating updated:', response);
      alert('Rating updated successfully!');
      closeEditModal();
      fetchMyRatings(); // Refresh the list
    } catch (error) {
      console.error('Error updating rating:', error);
      alert(error.response?.data?.message || 'Failed to update rating. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) {
      return;
    }

    try {
      await api.delete(`/ratings/${ratingId}`);
      alert('Rating deleted successfully!');
      fetchMyRatings(); // Refresh the list
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert(error.response?.data?.message || 'Failed to delete rating. Please try again.');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`cursor-${interactive ? 'pointer' : 'default'} text-xl ${
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading your ratings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Ratings</h1>
            <p className="text-gray-600 mt-2">
              All your store ratings and reviews ({ratings.length} total)
            </p>
          </div>
          <button
            onClick={fetchMyRatings}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Ratings List */}
      {ratings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No ratings yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't rated any stores yet. Start exploring and share your experiences!
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Browse Stores
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Store Info */}
                  <div className="flex items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      {rating.store?.name || `Store ID: ${rating.storeId}`}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {formatDate(rating.createdAt)}
                    </span>
                  </div>

                  {/* Rating Display */}
                  <div className="flex items-center mb-3">
                    <div className="flex mr-3">
                      {renderStars(rating.value || rating.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {rating.value || rating.rating} out of 5 stars
                    </span>
                  </div>

                  {/* Comment */}
                  {rating.comment && (
                    <div className="mb-3">
                      <p className="text-gray-700 italic">"{rating.comment}"</p>
                    </div>
                  )}

                  {/* Store Address */}
                  {rating.store?.address && (
                    <p className="text-sm text-gray-500">📍 {rating.store.address}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => openEditModal(rating)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRating(rating.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Rating Modal */}
      {selectedRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h4 className="text-lg font-semibold mb-4">
              Edit Rating for {selectedRating.store?.name || `Store ID: ${selectedRating.storeId}`}
            </h4>
            
            <form onSubmit={handleUpdateRating}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex justify-center">
                  {renderStars(editRating, true, setEditRating)}
                </div>
                {editRating > 0 && (
                  <p className="text-center text-sm text-gray-600 mt-1">
                    {editRating} star{editRating > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Update your experience..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editRating === 0 || updateLoading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {updateLoading ? 'Updating...' : 'Update Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Back to Dashboard */}
      <div className="mt-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default MyRatings;