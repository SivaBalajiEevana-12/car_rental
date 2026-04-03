// src/pages/car-owner/Earnings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  FileText,
  Filter,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { earningsApi } from '../../services/carOwnerApi';

export default function Earnings() {
  const [earnings, setEarnings] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [summaryView, setSummaryView] = useState('month'); // month, year, all

  useEffect(() => {
    fetchEarnings();
  }, [dateRange]);

  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    try {
      const [earningsData, reportData] = await Promise.all([
        earningsApi.getEarnings(dateRange.start || null, dateRange.end || null),
        earningsApi.generateReport(dateRange.start || null, dateRange.end || null)
      ]);
      console.log('Earnings data:', earningsData);
      console.log('Report data:', reportData);
      setEarnings(earningsData);
      setReport(reportData);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      setError(error.response?.data?.detail || 'Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `earnings_report_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const downloadCSV = () => {
    if (!earnings?.transactions?.length) return;
    
    const headers = ['Transaction ID', 'Vehicle ID', 'Booking ID', 'Amount', 'Date', 'Status'];
    const rows = earnings.transactions.map(t => [
      t._id,
      t.vehicle_id,
      t.booking_id || 'N/A',
      t.amount,
      new Date(t.created_at).toLocaleDateString(),
      t.status
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `earnings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getQuickDateRange = (range) => {
    const today = new Date();
    let start = new Date();
    
    switch(range) {
      case 'today':
        start = today;
        break;
      case 'week':
        start = new Date(today.setDate(today.getDate() - 7));
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'year':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        return;
    }
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading earnings data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-6 rounded-lg max-w-md text-center">
          <DollarSign className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Earnings</h3>
          <p>{error}</p>
          <button 
            onClick={fetchEarnings}
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
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Earnings</h1>
              <p className="text-gray-400 mt-1">Track your revenue and transaction history</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadCSV}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <FileText className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={downloadReport}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Date Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => getQuickDateRange('today')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
          >
            Today
          </button>
          <button
            onClick={() => getQuickDateRange('week')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => getQuickDateRange('month')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
          >
            This Month
          </button>
          <button
            onClick={() => getQuickDateRange('year')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
          >
            This Year
          </button>
          <button
            onClick={() => setDateRange({ start: '', end: '' })}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
          >
            All Time
          </button>
        </div>

        {/* Date Range Picker */}
        <div className="bg-gray-900 rounded-lg p-4 mb-8 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
            />
          </div>
          <button
            onClick={fetchEarnings}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Apply Filter
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(earnings?.total_earnings)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-white opacity-50" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90 text-sm">Total Transactions</p>
                <p className="text-3xl font-bold mt-2">{earnings?.transaction_count || 0}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-white opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90 text-sm">Average Transaction</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency((earnings?.total_earnings || 0) / (earnings?.transaction_count || 1))}
                </p>
              </div>
              <Wallet className="w-10 h-10 text-white opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90 text-sm">Report Period</p>
                <p className="text-lg font-bold mt-2">
                  {dateRange.start || 'All'} to {dateRange.end || 'All'}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-white opacity-50" />
            </div>
          </div>
        </div>

        {/* Summary Section */}
        {report && (
          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-500" />
              Earnings Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Report Generated</p>
                <p className="font-semibold">
                  {new Date(report.report_generated_at).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Date Range</p>
                <p className="font-semibold">
                  {report.date_range?.start || 'Start'} to {report.date_range?.end || 'End'}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="font-semibold text-2xl text-yellow-500">
                  {report.total_transactions || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Transaction History</h3>
            <div className="text-sm text-gray-400">
              {earnings?.transactions?.length || 0} transactions found
            </div>
          </div>
          
          {earnings?.transactions?.length === 0 ? (
            <div className="text-center py-16">
              <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No transactions found</h3>
              <p className="text-gray-400">
                {dateRange.start || dateRange.end 
                  ? "No transactions in the selected date range" 
                  : "When you complete bookings, transactions will appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Vehicle ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Booking ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {earnings.transactions.map((transaction, index) => (
                    <tr key={transaction._id || index} className="hover:bg-gray-800 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">
                          {transaction._id?.slice(-12) || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">
                          {transaction.vehicle_id?.slice(-8) || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">
                          {transaction.booking_id?.slice(-8) || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-yellow-500">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm">
                          {transaction.status || 'Completed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-800 border-t border-gray-700">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-semibold">
                      Total:
                    </td>
                    <td className="px-6 py-4 font-bold text-xl text-yellow-500">
                      {formatCurrency(earnings?.total_earnings)}
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}