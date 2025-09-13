import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  
  // Check if user is authenticated (either by token or user data)
  const isAuthenticated = authToken || userData;
  
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;