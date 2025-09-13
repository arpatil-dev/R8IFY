import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      console.log('Full login response:', response);
      
      // Handle different possible response structures
      let userData = null;
      let token = null;
      
      // Check if response has user data directly
      console.log(response.data.user)
      if (response.data.user) {
        userData = response.data.user;
        token = response.token;
      } else if (response.data.id || response.data.email) {
        // Response might contain user data directly
        userData = response;
      }
      console.log(userData);
      // Store authentication data
      if (token) {
        localStorage.setItem('authToken', token);
        console.log('Token stored:', token);
      }
      
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data stored:', userData);
        console.log('User role:', userData.role);
      } else {
        // If no user data, create a minimal user object
        console.warn('No user data in response, creating minimal user object');
        const minimalUser = {
          email: formData.email,
          role: 'NORMAL_USER' // Default role
        };
        localStorage.setItem('userData', JSON.stringify(minimalUser));
      }
      
      // Always store some form of authentication marker
      if (!token && !userData) {
        localStorage.setItem('authToken', 'authenticated');
      }
      
      console.log('Authentication successful, redirecting to dashboard...');
      
      // Redirect to dashboard - the RoleBasedDashboard will handle role-specific rendering
      navigate('/dashboard');
      
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          Register here
        </button>
      </p>
    </div>
  );
};

export default Login;