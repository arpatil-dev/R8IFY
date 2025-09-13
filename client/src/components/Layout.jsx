import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Layout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated (you can modify this logic based on your auth implementation)
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    console.log('Layout - Checking authentication...');
    console.log('Token:', token);
    console.log('UserData:', userData);
    
    if (token || userData) {
      setIsAuthenticated(true);
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('Layout - User authenticated:', parsedUser);
        } catch (error) {
          console.error('Layout - Error parsing user data:', error);
        }
      }
    } else {
      console.log('Layout - User not authenticated');
    }
  }, [location.pathname]); // Re-check on route changes

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/auth');
  };

  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      {!isAuthPage && (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                  R8IFY
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex space-x-8">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login / Register
                  </Link>
                )}
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {isAuthenticated && user ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-sm">
                      <span className="text-gray-700">Welcome, </span>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  !isAuthPage && (
                    <Link
                      to="/auth"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Sign In
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${!isAuthPage ? 'pt-4' : ''}`}>
        {children}
      </main>

      {/* Footer */}
      {!isAuthPage && (
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-gray-500 text-sm">
              © 2025 R8IFY. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;