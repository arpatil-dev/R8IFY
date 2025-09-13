import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PasswordChange from '../PasswordChange';
import StoreList from '../StoreList';

const NormalUserDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'stores', label: 'Browse Stores', icon: '🏪' },
    { id: 'password', label: 'Change Password', icon: '🔒' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold">{user?.role || 'NORMAL_USER'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-semibold">{user?.id || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('stores')}
                  className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200"
                >
                  <div className="text-2xl mb-2">🏪</div>
                  <div className="font-semibold text-blue-900">Browse Stores</div>
                  <div className="text-sm text-blue-600">Find and rate stores</div>
                </button>
                
                <button
                  onClick={() => setActiveTab('password')}
                  className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition duration-200"
                >
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="font-semibold text-green-900">Change Password</div>
                  <div className="text-sm text-green-600">Update your password</div>
                </button>

                <Link
                  to="/my-ratings"
                  className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-200 block"
                >
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="font-semibold text-purple-900">My Ratings</div>
                  <div className="text-sm text-purple-600">View all your reviews</div>
                </Link>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Welcome to R8IFY! 🎉</h3>
              <p className="text-blue-100">
                Discover amazing stores, share your experiences, and help others make informed decisions.
                Start by browsing our store directory and leaving your first rating!
              </p>
            </div>
          </div>
        );
      
      case 'stores':
        return <StoreList />;
      
      case 'password':
        return <PasswordChange />;
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your account and explore stores
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default NormalUserDashboard;