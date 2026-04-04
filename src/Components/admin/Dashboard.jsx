// src/Components/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Car, 
  AlertCircle, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  ArrowRight,
  Activity,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { adminAPI } from "../../Services/adminApi";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const api = adminAPI(token);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    pendingVehicles: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersRes = await api.getUsers();
      const users = usersRes.data?.data || usersRes.data || [];
      
      // Fetch vehicles
      const vehiclesRes = await api.getVehicles();
      const vehicles = vehiclesRes.data?.data || vehiclesRes.data || [];
      
      // Fetch bookings
      const bookingsRes = await api.getBookings();
      const bookings = bookingsRes.data?.data || bookingsRes.data || [];
      
      // Fetch payments
      const paymentsRes = await api.getPayments();
      const payments = paymentsRes.data?.data || paymentsRes.data || [];
      
      // Calculate stats
      const pendingVehicles = vehicles.filter(v => v.status === "pending").length;
      const pendingBookings = bookings.filter(b => b.status === "pending").length;
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      
      setStats({
        totalUsers: users.length,
        totalVehicles: vehicles.length,
        pendingVehicles: pendingVehicles,
        totalBookings: bookings.length,
        pendingBookings: pendingBookings,
        totalRevenue: totalRevenue
      });
      
      // Get recent bookings (last 5)
      setRecentBookings(bookings.slice(0, 5));
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: "Total Users", 
      value: stats.totalUsers, 
      icon: <Users className="w-8 h-8" />, 
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/20",
      path: "/admin/users"
    },
    { 
      title: "Total Vehicles", 
      value: stats.totalVehicles, 
      icon: <Car className="w-8 h-8" />, 
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      borderColor: "border-green-500/20",
      path: "/admin/vehicles"
    },
    { 
      title: "Pending Vehicles", 
      value: stats.pendingVehicles, 
      icon: <AlertCircle className="w-8 h-8" />, 
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-500",
      borderColor: "border-yellow-500/20",
      path: "/admin/pending-vehicles"
    },
    { 
      title: "Total Bookings", 
      value: stats.totalBookings, 
      icon: <Calendar className="w-8 h-8" />, 
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
      borderColor: "border-purple-500/20",
      path: "/admin/bookings"
    },
    { 
      title: "Pending Bookings", 
      value: stats.pendingBookings, 
      icon: <Clock className="w-8 h-8" />, 
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500",
      borderColor: "border-orange-500/20",
      path: "/admin/bookings"
    },
    { 
      title: "Total Revenue", 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: <DollarSign className="w-8 h-8" />, 
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500",
      borderColor: "border-emerald-500/20",
      path: "/admin/finance"
    }
  ];

  const quickActions = [
    { title: "Add New Vehicle", path: "/admin/add-vehicle", icon: <Car className="w-5 h-5" />, color: "bg-purple-500" },
    { title: "View All Users", path: "/admin/users", icon: <Users className="w-5 h-5" />, color: "bg-blue-500" },
    { title: "Review Pending", path: "/admin/pending-vehicles", icon: <AlertCircle className="w-5 h-5" />, color: "bg-yellow-500" },
    { title: "View Bookings", path: "/admin/bookings", icon: <Calendar className="w-5 h-5" />, color: "bg-green-500" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your platform today.</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="bg-purple-500/20 rounded-full px-4 py-2">
                <Activity className="w-5 h-5 text-purple-400 inline mr-2" />
                <span className="text-sm text-purple-400">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className={`${card.bgColor} border ${card.borderColor} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
                <div className={`${card.textColor} opacity-75 group-hover:opacity-100 transition`}>
                  {card.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm text-gray-500 group-hover:text-gray-300 transition">
                <span>View details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className={`${action.color} hover:opacity-90 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 font-semibold`}
              >
                {action.icon}
                {action.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Navigation Cards */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-purple-500" />
              Management Sections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Users", path: "/admin/users", icon: <Users className="w-4 h-4" />, color: "text-blue-400" },
                { title: "Vehicles", path: "/admin/vehicles", icon: <Car className="w-4 h-4" />, color: "text-green-400" },
                { title: "Pending Vehicles", path: "/admin/pending-vehicles", icon: <AlertCircle className="w-4 h-4" />, color: "text-yellow-400" },
                { title: "Bookings", path: "/admin/bookings", icon: <Calendar className="w-4 h-4" />, color: "text-purple-400" },
                { title: "Payments", path: "/admin/payments", icon: <CreditCard className="w-4 h-4" />, color: "text-emerald-400" },
                { title: "Finance", path: "/admin/finance", icon: <TrendingUp className="w-4 h-4" />, color: "text-pink-400" }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition group"
                >
                  <div className="flex items-center gap-2">
                    <span className={item.color}>{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Recent Bookings
            </h2>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent bookings
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking, index) => {
                  const statusColors = {
                    pending: "bg-yellow-500/20 text-yellow-500",
                    approved: "bg-green-500/20 text-green-500",
                    confirmed: "bg-green-500/20 text-green-500",
                    rejected: "bg-red-500/20 text-red-500",
                    completed: "bg-blue-500/20 text-blue-500"
                  };
                  const statusColor = statusColors[booking.status] || "bg-gray-500/20 text-gray-500";
                  
                  return (
                    <div
                      key={index}
                      onClick={() => navigate(`/admin/bookings`)}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-gray-400">
                            {booking._id?.slice(-8)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Vehicle: {booking.vehicle_id?.slice(-8)}</span>
                          <span>User: {booking.user_id?.slice(-8)}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                    </div>
                  );
                })}
              </div>
            )}
            {recentBookings.length > 0 && (
              <button
                onClick={() => navigate("/admin/bookings")}
                className="mt-4 text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition"
              >
                View all bookings
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">System Status</span>
              <span className="text-sm font-semibold text-green-500">Operational</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500">Total Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{stats.totalVehicles}</p>
                <p className="text-xs text-gray-500">Total Vehicles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{stats.totalBookings}</p>
                <p className="text-xs text-gray-500">Total Bookings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}