// src/Components/admin/AuditLogsPage.jsx
import React, { useEffect, useState } from "react";
import { adminAPI } from "../../Services/adminApi";
import { 
  Search, 
  RefreshCw, 
  Flag, 
  FileText, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Filter,
  Calendar,
  Activity,
  Eye
} from "lucide-react";

export default function AuditLogsPage() {
  const token = localStorage.getItem("token");
  const api = adminAPI(token);

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getLogs();
      const logsData = res.data?.data || res.data || [];
      setLogs(logsData);
      setFilteredLogs(logsData);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filterType, logs]);

  const applyFilters = () => {
    let filtered = [...logs];
    
    if (search) {
      filtered = filtered.filter(log => 
        log.action?.toLowerCase().includes(search.toLowerCase()) ||
        log.user_id?.toLowerCase().includes(search.toLowerCase()) ||
        log._id?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (filterType === "flagged") {
      filtered = filtered.filter(log => log.flagged === true);
    } else if (filterType === "normal") {
      filtered = filtered.filter(log => log.flagged !== true);
    }
    
    setFilteredLogs(filtered);
  };

  const handleSearch = async () => {
    if (!search) {
      fetchLogs();
      return;
    }
    try {
      const res = await api.searchLogs(search);
      const logsData = res.data?.data || res.data || [];
      setFilteredLogs(logsData);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const flagLog = async (id, current) => {
    try {
      await api.flagLog(id, {
        flagged: !current,
        reason: "Suspicious activity"
      });
      fetchLogs();
    } catch (error) {
      console.error("Error flagging log:", error);
      alert("Failed to flag log");
    }
  };

  const getActionColor = (action) => {
    const actionLower = action?.toLowerCase() || "";
    if (actionLower.includes("delete") || actionLower.includes("remove")) {
      return "text-red-500";
    } else if (actionLower.includes("create") || actionLower.includes("add")) {
      return "text-green-500";
    } else if (actionLower.includes("update") || actionLower.includes("edit")) {
      return "text-yellow-500";
    } else if (actionLower.includes("login") || actionLower.includes("auth")) {
      return "text-blue-500";
    }
    return "text-purple-500";
  };

  const getStats = () => {
    return {
      total: logs.length,
      flagged: logs.filter(l => l.flagged === true).length,
      normal: logs.filter(l => l.flagged !== true).length
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading audit logs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Audit Logs</h1>
              <p className="text-gray-400 mt-1">Monitor all system activities and user actions</p>
            </div>
            <button
              onClick={fetchLogs}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Total Logs</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Normal Activities</p>
            <p className="text-2xl font-bold">{stats.normal}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Flagged Activities</p>
            <p className="text-2xl font-bold">{stats.flagged}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by action, user ID, or log ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Activities</option>
              <option value="flagged">Flagged Only</option>
              <option value="normal">Normal Only</option>
            </select>
            
            <button
              onClick={handleSearch}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>

        {/* Logs List */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No audit logs found</h3>
            <p className="text-gray-400">
              {search || filterType !== "all" 
                ? "Try adjusting your search or filters"
                : "No activities have been logged yet"}
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Log ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">User ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Timestamp</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-800 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">
                          {log._id?.slice(-12)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Activity className={`w-4 h-4 ${getActionColor(log.action)}`} />
                          <span className={`font-semibold ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-sm">
                            {log.user_id?.slice(-8)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {log.flagged ? (
                          <span className="bg-red-500/20 text-red-500 border border-red-500 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 w-fit">
                            <AlertCircle className="w-3 h-3" />
                            Flagged
                          </span>
                        ) : (
                          <span className="bg-green-500/20 text-green-500 border border-green-500 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3 h-3" />
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedLog(log);
                              setShowDetailsModal(true);
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => flagLog(log._id, log.flagged)}
                            className={`${log.flagged ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white p-2 rounded-lg transition`}
                            title={log.flagged ? "Unflag" : "Flag"}
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Log Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                x
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Log ID</p>
                  <p className="font-mono text-sm">{selectedLog._id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Action</p>
                  <p className={`font-semibold ${getActionColor(selectedLog.action)}`}>
                    {selectedLog.action}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">User ID</p>
                  <p className="font-mono">{selectedLog.user_id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Timestamp</p>
                  <p>{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className={selectedLog.flagged ? "text-red-500" : "text-green-500"}>
                    {selectedLog.flagged ? "Flagged" : "Normal"}
                  </p>
                </div>
                {selectedLog.ip_address && (
                  <div>
                    <p className="text-gray-400 text-sm">IP Address</p>
                    <p className="font-mono">{selectedLog.ip_address}</p>
                  </div>
                )}
              </div>

              {selectedLog.details && (
                <div className="border-t border-gray-800 pt-4">
                  <p className="text-gray-400 text-sm mb-2">Details</p>
                  <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.flag_reason && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                  <p className="text-red-500 text-sm font-semibold mb-1">Flag Reason</p>
                  <p className="text-red-400">{selectedLog.flag_reason}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  flagLog(selectedLog._id, selectedLog.flagged);
                  setShowDetailsModal(false);
                }}
                className={`flex-1 ${selectedLog.flagged ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white py-2 rounded-lg transition flex items-center justify-center gap-2`}
              >
                <Flag className="w-4 h-4" />
                {selectedLog.flagged ? "Unflag Activity" : "Flag Activity"}
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
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
