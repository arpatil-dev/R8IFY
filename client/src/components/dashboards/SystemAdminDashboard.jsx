import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddUserModal from '../admin/AddUserModal';
import AddStoreModal from '../admin/AddStoreModal';
import UserListAdmin from '../admin/UserListAdmin';
import StoreListAdmin from '../admin/StoreListAdmin';
import api from '../../utils/api';

const SystemAdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [stats, setStats] = useState({ usersCount: 0, storesCount: 0, ratingsCount: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [recentRatings, setRecentRatings] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    // Fetch dashboard stats
    api.get('/admin/stats')
      .then(res => {
        setStats(res.data.data || { usersCount: 0, storesCount: 0, ratingsCount: 0 });
        setErrorStats(null);
      })
      .catch(err => {
        setErrorStats(err.response?.data?.message || 'Failed to fetch stats');
      })
      .finally(() => setLoadingStats(false));

    // Fetch recent ratings (latest 3)
    api.get('/ratings/recent?limit=3')
      .then(res => {
        setRecentRatings(res.data.data || []);
      })
      .catch(err => {
        setRecentRatings([]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  System Admin Dashboard
                </h1>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm mt-1">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-lg">
                Complete system control and management
              </p>
            </div>
            {user && (
              <div className="mt-6 md:mt-0">
                <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Users */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStats ? (
                      <span className="animate-pulse">...</span>
                    ) : errorStats ? (
                      <span className="text-red-500">!</span>
                    ) : (
                      stats.usersCount
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Stores */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Stores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStats ? (
                      <span className="animate-pulse">...</span>
                    ) : errorStats ? (
                      <span className="text-red-500">!</span>
                    ) : (
                      stats.storesCount
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Ratings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Ratings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingStats ? (
                      <span className="animate-pulse">...</span>
                    ) : errorStats ? (
                      <span className="text-red-500">!</span>
                    ) : (
                      stats.ratingsCount
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
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add User */}
            <button 
              onClick={() => setShowAddUser(true)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">User Management</p>
                  <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Add New User
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Add Store */}
            <button 
              onClick={() => setShowAddStore(true)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Store Management</p>
                  <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Add New Store
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Ratings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {recentRatings.length > 0 ? (
              <div className="space-y-4">
                {recentRatings.map((rating, idx) => (
                  <div key={rating.id || idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {rating.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{rating.user?.name || 'Unknown User'}</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="font-semibold text-gray-900">{rating.store?.name || 'Unknown Store'}</span>
                        </div>
                        {rating.comment && (
                          <p className="text-sm text-gray-600 italic mt-1">"{rating.comment}"</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="font-bold text-gray-900">{rating.value || rating.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(rating.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500">No recent activity found</p>
              </div>
            )}
          </div>
        </div>

        {/* Management Sections */}
        <div className="space-y-8">
          <UserListAdmin />
          <StoreListAdmin />
        </div>

        {/* Modals */}
        {showAddUser && (
          <AddUserModal
            isOpen={showAddUser}
            onClose={() => setShowAddUser(false)}
            onUserAdded={() => setShowAddUser(false)}
          />
        )}
        {showAddStore && (
          <AddStoreModal
            isOpen={showAddStore}
            onClose={() => setShowAddStore(false)}
            onStoreAdded={() => setShowAddStore(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SystemAdminDashboard;