import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StoreList from '../StoreList';
import api from '../../utils/api';

const NormalUserDashboard = () => {
  const [user, setUser] = useState(null);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(false);

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Discover amazing stores and share your experiences
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 font-medium tracking-wide">Your Role</div>
                  <div className="text-lg font-bold text-gray-900">
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

        {/* Quick Actions & Activity Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              {/* Desktop View - Full Card */}
              <div className="hidden md:block">
                <Link to="/my-ratings" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow block h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Quick Access</p>
                      <p className="text-lg font-semibold text-gray-900">My Ratings</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Mobile View - Compact/Expandable */}
              <div className="md:hidden">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Compact Header - Always Visible */}
                  <button
                    onClick={() => setIsQuickActionsExpanded(!isQuickActionsExpanded)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-semibold text-gray-900">My Ratings</h3>
                        <p className="text-xs text-gray-500">Quick access</p>
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isQuickActionsExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded Content */}
                  <div className={`transition-all duration-300 ease-in-out ${isQuickActionsExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <p className="text-gray-600 text-sm mb-4 mt-3">View and manage your reviews</p>
                      <Link 
                        to="/my-ratings" 
                        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-blue-700 transition-all flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        View My Ratings
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Activity */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Activity</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Stats Cards */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
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

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
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
          </div>
        </div>

        {/* Store Directory Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Store Directory</h2>
            <p className="text-gray-600">Discover local stores and read reviews from other customers</p>
          </div>
          <StoreList />
        </div>
      </div>
    </div>
  );
};

export default NormalUserDashboard;