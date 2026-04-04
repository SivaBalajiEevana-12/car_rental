// src/Components/admin/PaymentsPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  CreditCard, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Eye,
  Flag,
  Search,
  Calendar,
  User,
  RefreshCw,
  Download,
  FileText
} from "lucide-react";
import { adminAPI } from "../../Services/adminApi";

export default function PaymentsPage() {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const api = adminAPI(token);

  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [flaggedFilter, setFlaggedFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch payments
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.getPayments();
      const paymentsData = res.data?.data || res.data || [];
      setPayments(paymentsData);
      setFilteredPayments(paymentsData);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, flaggedFilter, payments]);

  const applyFilters = () => {
    let filtered = [...payments];
    
    // Search filter
    if (search) {
      filtered = filtered.filter(p => 
        p.user_id?.toLowerCase().includes(search.toLowerCase()) ||
        p._id?.toLowerCase().includes(search.toLowerCase()) ||
        p.booking_id?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    // Flagged filter
    if (flaggedFilter === "flagged") {
      filtered = filtered.filter(p => p.flagged === true);
    } else if (flaggedFilter === "not_flagged") {
      filtered = filtered.filter(p => p.flagged !== true);
    }
    
    setFilteredPayments(filtered);
  };

  // Flag transaction
  const flagPayment = async (id, currentFlagged) => {
    setActionLoading(true);
    try {
      await api.flagPayment(id, {
        flagged: !currentFlagged,
        reason: flagReason || "Suspicious activity"
      });
      fetchPayments();
      setShowFlagModal(false);
      setFlagReason("");
      setSelectedPayment(null);
    } catch (error) {
      console.error("Error flagging payment:", error);
      alert(error.response?.data?.detail || "Failed to flag transaction");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { bg: "bg-green-500/20", text: "text-green-500", border: "border-green-500", icon: <CheckCircle className="w-3 h-3" /> },
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-500", border: "border-yellow-500", icon: <AlertCircle className="w-3 h-3" /> },
      failed: { bg: "bg-red-500/20", text: "text-red-500", border: "border-red-500", icon: <XCircle className="w-3 h-3" /> },
      refunded: { bg: "bg-blue-500/20", text: "text-blue-500", border: "border-blue-500", icon: <CheckCircle className="w-3 h-3" /> }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`${badge.bg} ${badge.text} border ${badge.border} px-2 py-0.5 rounded-full text-xs flex items-center gap-1 w-fit`}>
        {badge.icon}
        {status}
      </span>
    );
  };

  const getTotalAmount = () => {
    return filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  const getCompletedAmount = () => {
    return filteredPayments.filter(p => p.status === "completed").reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  const getFlaggedCount = () => {
    return filteredPayments.filter(p => p.flagged === true).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading payments...</div>
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
              <h1 className="text-3xl font-bold">Payments & Transactions</h1>
              <p className="text-gray-400 mt-1">Monitor and manage all financial transactions</p>
            </div>
            <button
              onClick={fetchPayments}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Total Transactions</p>
            <p className="text-2xl font-bold">{filteredPayments.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Total Amount</p>
            <p className="text-2xl font-bold">₹{getTotalAmount().toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Completed Amount</p>
            <p className="text-2xl font-bold">₹{getCompletedAmount().toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Flagged Transactions</p>
            <p className="text-2xl font-bold">{getFlaggedCount()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by User ID, Payment ID, or Booking ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            
            <select
              value={flaggedFilter}
              onChange={(e) => setFlaggedFilter(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Transactions</option>
              <option value="flagged">Flagged Only</option>
              <option value="not_flagged">Not Flagged</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        {filteredPayments.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl">
            <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No payments found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Transaction ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">User ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Booking ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Payment Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Flagged</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-800 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">
                          {payment._id?.slice(-12)}
                        </span>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-sm">
                            {payment.user_id?.slice(-8) || payment.customer_id?.slice(-8)}
                          </span>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">
                          {payment.booking_id?.slice(-8)}
                        </span>
                       </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-purple-500 text-lg">
                          ₹{payment.amount?.toLocaleString()}
                        </span>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-gray-400" />
                          <span className="text-sm capitalize">
                            {payment.payment_method?.replace("_", " ") || "N/A"}
                          </span>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.status)}
                       </td>
                      <td className="px-6 py-4">
                        {payment.flagged ? (
                          <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                            <Flag className="w-3 h-3" />
                            Flagged
                          </span>
                        ) : (
                          <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3 h-3" />
                            Clean
                          </span>
                        )}
                       </td>
                      <td className="px-6 py-4 text-gray-400">
                        {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : "N/A"}
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowDetailsModal(true);
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setFlagReason(payment.flag_reason || "");
                              setShowFlagModal(true);
                            }}
                            className={`${payment.flagged ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white p-2 rounded-lg transition`}
                            title={payment.flagged ? "Unflag" : "Flag"}
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-800 border-t border-gray-700">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-semibold">
                      Total:
                     </td>
                    <td className="px-6 py-4 font-bold text-xl text-purple-500">
                      ₹{getTotalAmount().toLocaleString()}
                     </td>
                    <td colSpan="5"></td>
                   </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Payment Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Transaction ID</p>
                  <p className="font-mono">{selectedPayment._id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Booking ID</p>
                  <p className="font-mono">{selectedPayment.booking_id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">User ID</p>
                  <p className="font-mono">{selectedPayment.user_id || selectedPayment.customer_id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Payment Method</p>
                  <p className="capitalize">{selectedPayment.payment_method?.replace("_", " ") || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Amount</p>
                  <p className="text-2xl font-bold text-purple-500">₹{selectedPayment.amount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  {getStatusBadge(selectedPayment.status)}
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p>{new Date(selectedPayment.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Flagged</p>
                  <p>{selectedPayment.flagged ? "Yes" : "No"}</p>
                </div>
                {selectedPayment.flag_reason && (
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm">Flag Reason</p>
                    <p className="text-red-400">{selectedPayment.flag_reason}</p>
                  </div>
                )}
                {selectedPayment.transaction_id && (
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm">Gateway Transaction ID</p>
                    <p className="font-mono text-sm">{selectedPayment.transaction_id}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPayment(selectedPayment);
                  setFlagReason(selectedPayment.flag_reason || "");
                  setShowFlagModal(true);
                }}
                className={`flex-1 ${selectedPayment.flagged ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white py-2 rounded-lg transition`}
              >
                {selectedPayment.flagged ? "Unflag Transaction" : "Flag Transaction"}
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag/Unflag Modal */}
      {showFlagModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Flag className={`w-8 h-8 ${selectedPayment.flagged ? "text-green-500" : "text-red-500"}`} />
              <h3 className="text-xl font-bold">
                {selectedPayment.flagged ? "Unflag Transaction" : "Flag Transaction"}
              </h3>
            </div>
            
            <p className="text-gray-400 mb-4">
              Transaction ID: <span className="text-white font-mono">{selectedPayment._id?.slice(-12)}</span>
            </p>
            
            <p className="text-gray-400 mb-4">
              Amount: <span className="text-purple-500 font-bold">₹{selectedPayment.amount?.toLocaleString()}</span>
            </p>
            
            {!selectedPayment.flagged && (
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Reason for flagging</label>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="Enter reason for flagging this transaction..."
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none resize-none"
                  rows="3"
                />
              </div>
            )}
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason("");
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => flagPayment(selectedPayment._id, selectedPayment.flagged)}
                disabled={actionLoading}
                className={`px-4 py-2 ${selectedPayment.flagged ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} rounded-lg transition disabled:opacity-50`}
              >
                {actionLoading ? "Processing..." : (selectedPayment.flagged ? "Unflag" : "Flag")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}