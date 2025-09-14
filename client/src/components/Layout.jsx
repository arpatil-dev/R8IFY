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
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                  R8ify
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
                  <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
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
                  <a 
                    href="mailto:aryanrpatil2023@gmail.com"
                    className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>aryanrpatil2023@gmail.com</span>
                  </a>
                  <a 
                    href="https://github.com/arpatil-dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>arpatil-dev</span>
                  </a>
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Kolhapur, MH, IN</span>
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