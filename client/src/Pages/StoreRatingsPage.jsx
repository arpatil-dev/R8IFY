import { useEffect, useState } from 'react';
import api from '../utils/api';

const StoreRatingsPage = () => {
  const [user, setUser] = useState(null);
  const [ownedStores, setOwnedStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'STORE_OWNER') {
        api.get(`/stores/owner/${parsedUser.id}`)
          .then(res => {
            console.log(res.data.data[0]);
            setOwnedStores(res.data.data || []);
            setError(null);
          })
          .catch(err => {
            setError(err.response?.data?.message || 'Failed to fetch stores');
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Users Who Rated Your Stores</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : ownedStores.length === 0 ? (
        <div>No stores found for this owner.</div>
      ) : (
        ownedStores.map(store => (
          <div key={store.id} className="mb-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">{store.name}</h2>
            <div className="mb-2 text-sm text-gray-500">{store.address}</div>
            <div>
              <span className="block text-xs font-semibold text-gray-700 mb-1">Users who rated this store:</span>
              {store.ratings && store.ratings.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {store.ratings.map((rating, idx) => (
                    <li key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{rating.user?.name || 'Unknown User'}</span>
                        <span className="ml-2 text-xs text-gray-500">{rating.user?.email}</span>
                      </div>
                      <span className="text-yellow-600 font-bold">{rating.value}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">No ratings yet.</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StoreRatingsPage;
