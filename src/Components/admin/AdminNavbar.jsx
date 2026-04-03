// src/Components/admin/AdminNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  CreditCard,
  Shield,
  Bell,
  FileText,
  TrendingUp,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  Settings,
  AlertCircle
} from 'lucide-react';

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const navItems = [
    {
      path: '/admin',
      name: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      path: '/admin/users',
      name: 'Users',
      icon: <Users className="w-5 h-5" />
    },
    {
      path: '/admin/vehicles',
      name: 'Vehicles',
      icon: <Car className="w-5 h-5" />
    },
    {
      path: '/admin/pending-vehicles',
      name: 'Pending',
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      path: '/admin/bookings',
      name: 'Bookings',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      path: '/admin/payments',
      name: 'Payments',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      path: '/admin/finance',
      name: 'Finance',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      path: '/admin/roles',
      name: 'Roles',
      icon: <Shield className="w-5 h-5" />
    },
    {
      path: '/admin/notifications',
      name: 'Notifications',
      icon: <Bell className="w-5 h-5" />
    },
    {
      path: '/admin/logs',
      name: 'Audit Logs',
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center gap-2 group">
              <div className="bg-purple-500 p-1.5 rounded-lg shadow-lg shadow-purple-500/25">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DriveNow</span>
              <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full ml-2 font-semibold">
                Admin
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Scrollable on smaller screens */}
          <div className="hidden lg:flex items-center space-x-1 overflow-x-auto max-w-3xl">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  isActive(item.path)
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all duration-200 border border-gray-700"
              >
                <div className="bg-purple-500 rounded-full p-1">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300">
                  {user?.user?.name || user?.user?.email?.split('@')[0] || 'Admin'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-700 bg-gray-800/50">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {user?.user?.email || 'admin@drivenow.com'}
                      </p>
                      <p className="text-xs text-purple-400 mt-1">Administrator</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/admin/settings"
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors duration-200"
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
            className="lg:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800 animate-slideDown max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile User Info */}
              <div className="pt-4 mt-2 border-t border-gray-800">
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-lg mb-3">
                    <User className="w-4 h-4 text-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {user?.user?.name || user?.user?.email?.split('@')[0] || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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