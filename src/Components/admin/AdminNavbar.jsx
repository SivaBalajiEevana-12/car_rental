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
  AlertCircle,
  Send
} from 'lucide-react';

export default function AdminNavbar() {
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
    { path: '/admin', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/users', name: 'Users', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/vehicles', name: 'Vehicles', icon: <Car className="w-5 h-5" /> },
    { path: '/admin/pending-vehicles', name: 'Pending', icon: <AlertCircle className="w-5 h-5" /> },
    { path: '/admin/bookings', name: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
    { path: '/admin/payments', name: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/admin/finance', name: 'Finance', icon: <TrendingUp className="w-5 h-5" /> },
    { path: '/admin/roles', name: 'Roles', icon: <Shield className="w-5 h-5" /> },
    { path: '/admin/notifications', name: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { path: '/admin/logs', name: 'Audit Logs', icon: <FileText className="w-5 h-5" /> }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  // Get user display name - FIXED
  const getUserName = () => {
    if (user?.name && user.name !== 'Admin') return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'Admin';
  };

  const getUserEmail = () => {
    if (user?.email) return user.email;
    return 'admin@drivenow.com';
  };

  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  if (!token) return null;

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-2 shrink-0">
            <div className="bg-purple-500 p-1.5 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">DriveNow</span>
            <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full ml-1">
              Admin
            </span>
          </Link>

          {/* Desktop Navigation - Scrollable */}
          <div className="hidden lg:flex items-center space-x-1 overflow-x-auto flex-1 justify-center mx-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  isActive(item.path)
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Send Notification Button */}
            <button
              onClick={() => navigate('/admin/notifications')}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition"
            >
              <Send className="w-4 h-4" />
              <span className="text-sm">Send</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-700"
              >
                <div className="bg-purple-500 rounded-full w-7 h-7 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{getUserInitial()}</span>
                </div>
                <span className="text-sm text-gray-200">{getUserName()}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{getUserEmail()}</p>
                      <p className="text-xs text-purple-400 mt-1">Administrator</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-700 transition text-left"
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
            className="lg:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive(item.path)
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                to="/admin/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-purple-400 hover:bg-gray-800"
              >
                <Send className="w-5 h-5" />
                <span>Send Notification</span>
              </Link>
              <div className="pt-4 mt-2 border-t border-gray-800">
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-lg mb-3">
                    <div className="bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center">
                      <span className="text-white font-bold">{getUserInitial()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{getUserName()}</p>
                      <p className="text-xs text-gray-400">{getUserEmail()}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
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
    </nav>
  );
}