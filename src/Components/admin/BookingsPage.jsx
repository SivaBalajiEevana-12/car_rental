// src/Components/admin/BookingsPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Car, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { adminAPI } from "../../Services/adminApi";

export default function BookingsPage() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const api = adminAPI(token);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionType, setActionType] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getBookings();
      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings(res.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.bookingAction(id, { status });
      setShowActionModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const openActionModal = (booking, action) => {
    setSelectedBooking(booking);
    setActionType(action);
    setShowActionModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-500", border: "border-yellow-500", icon: <Clock className="w-4 h-4" />, label: "Pending" },
      approved: { bg: "bg-green-500/20", text: "text-green-500", border: "border-green-500", icon: <CheckCircle className="w-4 h-4" />, label: "Approved" },
      confirmed: { bg: "bg-green-500/20", text: "text-green-500", border: "border-green-500", icon: <CheckCircle className="w-4 h-4" />, label: "Confirmed" },
      rejected: { bg: "bg-red-500/20", text: "text-red-500", border: "border-red-500", icon: <XCircle className="w-4 h-4" />, label: "Rejected" },
      cancelled: { bg: "bg-gray-500/20", text: "text-gray-500", border: "border-gray-500", icon: <XCircle className="w-4 h-4" />, label: "Cancelled" },
      completed: { bg: "bg-blue-500/20", text: "text-blue-500", border: "border-blue-500", icon: <CheckCircle className="w-4 h-4" />, label: "Completed" }
    };
    return badges[status] || badges.pending;
  };

  const getStatusCounts = () => {
    const counts = {
      all: bookings.length,
      pending: bookings.filter(b => b.status === "pending").length,
      approved: bookings.filter(b => b.status === "approved" || b.status === "confirmed").length,
      rejected: bookings.filter(b => b.status === "rejected").length,
      completed: bookings.filter(b => b.status === "completed").length
    };
    return counts;
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter !== "all" && booking.status !== filter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        booking._id?.toLowerCase().includes(search) ||
        booking.user_id?.toLowerCase().includes(search) ||
        booking.vehicle_id?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Bookings Management</h1>
              <p className="text-gray-400 mt-1">View and manage all customer bookings</p>
            </div>
            <button
              onClick={fetchBookings}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "all" 
                ? "bg-purple-500 text-white" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              filter === "pending" 
                ? "bg-yellow-500 text-black" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending ({statusCounts.pending})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              filter === "approved" 
                ? "bg-green-500 text-white" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Approved ({statusCounts.approved})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              filter === "rejected" 
                ? "bg-red-500 text-white" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <XCircle className="w-4 h-4" />
            Rejected ({statusCounts.rejected})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              filter === "completed" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Completed ({statusCounts.completed})
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Booking ID, User ID, or Vehicle ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Bookings Table */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-gray-400">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filters" 
                : "No bookings have been made yet"}
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Booking ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Vehicle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Dates</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredBookings.map((booking) => {
                    const statusBadge = getStatusBadge(booking.status);
                    const days = Math.ceil(
                      (new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <tr key={booking._id} className="hover:bg-gray-800 transition">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm">
                            {booking._id.slice(-12)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-sm">
                              {booking.user_id?.slice(-8)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-sm">
                              {booking.vehicle_id?.slice(-8)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div>{new Date(booking.start_date).toLocaleDateString()}</div>
                            <div className="text-gray-500 text-xs">to</div>
                            <div>{new Date(booking.end_date).toLocaleDateString()}</div>
                            <div className="text-gray-500 text-xs mt-1">{days} days</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-purple-500">
                            ₹{booking.total_cost?.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border} px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit`}>
                            {statusBadge.icon}
                            {statusBadge.label}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/bookings/${booking._id}`)}
                              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {booking.status === "pending" && (
                              <>
                                <button
                                  onClick={() => openActionModal(booking, "approve")}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition text-sm flex items-center gap-1"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => openActionModal(booking, "reject")}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition text-sm flex items-center gap-1"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Action Confirmation Modal */}
      {showActionModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              {actionType === "approve" ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
              <h3 className="text-xl font-bold">
                {actionType === "approve" ? "Approve Booking" : "Reject Booking"}
              </h3>
            </div>
            
            <p className="text-gray-400 mb-6">
              Are you sure you want to {actionType} booking #{selectedBooking._id.slice(-12)}?
              {actionType === "approve" 
                ? " This will confirm the booking and notify the customer."
                : " This action cannot be undone."}
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(selectedBooking._id, actionType === "approve" ? "approved" : "rejected")}
                className={`px-4 py-2 rounded-lg transition ${
                  actionType === "approve" 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-red-500 hover:bg-red-600"
                } text-white`}
              >
                Yes, {actionType} Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}