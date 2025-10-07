import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../hooks/useNotifications';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { getProfileImageUrl, getInitials } from '../utils/profileImage';
import logo from '../assets/logo.png';
import {
  User,
  LogOut,
  Bell,
  Settings,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Heart,
  Shield,
  UserCircle
} from 'lucide-react';

const Navbar = ({ showCustomerLoginOnly = false }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    // Redirect based on user role
    if (user?.role === 'Superadmin') {
      navigate('/login-superadmin');
    } else if (user?.role === 'HCS Admin') {
      navigate('/login-admin');
    } else {
      navigate('/');
    }
  };

  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'Customer':
        return '/dashboard/user';
      case 'HCS Admin':
        return '/dashboard/hcs';
      case 'Superadmin':
        return '/dashboard/superadmin';
      default:
        return '/dashboard/user';
    }
  };

  const getProfileRoute = () => {
    switch (user?.role) {
      case 'Customer':
        return '/dashboard/user/profile';
      case 'HCS Admin':
        return '/dashboard/hcs/profile';
      case 'Superadmin':
        return '/dashboard/superadmin/profile';
      default:
        return '/dashboard/user/profile';
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'Customer':
        return 'default';
      case 'HCS Admin':
        return 'default';
      case 'Superadmin':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg' : 'py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md'} border-b border-gray-100/50 dark:border-slate-700/50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-0 bg-transparent rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-none">
              <h1 className="text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-poppins drop-shadow-md animate-pulse-slow">
                EWEL
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Navigation Links */}
            <Link
              to="/"
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link
              to="/healthcare"
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
            >
              <Heart className="h-4 w-4 mr-2" />
              Healthcare
            </Link>

            {/* Auth Buttons */}
            {!user ? (
              <div className="flex items-center space-x-2 ml-4">
                {!showCustomerLoginOnly && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/login-admin')}
                      className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/login-superadmin')}
                      className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Superadmin
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  onClick={() => navigate('/login-customer')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Customer Login
                </Button>
              </div>
            ) : (
              /* User Profile Section */
              <div className="flex items-center space-x-2 ml-4">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full w-10 h-10"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )}
                </Button>

                {/* Notifications - Only for Customers */}
                {user.role === 'Customer' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full w-10 h-10"
                    onClick={() => navigate('/dashboard/user/notifications')}
                  >
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                )}

                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Avatar className="h-8 w-8">
                      {user.profilePhoto && (
                        <AvatarImage
                          src={getProfileImageUrl(user.profilePhoto)}
                          alt={user.name}
                        />
                      )}
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[120px]">{user.name}</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 py-2 z-50 animate-in fade-in-90 slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                        <div className="flex items-center space-x-3 mb-2">
                          <Avatar className="h-12 w-12">
                            {user.profilePhoto && (
                              <AvatarImage
                                src={getProfileImageUrl(user.profilePhoto)}
                                alt={user.name}
                              />
                            )}
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                          {user.role}
                        </Badge>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getProfileRoute()}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          My Profile
                        </Link>
                        <Link
                          to={getDashboardRoute()}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Dashboard
                        </Link>
                      </div>

                      <Separator className="my-1" />

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="relative w-10 h-10"
                onClick={() => navigate('/dashboard/user/notifications')}
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 w-10 h-10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-6 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
            {!user ? (
              <>
                <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-slate-700">
                  <Link
                    to="/"
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="h-5 w-5 mr-3" />
                    Home
                  </Link>
                  <Link
                    to="/healthcare"
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    Healthcare
                  </Link>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      navigate('/login-customer');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  >
                    Customer Login
                  </Button>
                  {!showCustomerLoginOnly && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate('/login-admin');
                          setIsMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Login
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate('/login-superadmin');
                          setIsMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        <UserCircle className="h-4 w-4 mr-2" />
                        Superadmin Login
                      </Button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      {user.profilePhoto && (
                        <AvatarImage
                          src={getProfileImageUrl(user.profilePhoto)}
                          alt={user.name}
                        />
                      )}
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs mt-1">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="w-10 h-10"
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Link
                    to="/"
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="h-5 w-5 mr-3" />
                    Home
                  </Link>
                  <Link
                    to="/healthcare"
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    Healthcare
                  </Link>
                  <Link
                    to={getProfileRoute()}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3" />
                    My Profile
                  </Link>
                  <Link
                    to={getDashboardRoute()}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left px-4"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;