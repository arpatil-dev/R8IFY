import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StoreList from '../StoreList';
import api from '../../utils/api';

const NormalUserDashboard = () => {
  const [user, setUser] = useState(null);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loadingRatings, setLoadingRatings] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log("Parsed user data in NormalUserDashboard:", parsedUser.role);
      setUser(parsedUser);
      
      // Fetch user's ratings count
      fetchUserRatings(parsedUser.id);
    }
  }, []);

  const fetchUserRatings = async (userId) => {
    try {
      setLoadingRatings(true);
      const response = await api.get(`/ratings/user/${userId}`);
      const ratingsData = response.data?.data || response.data || [];
      setTotalRatings(Array.isArray(ratingsData) ? ratingsData.length : 0);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      setTotalRatings(0);
    } finally {
      setLoadingRatings(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/*Hero Section*/}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Discover amazing stores and share your experiences
                </p>
              </div>
              <div className="mt-6 md:mt-0">
                <div className="flex items-center gap-3 bg-blue-600 bg-opacity-30 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-blue-400">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 bg-opacity-70">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-blue-100 mb-1 font-medium tracking-wide">Your Role</div>
                    <div className="text-lg font-bold text-white drop-shadow-sm">
                      {user?.role
                        ? user.role
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, c => c.toUpperCase())
                        : 'Normal User'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Browse Stores */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Stores</h3>
              <p className="text-gray-600 text-sm mb-4">Discover and explore local stores</p>
              <a href="#stores" className="text-blue-600 font-medium text-sm hover:text-blue-700">
                View All →
              </a>
            </div>

            {/* My Ratings */}
            <Link to="/my-ratings" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow block">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Ratings</h3>
              <p className="text-gray-600 text-sm mb-4">View and manage your reviews</p>
              <span className="text-yellow-600 font-medium text-sm hover:text-yellow-700">
                View All →
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Activity & Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Activity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Ratings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingRatings ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      totalRatings
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
            </div>

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 0V3M3 7h18l-1.5 9a2 2 0 01-2 2H6.5a2 2 0 01-2-2L3 7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Directory Section */}
        
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Store Directory</h2>
            <p className="text-gray-600">Discover local stores and read reviews from other customers</p>
          </div>
          <StoreList />
        </div>
      </div>
    
  );
};

export default NormalUserDashboard;