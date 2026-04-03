// src/components/car-owner/BookingCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, DollarSign, Clock, MapPin, ChevronRight } from 'lucide-react';

export default function BookingCard({ booking, onStatusUpdate }) {
  const getStatusBadge = (status) => {
    const badges = {
      pending: { 
        color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
        icon: <Clock className="w-4 h-4" />,
        label: 'Pending'
      },
      approved: { 
        color: 'bg-green-500/20 text-green-500 border-green-500',
        icon: <Clock className="w-4 h-4" />,
        label: 'Approved'
      },
      rejected: { 
        color: 'bg-red-500/20 text-red-500 border-red-500',
        icon: <Clock className="w-4 h-4" />,
        label: 'Rejected'
      },
      completed: { 
        color: 'bg-blue-500/20 text-blue-500 border-blue-500',
        icon: <Clock className="w-4 h-4" />,
        label: 'Completed'
      },
      cancelled: { 
        color: 'bg-gray-500/20 text-gray-500 border-gray-500',
        icon: <Clock className="w-4 h-4" />,
        label: 'Cancelled'
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

  const badge = getStatusBadge(booking.status);
  const duration = getDuration(booking.start_date, booking.end_date);

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition duration-300 shadow-lg">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Booking ID</p>
            <p className="font-mono text-sm font-semibold">
              {booking._id.slice(-12).toUpperCase()}
            </p>
          </div>
          <div className={`${badge.color} border px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
            {badge.icon}
            {badge.label}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Vehicle Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-1">
            {booking.vehicle_details?.brand} {booking.vehicle_details?.model}
          </h3>
          <p className="text-gray-400 text-sm">
            {booking.vehicle_details?.year} • {booking.vehicle_details?.vehicle_type}
          </p>
        </div>

        {/* Booking Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">
              {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              ({duration} {duration === 1 ? 'day' : 'days'})
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <User className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">
              Customer: {booking.user_details?.name || booking.user_id?.slice(-8)}
            </span>
          </div>

          {(booking.pickup_location || booking.dropoff_location) && (
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">
                {booking.pickup_location && `Pickup: ${booking.pickup_location}`}
                {booking.pickup_location && booking.dropoff_location && ' • '}
                {booking.dropoff_location && `Dropoff: ${booking.dropoff_location}`}
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="border-t border-gray-800 pt-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Amount</span>
            <span className="text-2xl font-bold text-yellow-500">
              ₹{booking.total_price?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              ₹{booking.price_per_day?.toLocaleString()} per day × {duration} days
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to={`/car-owner/bookings/${booking._id}`}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </Link>
          
          {booking.status === 'pending' && onStatusUpdate && (
            <div className="flex gap-2">
              <button
                onClick={() => onStatusUpdate(booking._id, 'approved')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
              >
                Accept
              </button>
              <button
                onClick={() => onStatusUpdate(booking._id, 'rejected')}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}