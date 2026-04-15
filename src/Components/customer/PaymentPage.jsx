// src/Components/customer/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://127.0.0.1:8000/customer/bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(response.data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.detail || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Create Razorpay order
      const orderRes = await axios.post(
        'http://127.0.0.1:8000/customer/create-razorpay-order',
        {
          booking_id: bookingId,
          amount: Math.round(booking.total_cost * 100) // Convert to paise
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { order_id, amount, currency, key_id } = orderRes.data;
      
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        const options = {
          key: key_id,
          amount: amount,
          currency: currency,
          name: "DriveNow",
          description: `Payment for Booking #${bookingId.slice(-8)}`,
          image: "/logo.png",
          order_id: order_id,
          prefill: {
            name: booking.customer_name || '',
            email: booking.customer_email || '',
            contact: booking.customer_phone || ''
          },
          notes: {
            booking_id: bookingId,
            vehicle: `${booking.brand} ${booking.model}`
          },
          theme: {
            color: "#3B82F6"
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
              setError("Payment cancelled by user");
            }
          },
          handler: async (response) => {
            try {
              // Verify payment
              const verifyRes = await axios.post(
                'http://127.0.0.1:8000/customer/verify-razorpay-payment',
                {
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  booking_id: bookingId
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              
              if (verifyRes.data.success) {
                navigate(`/customer/payment-success/${bookingId}`);
              } else {
                setError(verifyRes.data.message);
              }
            } catch (error) {
              console.error('Payment verification failed:', error);
              setError(error.response?.data?.detail || 'Payment verification failed');
            } finally {
              setProcessing(false);
            }
          }
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      
      script.onerror = () => {
        setError('Failed to load Razorpay SDK');
        setProcessing(false);
      };
      
      document.body.appendChild(script);
      
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.response?.data?.detail || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => navigate(`/customer/bookings/${bookingId}`)}
            className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/customer/bookings/${bookingId}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          Back to Booking
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Payment Options */}
          <div className="md:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Secure Payment</h2>
                  <p className="text-gray-400 text-sm">Pay with Razorpay</p>
                </div>
              </div>

              {/* Security Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <Lock className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-300">100% Secure Payments</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-300">Instant Booking Confirmation</span>
                </div>
              </div>

              {/* Razorpay Option */}
              <div className="border border-gray-700 rounded-xl p-4 mb-4 hover:border-blue-500 transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Razorpay</h3>
                      <p className="text-sm text-gray-400">Credit/Debit Card, UPI, NetBanking, Wallet</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRazorpayPayment}
                    disabled={processing}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 pb-4 border-b border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Booking ID</span>
                  <span className="font-mono">{bookingId.slice(-8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Vehicle</span>
                  <span>{booking?.brand} {booking?.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span>{booking?.days} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Daily Rate</span>
                  <span>₹{booking?.price_per_day?.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-blue-500">₹{booking?.total_cost?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}