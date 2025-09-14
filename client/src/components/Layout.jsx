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
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Navigation */}
            <div className="hidden md:grid md:grid-cols-3 md:items-center h-16">
              {/* Logo - Left */}
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                  R8IFY
                </Link>
              </div>

              {/* Navigation Menu - Center */}
              {isAuthenticated && user && (
                <nav className="flex justify-center space-x-2">
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      location.pathname === '/dashboard'
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent'
                    }`}
                  >
                    Dashboard
                  </Link>
                  
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      location.pathname === '/profile'
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent'
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
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {user.role?.replace(/_/g, ' ').toLowerCase() || 'User'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  !isAuthPage && (
                    <Link
                      to="/auth"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
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
                  <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    R8IFY
                  </Link>
                </div>

                {/* Right Side - Menu Button or Auth Link */}
                <div className="flex items-center">
                  {isAuthenticated && user ? (
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
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
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
                      >
                        Sign In
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Mobile Menu Dropdown */}
              {isAuthenticated && user && isMobileMenuOpen && (
                <div className="border-t border-gray-100 bg-white/95 backdrop-blur-sm">
                  {/* User Name Section */}
                  <div className="px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm mr-3 shadow-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        <div className="text-xs text-blue-600 font-medium capitalize">
                          {user.role?.replace(/_/g, ' ').toLowerCase() || 'User'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-1 py-3">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mx-3 flex items-center space-x-3 ${
                        location.pathname === '/dashboard'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-transparent'
                      }`}
                    >
                      <span className="text-lg">📊</span>
                      <span>Dashboard</span>
                    </Link>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mx-3 flex items-center space-x-3 ${
                        location.pathname === '/profile'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-transparent'
                      }`}
                    >
                      <span className="text-lg">👤</span>
                      <span>Profile</span>
                    </Link>

                    {user.role === 'NORMAL_USER' && (
                      <Link
                        to="/my-ratings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mx-3 flex items-center space-x-3 ${
                          location.pathname === '/my-ratings'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-transparent'
                        }`}
                      >
                        <span className="text-lg">⭐</span>
                        <span>My Ratings</span>
                      </Link>
                    )}
                  </nav>

                  {/* Logout Section */}
                  <div className="border-t border-gray-100 pt-3 px-4 pb-4">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                    >
                      <span className="text-lg">🚪</span>
                      <span>Logout</span>
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
        <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              {/* Brand Section */}
              <div className="flex flex-col items-center md:items-start">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3">
                  R8IFY
                </Link>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Discover, rate, and review amazing stores. Share your experiences with the community.
                </p>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 block">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 block">
                    Profile
                  </Link>
                  {isAuthenticated && user?.role === 'NORMAL_USER' && (
                    <Link to="/my-ratings" className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 block">
                      My Ratings
                    </Link>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>hello@r8ify.com</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Worldwide</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-200 mt-8 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-center md:text-left text-gray-500 text-sm">
                  © 2025 R8IFY. All rights reserved. Made with ❤️ for the community.
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
                  <a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-200 text-center">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-200 text-center">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-200 text-center">
                    Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;