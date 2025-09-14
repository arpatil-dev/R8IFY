import { useEffect, useState } from 'react';
import api from '../../utils/api';

const SelectOwnerModal = ({ isOpen, onClose, onOwnerSelected }) => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get('/users?role=STORE_OWNER')
        .then(res => {
          setOwners(res.data.data || []);
          setError(null);
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Failed to fetch store owners');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSelect = () => {
    if (selectedOwnerId) {
      const owner = owners.find(o => o.id === selectedOwnerId);
      onOwnerSelected(owner);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Store Owner</h2>
        {loading ? (
          <div className="text-center text-gray-500 py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-xs py-2">{error}</div>
        ) : (
          <div>
            <select
              value={selectedOwnerId}
              onChange={e => setSelectedOwnerId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm mb-4"
            >
              <option value="">Select an owner</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSelect}
                disabled={!selectedOwnerId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Select
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectOwnerModal;
