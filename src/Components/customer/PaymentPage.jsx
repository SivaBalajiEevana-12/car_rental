// src/Components/customer/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { bookingApi, paymentApi } from '../../Services/customerApi';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardDetails, setCardDetails] = useState({
    card_number: '',
    expiry_date: '',
    cvv: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const data = await bookingApi.getBookingDetails(bookingId);
      setBooking(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await paymentApi.processPayment({
        booking_id: bookingId,
        payment_method: paymentMethod,
        amount: booking.total_cost,
        card_number: cardDetails.card_number,
        expiry_date: cardDetails.expiry_date,
        cvv: cardDetails.cvv
      });
      navigate(`/customer/payment/success/${bookingId}`);
    } catch (error) {
      setError(error.response?.data?.detail || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Complete Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              
              {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`p-3 rounded-lg border-2 transition ${
                        paymentMethod === 'credit_card'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-sm">Credit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('debit_card')}
                      className={`p-3 rounded-lg border-2 transition ${
                        paymentMethod === 'debit_card'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-sm">Debit Card</span>
                    </button>
                  </div>
                </div>

                {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        name="card_number"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.card_number}
                        onChange={handleCardChange}
                        className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="expiry_date"
                          placeholder="MM/YY"
                          value={cardDetails.expiry_date}
                          onChange={handleCardChange}
                          className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={handleCardChange}
                          className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay ₹{booking?.total_cost?.toLocaleString()}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-900 rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking ID</span>
                  <span className="font-mono text-sm">{booking?._id?.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rental Period</span>
                  <span>
                    {new Date(booking?.start_date).toLocaleDateString()} - {new Date(booking?.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Days</span>
                  <span>{booking?.days} days</span>
                </div>
                <div className="border-t border-gray-800 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-500">₹{booking?.total_cost?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}