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
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/customer" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 p-1.5 rounded-lg shadow-lg shadow-yellow-500/25 transform transition-transform group-hover:scale-105">
                <Car className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">DriveNow</span>
              <span className="text-xs bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-2 py-0.5 rounded-full ml-2 font-semibold shadow-sm">
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
                    ? 'bg-yellow-500/20 text-yellow-400 shadow-lg backdrop-blur-sm'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
                {/* Red notification badge removed */}
              </Link>
            ))}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 px-3 py-1.5 rounded-full transition-all duration-200 border border-gray-700 backdrop-blur-sm"
              >
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                  <span className="text-black text-sm font-bold">{getUserInitial()}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{getUserName()}</p>
                  <p className="text-xs text-gray-400">Customer</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 z-50 overflow-hidden animate-slideDown">
                    <div className="px-4 py-3 border-b border-gray-800 bg-gradient-to-r from-gray-800 to-gray-900">
                      <p className="text-xs text-yellow-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {user?.email || 'customer@drivenow.com'}
                      </p>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/customer/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-800 transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </Link>
                      
                      <Link
                        to="/customer/bookings"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-800 transition-colors duration-200"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>My Bookings</span>
                      </Link>
                      
                      <Link
                        to="/customer/payments"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-800 transition-colors duration-200"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Payment History</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-2 pb-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-gray-800 transition-colors duration-200"
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
            className="md:hidden text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 animate-slideDown">
            <div className="flex flex-col space-y-1">
              {/* User Info in Mobile */}
              <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-800/30 rounded-lg">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-black font-bold">{getUserInitial()}</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{getUserName()}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'customer@drivenow.com'}</p>
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
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              
              {/* Divider */}
              <div className="h-px bg-gray-800 my-2"></div>
              
              {/* Additional Links */}
              <Link
                to="/customer/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg"
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
                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
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