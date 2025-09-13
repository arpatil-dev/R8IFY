import { useEffect, useState } from 'react';
import api from '../../utils/api';
import EditUserModal from './EditUserModal';

const UserListAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [editUser, setEditUser] = useState(null);

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

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">User List</h2>
      <input
        type="text"
        placeholder="Filter by name, email, address, role"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-4 w-full border rounded px-3 py-2"
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.address}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(user.id)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
