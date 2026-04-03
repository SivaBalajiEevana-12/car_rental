// src/pages/car-owner/VehicleBookings.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  Filter, 
  Calendar, 
  User, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  ChevronDown,
  Search
} from 'lucide-react';
import { bookingApi } from '../../Services/carOwnerApi';

export default function VehicleBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filter, sortBy, order]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = filter === 'all' ? null : filter;
      const data = await bookingApi.getOwnerBookings(status, sortBy, order);
      console.log('Fetched bookings:', data);
      
      // Ensure data is an array
      const bookingsArray = Array.isArray(data) ? data : [];
      setBookings(bookingsArray);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.detail || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      // Call your API to update booking status
      // await bookingApi.updateBookingStatus(bookingId, newStatus);
      await fetchBookings(); // Refresh after update
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { 
        bg: 'bg-yellow-500/20', 
        text: 'text-yellow-500', 
        border: 'border-yellow-500',
        icon: <Clock className="w-4 h-4" />,
        label: 'Pending'
      },
      approved: { 
        bg: 'bg-green-500/20', 
        text: 'text-green-500', 
        border: 'border-green-500',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Approved'
      },
      confirmed: { 
        bg: 'bg-green-500/20', 
        text: 'text-green-500', 
        border: 'border-green-500',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Confirmed'
      },
      rejected: { 
        bg: 'bg-red-500/20', 
        text: 'text-red-500', 
        border: 'border-red-500',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Rejected'
      },
      cancelled: { 
        bg: 'bg-gray-500/20', 
        text: 'text-gray-500', 
        border: 'border-gray-500',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Cancelled'
      },
      completed: { 
        bg: 'bg-blue-500/20', 
        text: 'text-blue-500', 
        border: 'border-blue-500',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Completed'
      }
    };
    return badges[status] || badges.pending;
  };

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true;
    return (
      booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusCounts = () => {
    const counts = {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      approved: bookings.filter(b => b.status === 'approved' || b.status === 'confirmed').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-6 rounded-lg max-w-md text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Bookings</h3>
          <p>{error}</p>
          <button 
            onClick={fetchBookings}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Vehicle Bookings</h1>
          <p className="text-gray-400 mt-1">Manage all booking requests for your vehicles</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Status Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-lg transition font-semibold ${
              filter === 'all' 
                ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            All
            <span className="ml-2 px-2 py-0.5 rounded-full bg-black/20 text-sm">
              {statusCounts.all}
            </span>
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-5 py-2 rounded-lg transition font-semibold flex items-center gap-2 ${
              filter === 'pending' 
                ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending
            {statusCounts.pending > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-black/20 text-sm">
                {statusCounts.pending}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-5 py-2 rounded-lg transition font-semibold flex items-center gap-2 ${
              filter === 'approved' 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Approved
            {statusCounts.approved > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-black/20 text-sm">
                {statusCounts.approved}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-5 py-2 rounded-lg transition font-semibold flex items-center gap-2 ${
              filter === 'completed' 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Completed
            {statusCounts.completed > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-black/20 text-sm">
                {statusCounts.completed}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-5 py-2 rounded-lg transition font-semibold flex items-center gap-2 ${
              filter === 'rejected' 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            <XCircle className="w-4 h-4" />
            Rejected
            {statusCounts.rejected > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-black/20 text-sm">
                {statusCounts.rejected}
              </span>
            )}
          </button>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Booking ID, Vehicle ID, or Customer ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
            >
              <option value="created_at">Created Date</option>
              <option value="start_date">Start Date</option>
              <option value="end_date">End Date</option>
              <option value="total_price">Total Price</option>
            </select>
            
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-gray-400">
              {bookings.length === 0 
                ? "When customers book your vehicles, they'll appear here" 
                : "No bookings match your search criteria"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status);
              const duration = getDuration(booking.start_date, booking.end_date);
              
              return (
                <div
                  key={booking._id}
                  className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-yellow-500/5 transition-all duration-300 border border-gray-800 hover:border-yellow-500/30"
                >
                  {/* Booking Header */}
                  <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-800">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Booking ID</p>
                        <p className="font-mono text-sm font-semibold">
                          {booking._id}
                        </p>
                      </div>
                      <div className={`${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border} px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </div>
                    </div>
                  </div>

                  {/* Booking Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Vehicle Info */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <span>🚗</span> Vehicle
                        </p>
                        <p className="font-semibold text-lg">
                          {booking.brand || 'Unknown'} {booking.model || ''}
                        </p>
                        <p className="text-sm text-gray-400">
                          ID: {booking.vehicle_id?.slice(-8)}
                        </p>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Customer
                        </p>
                        <p className="font-semibold">
                          {booking.user_name || 'Customer'}
                        </p>
                        <p className="text-sm text-gray-400 font-mono">
                          ID: {booking.user_id?.slice(-8)}
                        </p>
                      </div>

                      {/* Date Info */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Rental Period
                        </p>
                        <p className="font-semibold text-sm">
                          {new Date(booking.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-sm text-gray-400">
                          to {new Date(booking.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {duration} {duration === 1 ? 'day' : 'days'}
                        </p>
                      </div>

                      {/* Price Info */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Total Amount
                        </p>
                        <p className="text-2xl font-bold text-yellow-500">
                          ₹{booking.total_price?.toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-gray-400">
                          ₹{booking.price_per_day?.toLocaleString()}/day
                        </p>
                      </div>
                    </div>

                    {/* Pickup/Dropoff Locations */}
                    {(booking.pickup_location || booking.dropoff_location) && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="flex flex-wrap gap-4 text-sm">
                          {booking.pickup_location && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">📍 Pickup:</span>
                              <span>{booking.pickup_location}</span>
                            </div>
                          )}
                          {booking.dropoff_location && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">🏁 Dropoff:</span>
                              <span>{booking.dropoff_location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        to={`/car-owner/bookings/${booking._id}`}
                        className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                      
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'approved')}
                            className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                            className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}