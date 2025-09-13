import { useEffect, useState } from 'react';
import NormalUserDashboard from './NormalUserDashboard';
import StoreOwnerDashboard from './StoreOwnerDashboard';
import SystemAdminDashboard from './SystemAdminDashboard';

const RoleBasedDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const authToken = localStorage.getItem('authToken');
    
    console.log('RoleBasedDashboard - Checking authentication...');
    console.log('AuthToken:', authToken);
    console.log('UserData:', userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Parsed user data:', parsedUser);
        console.log('User role:', parsedUser.role);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
      }
    } else {
      console.log('No user data found in localStorage');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  // Render dashboard based on user role
  switch (user.role) {
    case 'NORMAL_USER':
      return <NormalUserDashboard />;
    
    case 'STORE_OWNER':
      return <StoreOwnerDashboard />;
    
    case 'SYSTEM_ADMINISTRATOR':
      return <SystemAdminDashboard />;
    
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unknown Role</h2>
            <p className="text-gray-600">
              Your account role "{user.role}" is not recognized. Please contact support.
            </p>
          </div>
        </div>
      );
  }
};

export default RoleBasedDashboard;