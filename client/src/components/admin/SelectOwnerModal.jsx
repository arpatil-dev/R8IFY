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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Select Store Owner</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div>
            <select
              value={selectedOwnerId}
              onChange={e => setSelectedOwnerId(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="">Select an owner</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button type="button" onClick={handleSelect} disabled={!selectedOwnerId} className="px-4 py-2 bg-blue-600 text-white rounded">Select</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectOwnerModal;
