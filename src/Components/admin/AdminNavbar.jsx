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
  Send,
  MoreHorizontal
} from 'lucide-react';

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
    setShowMoreMenu(false);
  }, [location.pathname]);

  // Primary navigation items (always visible)
  const primaryNavItems = [
    { path: '/admin', name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/admin/users', name: 'Users', icon: <Users className="w-4 h-4" /> },
    { path: '/admin/vehicles', name: 'Vehicles', icon: <Car className="w-4 h-4" /> },
    { path: '/admin/pending-vehicles', name: 'Pending', icon: <AlertCircle className="w-4 h-4" /> },
    { path: '/admin/bookings', name: 'Bookings', icon: <Calendar className="w-4 h-4" /> },
  ];

  // Secondary navigation items (in "More" dropdown)
  const secondaryNavItems = [
    { path: '/admin/payments', name: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { path: '/admin/finance', name: 'Finance', icon: <TrendingUp className="w-4 h-4" /> },
    { path: '/admin/roles', name: 'Roles', icon: <Shield className="w-4 h-4" /> },
    { path: '/admin/notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { path: '/admin/logs', name: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
    { path: '/admin/owner-applications', name: 'Owner Apps', icon: <Users className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

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
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-2 shrink-0">
            <div className="bg-purple-500 p-1 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">DriveNow</span>
            <span className="text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded-full ml-1">
              Admin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {primaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap text-sm ${
                  isActive(item.path)
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                  showMoreMenu ? 'bg-purple-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <MoreHorizontal className="w-4 h-4" />
                <span>More</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
              </button>

              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
                    {secondaryNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowMoreMenu(false)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${
                          isActive(item.path)
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Send Notification Button */}
            <button
              onClick={() => navigate('/admin/notifications')}
              className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg transition text-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-2 py-1.5 rounded-lg border border-gray-700"
              >
                <div className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{getUserInitial()}</span>
                </div>
                <span className="text-sm text-gray-200">{getUserName()}</span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
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
                      <Link
                        to="/admin/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition"
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
            className="lg:hidden text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-gray-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-gray-800 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <div className="flex flex-col space-y-1">
              {/* All navigation items in mobile */}
              {[...primaryNavItems, ...secondaryNavItems].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm ${
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-purple-400 hover:bg-gray-800"
              >
                <Send className="w-4 h-4" />
                <span>Send Notification</span>
              </Link>
              <Link
                to="/admin/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-purple-400 hover:bg-gray-800"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <div className="pt-3 mt-2 border-t border-gray-800">
                <div className="px-4 py-2">
                  <div className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-lg mb-3">
                    <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{getUserInitial()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{getUserName()}</p>
                      <p className="text-xs text-gray-400">{getUserEmail()}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
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