// src/pages/car-owner/BookingDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Car, 
  DollarSign, 
  Clock, 
  MapPin,
  FileText,
  CreditCard,
  CheckCircle,
  XCircle,
  Printer
} from 'lucide-react';
import { bookingApi } from '../../Services/carOwnerApi';

export default function BookingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const fetchBookingDetail = async () => {
    setLoading(true);
    try {
      const data = await bookingApi.getBookingDetail(id);
      setBooking(data);
      console.log('Booking detail:', data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError(error.response?.data?.detail || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-500',
      approved: 'bg-green-500',
      confirmed: 'bg-green-500',
      rejected: 'bg-red-500',
      completed: 'bg-blue-500',
      cancelled: 'bg-gray-500'
    };
    return badges[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-6 rounded-lg">
          <p>{error || 'Booking not found'}</p>
          <button 
            onClick={() => navigate('/car-owner/bookings')}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const duration = Math.ceil(
    (new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/car-owner/bookings')}
              className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-800 rounded-lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Booking Details</h1>
              <p className="text-gray-400 mt-1 font-mono text-sm">
                Booking ID: {booking._id}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="ml-auto bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Status Banner */}
        <div className={`${getStatusBadge(booking.status)} rounded-xl p-4 mb-6 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {booking.status === 'pending' && <Clock className="w-6 h-6" />}
              {booking.status === 'approved' && <CheckCircle className="w-6 h-6" />}
              {booking.status === 'rejected' && <XCircle className="w-6 h-6" />}
              <span className="font-semibold text-lg uppercase">
                {booking.status}
              </span>
            </div>
            <p className="text-sm opacity-90">
              Booked on {new Date(booking.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rental Period */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-500" />
                Rental Period
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Start Date</p>
                  <p className="font-semibold text-lg">
                    {new Date(booking.start_date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">End Date</p>
                  <p className="font-semibold text-lg">
                    {new Date(booking.end_date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-gray-400">Duration</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {duration} {duration === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-yellow-500" />
                Vehicle Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Vehicle ID</span>
                  <span className="font-mono">{booking.vehicle_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Make/Model</span>
                  <span className="font-semibold">{booking.brand} {booking.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price per day</span>
                  <span className="font-semibold">₹{booking.price_per_day?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Location Details */}
            {(booking.pickup_location || booking.dropoff_location) && (
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-yellow-500" />
                  Location Details
                </h2>
                <div className="space-y-3">
                  {booking.pickup_location && (
                    <div>
                      <p className="text-gray-400 text-sm">Pickup Location</p>
                      <p className="font-semibold">{booking.pickup_location}</p>
                    </div>
                  )}
                  {booking.dropoff_location && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-sm">Dropoff Location</p>
                      <p className="font-semibold">{booking.dropoff_location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-yellow-500" />
                Customer
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Customer ID</p>
                  <p className="font-mono text-sm">{booking.user_id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="font-semibold">{booking.user_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="font-semibold">{booking.user_email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="font-semibold">{booking.user_phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-yellow-500/20">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-yellow-500" />
                Payment Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Rate</span>
                  <span>₹{booking.price_per_day?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span>{duration} days</span>
                </div>
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-yellow-500">₹{booking.total_price?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {booking.status === 'pending' && (
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => {/* Handle approve */}}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Approve Booking
                  </button>
                  <button
                    onClick={() => {/* Handle reject */}}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Reject Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}