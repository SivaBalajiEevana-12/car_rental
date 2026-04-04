// src/Components/admin/FinanceDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  RefreshCw,
  Wallet,
  CreditCard,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const API = "http://127.0.0.1:8000/admin";

export default function FinanceDashboard() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState({
    revenue: {},
    commission: {},
    report: {}
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [revenueRes, commissionRes] = await Promise.all([
        axios.get(`${API}/finance/revenue-summary`, { headers }),
        axios.get(`${API}/finance/platform-commission`, { headers })
      ]);

      setData({
        revenue: revenueRes.data,
        commission: commissionRes.data,
      });
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.start) params.append("start_date", dateRange.start);
      if (dateRange.end) params.append("end_date", dateRange.end);
      
      const res = await axios.get(`${API}/finance/report?${params.toString()}`, { headers });
      setReportData(res.data);
      setShowReportModal(true);
    } catch (error) {
      console.error("Error generating report:", error);
      alert(error.response?.data?.detail || "Failed to generate report");
    } finally {
      setGeneratingReport(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `financial_report_${new Date().toISOString().split("T")[0]}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading finance data...</div>
        </div>
      </div>
    );
  }

  const totalRevenue = data.revenue?.total_revenue || 0;
  const totalCommission = data.commission?.total_commission || 0;
  const netRevenue = totalRevenue - totalCommission;
  const commissionPercentage = totalRevenue > 0 ? (totalCommission / totalRevenue * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Finance Dashboard</h1>
              <p className="text-gray-400 mt-1">Monitor revenue, commissions, and financial performance</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchData}
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-white opacity-50" />
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-white/80">Total earnings from all bookings</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90 text-sm">Platform Commission</p>
                <p className="text-3xl font-bold mt-2">₹{totalCommission.toLocaleString()}</p>
              </div>
              <Wallet className="w-10 h-10 text-white opacity-50" />
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <span className="text-white/80">{commissionPercentage}% of total revenue</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90 text-sm">Net Revenue</p>
                <p className="text-3xl font-bold mt-2">₹{netRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-white opacity-50" />
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <span className="text-white/80">After platform commission</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white opacity-90 text-sm">Total Transactions</p>
                <p className="text-3xl font-bold mt-2">{data.revenue?.total_transactions || 0}</p>
              </div>
              <CreditCard className="w-10 h-10 text-white opacity-50" />
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <span className="text-white/80">Completed payments</span>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Breakdown */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Revenue Breakdown
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Gross Revenue</span>
                  <span className="font-semibold text-green-500">₹{totalRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Platform Commission</span>
                  <span className="font-semibold text-purple-500">₹{totalCommission.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${commissionPercentage}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Net Revenue</span>
                  <span className="font-semibold text-blue-500">₹{netRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(netRevenue / totalRevenue * 100) || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Key Metrics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-purple-500">{commissionPercentage}%</p>
                <p className="text-sm text-gray-400 mt-1">Commission Rate</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-500">{data.revenue?.total_transactions || 0}</p>
                <p className="text-sm text-gray-400 mt-1">Total Transactions</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-500">
                  ₹{totalRevenue > 0 ? Math.round(totalRevenue / (data.revenue?.total_transactions || 1)).toLocaleString() : 0}
                </p>
                <p className="text-sm text-gray-400 mt-1">Average Transaction</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-500">
                  {(totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-400 mt-1">Revenue (Millions)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Financial Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Metric</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-gray-800 transition">
                  <td className="px-4 py-3">Gross Revenue</td>
                  <td className="px-4 py-3 text-right text-green-500 font-semibold">₹{totalRevenue.toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-gray-800 transition">
                  <td className="px-4 py-3">Platform Commission ({commissionPercentage}%)</td>
                  <td className="px-4 py-3 text-right text-purple-500 font-semibold">₹{totalCommission.toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-gray-800 transition">
                  <td className="px-4 py-3 font-semibold">Net Revenue</td>
                  <td className="px-4 py-3 text-right text-blue-500 font-bold text-lg">₹{netRevenue.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Generate Financial Report
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={generateReport}
                disabled={generatingReport}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                {generatingReport ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Generate Report
                  </>
                )}
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Result Modal */}
      {reportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Financial Report</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Report Generated</p>
                <p className="font-semibold">{new Date(reportData.generated_at).toLocaleString()}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Date Range</p>
                  <p className="font-semibold">
                    {reportData.start_date || "Start"} to {reportData.end_date || "End"}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Transactions</p>
                  <p className="text-2xl font-bold text-purple-500">{reportData.total_transactions || 0}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-green-500">₹{(reportData.total_revenue || 0).toLocaleString()}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Platform Commission</p>
                <p className="text-3xl font-bold text-purple-500">₹{(reportData.total_commission || 0).toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4">
                <p className="text-white opacity-90 text-sm">Net Revenue</p>
                <p className="text-3xl font-bold text-white">₹{((reportData.total_revenue || 0) - (reportData.total_commission || 0)).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={downloadReport}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <button
                onClick={() => setShowReportModal(false)}
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