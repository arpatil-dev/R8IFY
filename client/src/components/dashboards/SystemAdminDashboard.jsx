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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Admin Dashboard</h1>
        <p className="text-gray-500">Minimal, modern control panel for R8IFY</p>
      </header>

      {user && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <span className="inline-block mt-2 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium">{user.role}</span>
                      </div>
          <div className="flex flex-col items-end">
            <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-medium">Full System Access</span>
          </div>
        </div>
      )}

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Users</div>
          <div className="text-2xl font-bold text-blue-600">{loadingStats ? '...' : errorStats ? '!' : stats.usersCount}</div>
        </div>
        {/* Total Stores */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Stores</div>
          <div className="text-2xl font-bold text-green-600">{loadingStats ? '...' : errorStats ? '!' : stats.storesCount}</div>
        </div>
        {/* Total Reviews */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Ratings</div>
          <div className="text-2xl font-bold text-yellow-500">{loadingStats ? '...' : errorStats ? '!' : stats.ratingsCount}</div>
        </div>
      </div>

      {/* Minimal Actions */}
      <div className="flex gap-4 mb-8">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition" onClick={() => setShowAddUser(true)}>
          Add User
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition" onClick={() => setShowAddStore(true)}>
          Add Store
        </button>
      </div>

      {/* Recent Ratings */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Ratings</h2>
        <div className="bg-white rounded-xl shadow-sm p-4">
          {recentRatings.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {recentRatings.map((rating, idx) => (
                <li key={rating.id || idx} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-800">{rating.user?.name || 'Unknown User'}</span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="font-semibold text-gray-800">{rating.store?.name || 'Unknown Store'}</span>
                    <span className="ml-2 text-yellow-500 font-bold">{rating.value || rating.rating}★</span>
                    {rating.comment && (
                      <span className="ml-2 text-gray-500 italic">"{rating.comment}"</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(rating.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-sm">No recent ratings found.</div>
          )}
        </div>
      </section>

      {/* User and Store Lists (vertical stack) */}
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <UserListAdmin />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <StoreListAdmin />
        </div>
      </div>
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
  );
};

export default SystemAdminDashboard;