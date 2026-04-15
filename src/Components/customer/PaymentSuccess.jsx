// src/Components/customer/PaymentSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Car, Calendar, DollarSign, Download, Printer, Home, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function PaymentSuccess() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [bookingId]);

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch booking details
      const bookingRes = await axios.get(
        `http://127.0.0.1:8000/customer/bookings/${bookingId}`,
        { headers }
      );
      setBooking(bookingRes.data);
      
      // Fetch payment details
      const paymentsRes = await axios.get(
        `http://127.0.0.1:8000/customer/payments`,
        { headers }
      );
      const bookingPayment = paymentsRes.data.payments?.find(p => p.booking_id === bookingId);
      setPayment(bookingPayment);
      
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!payment) return;
    
    const receipt = {
      receipt_id: payment._id,
      booking_id: bookingId,
      amount: payment.amount,
      date: payment.created_at,
      status: payment.status,
      payment_method: payment.payment_method || 'Razorpay',
      vehicle: `${booking?.brand} ${booking?.model}`,
      dates: `${booking?.start_date} to ${booking?.end_date}`
    };
    
    const dataStr = JSON.stringify(receipt, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `receipt_${bookingId}.json`);
    linkElement.click();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Payment Successful!</h1>
          <p className="text-gray-400 mt-2">Your booking has been confirmed</p>
        </div>

        {/* Booking Confirmation Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 mb-6">
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-800">
            <div>
              <h2 className="text-xl font-semibold">Booking Confirmed</h2>
              <p className="text-gray-400 text-sm">Booking ID: {bookingId.slice(-8)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="p-2 bg-white-800 rounded-lg hover:bg-gray-700 transition"
                title="Print"
              >
                <Printer className="w-4 h-4 bg-white" />
              </button>
              <button
                onClick={handleDownloadReceipt}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                title="Download Receipt"
              >
                <Download className="w-4 h-4 bg-white" />
              </button>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Vehicle</p>
                <p className="font-semibold">{booking?.brand} {booking?.model}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Rental Period</p>
                <p className="font-semibold">
                  {new Date(booking?.start_date).toLocaleDateString()} - {new Date(booking?.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Amount Paid</p>
                <p className="text-2xl font-bold text-green-500">₹{booking?.total_cost?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 mb-6">
          <h3 className="font-semibold mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              You will receive a confirmation email shortly
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Present your booking ID at pickup
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Need to modify or cancel? Visit My Bookings
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            View My Bookings
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/customer')}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Browse More Cars
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}