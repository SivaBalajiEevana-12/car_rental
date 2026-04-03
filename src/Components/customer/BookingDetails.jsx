// src/Components/customer/BookingDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Car, DollarSign, Clock, MapPin, 
  AlertCircle, CheckCircle, XCircle, CreditCard, 
  FileText, Printer, Download
} from 'lucide-react';
import { bookingApi, paymentApi } from '../../Services/customerApi';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const data = await bookingApi.getBookingDetails(id);
      setBooking(data);
      
      // Fetch payment details if exists
      if (data.status === 'paid' || data.status === 'confirmed') {
        const payments = await paymentApi.getMyPayments();
        const bookingPayment = payments.payments?.find(p => p.booking_id === id);
        if (bookingPayment) {
          setPayment(bookingPayment);
        }
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      await bookingApi.cancelBooking(id);
      await fetchBookingDetails();
      setShowCancelModal(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(error.response?.data?.detail || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', border: 'border-yellow-500', icon: <Clock className="w-5 h-5" />, label: 'Pending Payment' },
      paid: { bg: 'bg-green-500/20', text: 'text-green-500', border: 'border-green-500', icon: <CheckCircle className="w-5 h-5" />, label: 'Confirmed' },
      confirmed: { bg: 'bg-green-500/20', text: 'text-green-500', border: 'border-green-500', icon: <CheckCircle className="w-5 h-5" />, label: 'Confirmed' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500', icon: <XCircle className="w-5 h-5" />, label: 'Cancelled' },
      completed: { bg: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500', icon: <CheckCircle className="w-5 h-5" />, label: 'Completed' }
    };
    return badges[status] || badges.pending;
  };

  const getDuration = () => {
    if (!booking) return 0;
    const start = new Date(booking.start_date);
    const end = new Date(booking.end_date);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    if (!payment) return;
    
    const receiptData = {
      booking_id: booking._id,
      transaction_id: payment.transaction_id,
      amount: payment.amount,
      date: payment.created_at,
      status: payment.status,
      vehicle: `${booking.brand} ${booking.model}`,
      dates: `${booking.start_date} to ${booking.end_date}`
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `receipt_${booking._id}.json`);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-gray-400 mb-4">The booking you're looking for doesn't exist</p>
          <Link to="/customer/bookings" className="bg-blue-500 text-white px-6 py-2 rounded-lg">
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(booking.status);
  const duration = getDuration();
  const canCancel = booking.status === 'pending' || booking.status === 'paid';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Bookings
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition"
            >
              <Printer className="w-5 h-5" />
            </button>
            {payment && (
              <button
                onClick={handleDownloadReceipt}
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Banner */}
        <div className={`${statusBadge.bg} border ${statusBadge.border} rounded-xl p-4 mb-6`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {statusBadge.icon}
              <span className={`font-semibold text-lg ${statusBadge.text}`}>
                Booking {statusBadge.label}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Booked on {new Date(booking.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Details */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-500" />
                Vehicle Details
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={booking.images?.[0] || 'https://via.placeholder.com/128x128?text=Car'} 
                    alt={booking.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{booking.brand} {booking.model}</h3>
                  <p className="text-gray-400">{booking.year} • {booking.vehicle_type} • {booking.fuel_type}</p>
                  <p className="text-gray-400 mt-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {booking.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Rental Period */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
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
                <p className="text-2xl font-bold text-blue-500">
                  {duration} {duration === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>

            {/* Location Details */}
            {(booking.pickup_location || booking.dropoff_location) && (
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-blue-500/20">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                Price Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Rate</span>
                  <span>₹{booking.price_per_day?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Number of Days</span>
                  <span>{duration} days</span>
                </div>
                <div className="border-t border-gray-800 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-blue-500">₹{booking.total_cost?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {payment && (
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  Payment Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction ID</span>
                    <span className="font-mono text-sm">{payment.transaction_id?.slice(-12)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Method</span>
                    <span className="capitalize">{payment.payment_method?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Date</span>
                    <span>{new Date(payment.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-500">Completed</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Cancel Booking
              </button>
            )}

            {booking.status === 'pending' && (
              <Link
                to={`/customer/payment/${booking._id}`}
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg font-semibold transition"
              >
                Complete Payment
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Cancel Booking</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to cancel this booking? 
              {booking.status === 'paid' && ' You will receive a full refund.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}