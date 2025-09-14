import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Layout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            {/* Desktop Navigation */}
            <div className="hidden md:grid md:grid-cols-3 md:items-center h-16">
              {/* Logo - Left */}
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                  R8IFY
                </Link>
              </div>

              {/* Navigation Menu - Center */}
              {isAuthenticated && user && (
                <nav className="flex justify-center space-x-8">
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/dashboard'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/profile'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    Profile
                  </Link>
                </nav>
              )}

              {/* User Menu - Right */}
              <div className="flex items-center justify-end">
                {isAuthenticated && user ? (
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-gray-700">Welcome, </span>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  !isAuthPage && (
                    <Link
                      to="/auth"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Sign In
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <div className="flex justify-between items-center h-16">
                {/* Logo - Left */}
                <div className="flex items-center">
                  <Link to="/" className="text-xl font-bold text-blue-600">
                    R8IFY
                  </Link>
                </div>

                {/* Right Side - Menu Button or Auth Link */}
                <div className="flex items-center">
                  {isAuthenticated && user ? (
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                      </svg>
                    </button>
                  ) : (
                    !isAuthPage && (
                      <Link
                        to="/auth"
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        Sign In
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Mobile Menu Dropdown */}
              {isAuthenticated && user && isMobileMenuOpen && (
                <div className="border-t border-gray-200 py-3">
                  {/* User Name Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-1 py-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors mx-2 ${
                        location.pathname === '/dashboard'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                    >
                      📊 Dashboard
                    </Link>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors mx-2 ${
                        location.pathname === '/profile'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                    >
                      👤 Profile
                    </Link>

                    {user.role === 'NORMAL_USER' && (
                      <Link
                        to="/my-ratings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors mx-2 ${
                          location.pathname === '/my-ratings'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                        }`}
                      >
                        ⭐ My Ratings
                      </Link>
                    )}
                  </nav>

                  {/* Logout Section */}
                  <div className="border-t border-gray-100 pt-3 px-4">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-red-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
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