import { useState } from 'react';
import api from '../../utils/api';
import SelectOwnerModal from './SelectOwnerModal';

const AddStoreModal = ({ isOpen, onClose, onStoreAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [owner, setOwner] = useState(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/stores', {
        name,
        email,
        address,
        ownerId: owner?.id,
      });
      onStoreAdded(res.data.store);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add store');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Store</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Store Owner</label>
            <button
              type="button"
              className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors mb-2"
              onClick={() => setShowOwnerModal(true)}
            >
              {owner ? `${owner.name} (${owner.email})` : 'Select Store Owner'}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" disabled={loading || !owner} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? 'Adding...' : 'Add Store'}</button>
          </div>
        </form>
        <SelectOwnerModal
          isOpen={showOwnerModal}
          onClose={() => setShowOwnerModal(false)}
          onOwnerSelected={ownerObj => {
            setOwner(ownerObj);
            setShowOwnerModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default AddStoreModal;
