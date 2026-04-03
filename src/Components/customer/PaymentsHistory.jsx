// src/Components/customer/PaymentsHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, DollarSign, Calendar, Download, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { paymentApi } from '../../Services/customerApi';

export default function PaymentsHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await paymentApi.getMyPayments();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewReceipt = async (paymentId) => {
    try {
      const receipt = await paymentApi.getPaymentReceipt(paymentId);
      setSelectedPayment(receipt);
      setShowReceiptModal(true);
    } catch (error) {
      console.error('Error fetching receipt:', error);
    }
  };

  const downloadReceipt = (payment) => {
    const receiptData = {
      receipt_id: payment._id,
      transaction_id: payment.transaction_id,
      amount: payment.amount,
      date: payment.created_at,
      status: payment.status,
      payment_method: payment.payment_method,
      booking_id: payment.booking_id
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `receipt_${payment._id}.json`);
    linkElement.click();
  };

  const getTotalSpent = () => {
    return payments.reduce((sum, p) => sum + (p.amount || 0), 0);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payment History</h1>
          <p className="text-gray-400 mt-1">View all your transactions and receipts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90">Total Spent</p>
                <p className="text-3xl font-bold mt-2">₹{getTotalSpent().toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-white opacity-50" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90">Total Transactions</p>
                <p className="text-3xl font-bold mt-2">{payments.length}</p>
              </div>
              <CreditCard className="w-10 h-10 text-white opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90">Average Payment</p>
                <p className="text-3xl font-bold mt-2">
                  ₹{(getTotalSpent() / (payments.length || 1)).toLocaleString()}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-white opacity-50" />
            </div>
          </div>
        </div>

        {/* Payments Table */}
        {payments.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl">
            <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No payment history</h3>
            <p className="text-gray-400 mb-4">You haven't made any payments yet</p>
            <Link
              to="/customer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-block"
            >
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Booking ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-800 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">
                          {payment.transaction_id?.slice(-12) || payment._id?.slice(-12)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/customer/bookings/${payment.booking_id}`}
                          className="font-mono text-sm text-blue-400 hover:text-blue-300"
                        >
                          {payment.booking_id?.slice(-8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-blue-500">
                          ₹{payment.amount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewReceipt(payment._id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadReceipt(payment)}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded-lg transition"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-800 border-t border-gray-700">
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-right font-semibold">
                      Total:
                    </td>
                    <td className="px-6 py-4 font-bold text-xl text-blue-500">
                      ₹{getTotalSpent().toLocaleString()}
                    </td>
                    <td colSpan="3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Payment Receipt</h3>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-b border-gray-800 pb-3">
                <p className="text-gray-400 text-sm">Transaction ID</p>
                <p className="font-mono">{selectedPayment.transaction_id}</p>
              </div>
              
              <div className="border-b border-gray-800 pb-3">
                <p className="text-gray-400 text-sm">Booking ID</p>
                <p className="font-mono">{selectedPayment.booking_id}</p>
              </div>
              
              <div className="border-b border-gray-800 pb-3">
                <p className="text-gray-400 text-sm">Amount Paid</p>
                <p className="text-2xl font-bold text-blue-500">₹{selectedPayment.amount?.toLocaleString()}</p>
              </div>
              
              <div className="border-b border-gray-800 pb-3">
                <p className="text-gray-400 text-sm">Payment Method</p>
                <p className="capitalize">{selectedPayment.payment_method?.replace('_', ' ')}</p>
              </div>
              
              <div className="border-b border-gray-800 pb-3">
                <p className="text-gray-400 text-sm">Date</p>
                <p>{new Date(selectedPayment.created_at).toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {selectedPayment.status}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => downloadReceipt(selectedPayment)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}