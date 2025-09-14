import { useEffect, useState } from 'react';
import api from '../../utils/api';
import EditUserModal from './EditUserModal';

const UserListAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users')
      .then(res => {
        setUsers(res.data.data || []);
        setError(null);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch users');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const handleEdit = (id) => {
    const user = users.find(u => u.id === id);
    setEditUser(user);
  };

  const filteredUsers = users.filter(u => {
    const search = filter.toLowerCase();
    return (
      u.name?.toLowerCase().includes(search) ||
      u.email?.toLowerCase().includes(search) ||
      u.address?.toLowerCase().includes(search) ||
      u.role?.toLowerCase().includes(search)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA, valB;
    if (sortBy === 'name') {
      valA = a.name?.toLowerCase() || '';
      valB = b.name?.toLowerCase() || '';
    } else if (sortBy === 'email') {
      valA = a.email?.toLowerCase() || '';
      valB = b.email?.toLowerCase() || '';
    } else if (sortBy === 'address') {
      valA = a.address?.toLowerCase() || '';
      valB = b.address?.toLowerCase() || '';
    } else if (sortBy === 'role') {
      valA = a.role?.toLowerCase() || '';
      valB = b.role?.toLowerCase() || '';
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">User List</h2>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Filter by name, email, address, role"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        {/* Modern Sort Controls */}
        <div className="flex gap-3 min-w-fit">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z" />
            </svg>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-8 py-[11px] text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-gray-100 transition-colors cursor-pointer min-w-[140px]"
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="address">Sort by Address</option>
              <option value="role">Sort by Role</option>
            </select>
            <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-8 py-[11px] text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-gray-100 transition-colors cursor-pointer min-w-[120px]"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-4 text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-xl overflow-hidden shadow-sm min-w-max">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer whitespace-nowrap">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer whitespace-nowrap">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer whitespace-nowrap">Address</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer whitespace-nowrap">Role</th>
                <th className="px-4 py-3 whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(user => (
                <tr key={user.id} className="border-b border-slate-200 last:border-none hover:bg-blue-50 transition rounded-xl">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{user.address}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{user.role}</td>
                  <td className="px-4 py-3 text-right flex gap-2 justify-end whitespace-nowrap">
                    <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg shadow hover:bg-blue-200 transition" onClick={() => handleEdit(user.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-2.828.707.707-2.828a4 4 0 01.828-1.414z" /></svg>
                      Edit
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg shadow hover:bg-red-200 transition" onClick={() => handleDelete(user.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    {editUser && (
      <EditUserModal
        isOpen={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
        onUserUpdated={fetchUsers}
      />
    )}
    </div>
  );
};

export default UserListAdmin;
