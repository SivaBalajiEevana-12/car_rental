// src/Components/customer/MyBookings.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Car, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { bookingApi } from '../../Services/customerApi';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const status = filter === 'all' ? null : filter;
      const data = await bookingApi.getMyBookings(status);
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', icon: <Clock className="w-4 h-4" />, label: 'Pending' },
      paid: { bg: 'bg-green-500/20', text: 'text-green-500', icon: <CheckCircle className="w-4 h-4" />, label: 'Confirmed' },
      confirmed: { bg: 'bg-green-500/20', text: 'text-green-500', icon: <CheckCircle className="w-4 h-4" />, label: 'Confirmed' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-500', icon: <XCircle className="w-4 h-4" />, label: 'Cancelled' },
      completed: { bg: 'bg-blue-500/20', text: 'text-blue-500', icon: <CheckCircle className="w-4 h-4" />, label: 'Completed' }
    };
    return badges[status] || badges.pending;
  };

  const getStatusCounts = () => {
    const counts = {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed' || b.status === 'paid').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'pending' ? 'bg-yellow-500 text-black' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Pending ({statusCounts.pending})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'confirmed' ? 'bg-green-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Confirmed ({statusCounts.confirmed})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Completed ({statusCounts.completed})
          </button>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-gray-400 mb-4">You haven't made any bookings yet</p>
            <Link
              to="/customer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-block"
            >
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status);
              const days = Math.ceil(
                (new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div key={booking._id} className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition">
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">
                        Booking #{booking._id.slice(-8)}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Vehicle ID: {booking.vehicle_id?.slice(-8)}
                      </p>
                    </div>
                    <div className={`${statusBadge.bg} ${statusBadge.text} px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
                      {statusBadge.icon}
                      {statusBadge.label}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-blue-500">₹{booking.total_cost?.toLocaleString()}</span>
                      <span className="text-sm">({days} days)</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/customer/bookings/${booking._id}`}
                    className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}