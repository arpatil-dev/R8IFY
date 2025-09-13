import { useEffect, useState } from 'react';
import api from '../../utils/api';
import EditStoreModal from './EditStoreModal';

const StoreListAdmin = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [editStore, setEditStore] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

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
      s.owner?.name?.toLowerCase().includes(search) ||
      (typeof s.avgRating === 'number' && s.avgRating.toFixed(2).includes(search))
    );
  });

  const sortedStores = [...filteredStores].sort((a, b) => {
    let valA, valB;
    if (sortBy === 'name') {
      valA = a.name?.toLowerCase() || '';
      valB = b.name?.toLowerCase() || '';
    } else if (sortBy === 'owner') {
      valA = a.owner?.name?.toLowerCase() || '';
      valB = b.owner?.name?.toLowerCase() || '';
    } else if (sortBy === 'rating') {
      valA = a.avgRating || 0;
      valB = b.avgRating || 0;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Store List</h2>
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
        <input
          type="text"
          placeholder="Filter by name, email, address, owner, rating"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="mb-2 md:mb-0 w-full border rounded px-3 py-2"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="name">Sort by Name</option>
          <option value="owner">Sort by Owner</option>
          <option value="rating">Sort by Rating</option>
        </select>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
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
              <th className="p-2 border">Overall Rating</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStores.map(store => (
              <tr key={store.id}>
                <td className="p-2 border">{store.name}</td>
                <td className="p-2 border">{store.email}</td>
                <td className="p-2 border">{store.address}</td>
                <td className="p-2 border">{store.owner?.name || '-'}</td>
                <td className="p-2 border">{typeof store.avgRating === 'number' ? store.avgRating.toFixed(2) : '-'}</td>
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
