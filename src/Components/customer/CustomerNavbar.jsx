// src/Components/customer/CustomerNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import {
  Home,
  Calendar,
  CreditCard,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Car,
  Search,
  BookOpen,
  Wallet,
  Settings
} from 'lucide-react';

export default function CustomerNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const navItems = [
    {
      path: '/customer',
      name: 'Browse Cars',
      icon: <Search className="w-5 h-5" />,
      activeIcon: <Search className="w-5 h-5" />
    },
    {
      path: '/customer/bookings',
      name: 'My Bookings',
      icon: <Calendar className="w-5 h-5" />,
      activeIcon: <Calendar className="w-5 h-5" />
    },
    {
      path: '/customer/payments',
      name: 'Payments',
      icon: <CreditCard className="w-5 h-5" />,
      activeIcon: <CreditCard className="w-5 h-5" />
    },
    {
      path: '/customer/notifications',
      name: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      activeIcon: <Bell className="w-5 h-5" />
    },
    {
      path: '/customer/profile',
      name: 'Profile',
      icon: <User className="w-5 h-5" />,
      activeIcon: <User className="w-5 h-5" />
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/customer') {
      return location.pathname === '/customer';
    }
    return location.pathname.startsWith(path);
  };

  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'Customer';
  };

  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  if (!token) return null;

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-b border-blue-700 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/customer" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/25 transform transition-transform group-hover:scale-105">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">DriveNow</span>
              <span className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-0.5 rounded-full ml-2 font-semibold shadow-sm">
                Customer
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
                {item.name === 'Notifications' && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    3
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 bg-blue-700/50 hover:bg-blue-700 px-3 py-1.5 rounded-full transition-all duration-200 border border-blue-600 backdrop-blur-sm"
              >
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-bold">{getUserInitial()}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{getUserName()}</p>
                  <p className="text-xs text-blue-200">Customer</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-blue-200 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 overflow-hidden animate-slideDown">
                    <div className="px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-blue-900 to-gray-800">
                      <p className="text-xs text-blue-300">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {user?.email || 'customer@drivenow.com'}
                      </p>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/customer/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </Link>
                      
                      <Link
                        to="/customer/bookings"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>My Bookings</span>
                      </Link>
                      
                      <Link
                        to="/customer/payments"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Payment History</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-2 pb-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-gray-700 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-700 animate-slideDown">
            <div className="flex flex-col space-y-1">
              {/* User Info in Mobile */}
              <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-blue-800/30 rounded-lg">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-white font-bold">{getUserInitial()}</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{getUserName()}</p>
                  <p className="text-xs text-blue-200">{user?.email || 'customer@drivenow.com'}</p>
                </div>
              </div>

              {/* Nav Items */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-200 hover:bg-blue-700'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                  {item.name === 'Notifications' && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      3
                    </span>
                  )}
                </Link>
              ))}
              
              {/* Divider */}
              <div className="h-px bg-blue-700 my-2"></div>
              
              {/* Additional Links */}
              <Link
                to="/customer/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-blue-700 rounded-lg"
              >
                <Settings className="w-5 h-5" />
                <span>Account Settings</span>
              </Link>
              
              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}