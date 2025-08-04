import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, HeartIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();

  // Check user login status
  useEffect(() => {
    const checkUserSession = () => {
      const userId = localStorage.getItem('currentUserId');
      const adminLoggedIn = localStorage.getItem('adminLoggedIn');
      
      if (userId || adminLoggedIn === 'true') {
        setIsLoggedIn(true);
        if (adminLoggedIn === 'true') {
          const adminUsername = localStorage.getItem('adminUsername') || 'Admin';
          setCurrentUser(adminUsername);
        } else if (userId) {
          // Get user data from stored user information
          const userDataKey = `userData_${userId}`;
          const userData = localStorage.getItem(userDataKey);
          
          if (userData) {
            const parsedUserData = JSON.parse(userData);
            setCurrentUser(parsedUserData.fullName || parsedUserData.firstName || 'User');
          } else {
            // Fallback: try to get name from latest form
            const userFormsKey = `submittedForms_${userId}`;
            const savedForms = localStorage.getItem(userFormsKey);
            if (savedForms) {
              const forms = JSON.parse(savedForms);
              if (forms.length > 0) {
                setCurrentUser(forms[forms.length - 1].details.fullName || 'User');
              } else {
                setCurrentUser('User');
              }
            } else {
              setCurrentUser('User');
            }
          }
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser('');
      }
    };

    checkUserSession();
    
    // Listen for storage changes (in case user logs in/out in another tab)
    window.addEventListener('storage', checkUserSession);
    
    return () => {
      window.removeEventListener('storage', checkUserSession);
    };
  }, []);

  // Check if admin is logged in
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

  // Don't render navbar for admin
  if (isAdminLoggedIn) {
    return null;
  }

  const handleLogout = () => {
    // Check if admin is logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    
    if (adminLoggedIn === 'true') {
      // Admin logout
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminUsername');
      window.location.href = '/admin';
    } else {
      // Regular user logout
      localStorage.removeItem('currentUserId');
      window.location.href = '/';
    }
  };

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name: t('contact'), href: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLanguageChange = (lang) => {
    toggleLanguage();
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    const root = document.documentElement;
    switch(size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'normal':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
    }
  };

  return (
    <div className="w-full">
      {/* Top Administrative Bar - Always visible */}
      <div className="admin-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {/* Left side - Empty or can add other content later */}
            <div className="flex items-center">
              {/* Reserved for future content */}
            </div>
            
            {/* Right side - Administration, Font size and Language */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              {/* Administration Button */}
              <Link 
                to="/admin" 
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('administration')}
              </Link>
              
              {/* Font Size Controls */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button 
                  onClick={() => handleFontSizeChange('large')}
                  className={`px-1 py-1 sm:px-2 text-sm sm:text-lg font-bold transition-colors rounded ${fontSize === 'large' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
                >
                  A+
                </button>
                <button 
                  onClick={() => handleFontSizeChange('normal')}
                  className={`px-1 py-1 sm:px-2 text-sm sm:text-base font-medium transition-colors rounded ${fontSize === 'normal' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
                >
                  A
                </button>
                <button 
                  onClick={() => handleFontSizeChange('small')}
                  className={`px-1 py-1 sm:px-2 text-xs sm:text-sm transition-colors rounded ${fontSize === 'small' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
                >
                  A-
                </button>
              </div>
              
              {/* Language Switcher */}
              <div className="flex items-center">
                <button 
                  onClick={toggleLanguage}
                  className="bg-white border border-gray-300 rounded px-2 py-1 sm:px-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {language === 'en' ? 'हिं' : 'EN'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 font-heading">
                  {t('lifestyleClinicName')}
                </span>
                <div className="text-xs text-gray-500">{t('lifestyleClinicLocation')}</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {isLoggedIn ? (
              // Show user menu when logged in
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 text-gray-700">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-sm">{currentUser}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // Show login/signup when not logged in and not on dashboard/health assessment page
              location.pathname !== '/dashboard' && (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary"
                  >
                    {t('signup')}
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isLoggedIn ? (
                // Show user menu when logged in
                <div className="flex flex-col space-y-3 px-3">
                  <Link
                    to="/dashboard"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-2 text-gray-700 px-3 py-2 bg-gray-50 rounded-md">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-sm">{currentUser}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium text-left"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                // Show login/signup when not logged in and not on dashboard/health assessment page
                location.pathname !== '/dashboard' && (
                  <div className="flex flex-col space-y-3 px-3">
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-primary text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      </nav>
    </div>
  );
};

export default Navbar;
