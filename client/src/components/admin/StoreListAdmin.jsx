import { useEffect, useState } from 'react';
import api from '../../utils/api';
import EditStoreModal from './EditStoreModal';

const StoreListAdmin = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [editStore, setEditStore] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = () => {
    setLoading(true);
    api.get('/stores')
      .then(res => {
        setStores(res.data.data || []);
        setError(null);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch stores');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    await api.delete(`/stores/${id}`);
    fetchStores();
  };

  const handleEdit = (id) => {
    const store = stores.find(s => s.id === id);
    setEditStore(store);
  };

  const filteredStores = stores.filter(s => {
    const search = filter.toLowerCase();
    return (
      s.name?.toLowerCase().includes(search) ||
      s.email?.toLowerCase().includes(search) ||
      s.address?.toLowerCase().includes(search) ||
      s.owner?.name?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Store List</h2>
      <input
        type="text"
        placeholder="Filter by name, email, address, owner"
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
              <th className="p-2 border">Owner</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map(store => (
              <tr key={store.id}>
                <td className="p-2 border">{store.name}</td>
                <td className="p-2 border">{store.email}</td>
                <td className="p-2 border">{store.address}</td>
                <td className="p-2 border">{store.owner?.name || '-'}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(store.id)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(store.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    {editStore && (
      <EditStoreModal
        isOpen={!!editStore}
        store={editStore}
        onClose={() => setEditStore(null)}
        onStoreUpdated={fetchStores}
      />
    )}
    </div>
  );
};

export default StoreListAdmin;
