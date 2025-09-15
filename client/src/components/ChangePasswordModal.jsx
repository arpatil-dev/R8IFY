import { useState } from 'react';
import api from '../utils/api';
import { validateForm } from '../utils/validation';

const ChangePasswordModal = ({ isOpen, onClose, userId, onPasswordChanged }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isValid = validateForm({ password });
    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      await api.put(`/users/password`, { newPassword:password });
      await api.put(`/users/${userId}`, { isFirstLogin: false });
      onPasswordChanged();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-200/75 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
              placeholder="Enter your new password"
            />
          </div>
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm order-1 sm:order-2"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
