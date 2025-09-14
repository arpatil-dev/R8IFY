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
        <button
          key={i}
          type={interactive ? "button" : undefined}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all duration-150 ${
            i <= rating ? 'text-amber-400' : 'text-gray-300'
          } ${interactive ? 'text-2xl' : 'text-lg'}`}
          onClick={interactive ? () => onStarClick(i) : undefined}
          disabled={!interactive}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      );
    }
    return <div className="flex gap-1">{stars}</div>;
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 text-lg">Loading your ratings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Ratings</h1>
              <p className="text-gray-600 text-lg">
                Manage your store reviews and experiences
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                {ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'} total
              </div>
            </div>
            <button
              onClick={fetchMyRatings}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Ratings List */}
        {ratings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No ratings yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't rated any stores yet. Start exploring and share your experiences with the community!
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Stores
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Store</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Rating</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Comment</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((rating) => (
                    <tr key={rating.id} className="border-b border-gray-100 last:border-none hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {rating.store?.name || `Store ID: ${rating.storeId}`}
                          </span>
                          {rating.store?.address && (
                            <span className="text-sm text-gray-500 truncate max-w-xs">
                              {rating.store.address}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(rating.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {renderStars(rating.value || rating.rating)}
                          <span className="ml-2 font-semibold text-gray-900">
                            {rating.value || rating.rating}.0
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {rating.comment ? (
                          <div className="max-w-xs">
                            <p className="text-gray-700 truncate" title={rating.comment}>
                              "{rating.comment}"
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No comment</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEditModal(rating)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRating(rating.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-b border-gray-100 last:border-none p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {rating.store?.name || `Store ID: ${rating.storeId}`}
                      </h3>
                      {rating.store?.address && (
                        <p className="text-sm text-gray-500 truncate">
                          {rating.store.address}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {formatDate(rating.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {renderStars(rating.value || rating.rating)}
                      <span className="ml-2 font-semibold text-gray-900">
                        {rating.value || rating.rating}.0
                      </span>
                    </div>
                  </div>

                  {rating.comment && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 italic">
                        "{rating.comment}"
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(rating)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRating(rating.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modern Edit Rating Modal */}
        {selectedRating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold text-gray-900">
                    Edit Rating
                  </h4>
                  <button
                    onClick={closeEditModal}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedRating.store?.name || `Store ID: ${selectedRating.storeId}`}
                </p>
              </div>
              
              {/* Modal Body */}
              <form onSubmit={handleUpdateRating} className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Your Rating
                  </label>
                  <div className="flex justify-center">
                    {renderStars(editRating, true, setEditRating)}
                  </div>
                  {editRating > 0 && (
                    <p className="text-center text-sm text-gray-600 mt-2">
                      {editRating} star{editRating > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Share your experience with this store..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editRating === 0 || updateLoading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    {updateLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      'Update Rating'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
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

export default MyRatings;