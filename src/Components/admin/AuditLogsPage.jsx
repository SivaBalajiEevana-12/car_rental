import React, { useEffect, useState } from "react";
import { adminAPI } from "../../Services/adminApi";
import { 
  Search, 
  Flag, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Shield,
  Zap,
  Eye,
  FileText,
  Settings,
  Lock,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  PlusCircle
} from "lucide-react";

export default function AuditLogsPage() {
  const token = localStorage.getItem("token");
  const api = adminAPI(token);

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [stats, setStats] = useState({ total: 0, flagged: 0, today: 0 });

  // Helper function to safely render any value
  const safeRender = (value, defaultValue = "N/A") => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'object') {
      // If it has vehicle_name, format it nicely
      if (value.vehicle_name) {
        return `${value.vehicle_name}${value.vehicle_id ? ` (ID: ${value.vehicle_id})` : ''}`;
      }
      // If it has message or text property
      if (value.message) return value.message;
      if (value.text) return value.text;
      // Otherwise stringify
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Action icons mapping
  const getActionIcon = (action) => {
    const actionStr = safeRender(action, "");
    const actionLower = actionStr.toLowerCase();
    
    if (actionLower.includes("login")) return <LogIn className="w-5 h-5 text-green-400" />;
    if (actionLower.includes("logout")) return <LogOut className="w-5 h-5 text-red-400" />;
    if (actionLower.includes("create") || actionLower.includes("add")) return <PlusCircle className="w-5 h-5 text-blue-400" />;
    if (actionLower.includes("update") || actionLower.includes("edit")) return <Edit className="w-5 h-5 text-yellow-400" />;
    if (actionLower.includes("delete") || actionLower.includes("remove")) return <Trash2 className="w-5 h-5 text-red-400" />;
    if (actionLower.includes("flag")) return <Flag className="w-5 h-5 text-orange-400" />;
    if (actionLower.includes("setting")) return <Settings className="w-5 h-5 text-purple-400" />;
    if (actionLower.includes("view")) return <Eye className="w-5 h-5 text-cyan-400" />;
    return <Activity className="w-5 h-5 text-gray-400" />;
  };

  const getActionColor = (action) => {
    const actionStr = safeRender(action, "");
    const actionLower = actionStr.toLowerCase();
    
    if (actionLower.includes("login")) return "border-green-500/20 bg-green-500/5";
    if (actionLower.includes("logout")) return "border-red-500/20 bg-red-500/5";
    if (actionLower.includes("create") || actionLower.includes("add")) return "border-blue-500/20 bg-blue-500/5";
    if (actionLower.includes("update") || actionLower.includes("edit")) return "border-yellow-500/20 bg-yellow-500/5";
    if (actionLower.includes("delete")) return "border-red-500/20 bg-red-500/5";
    return "border-gray-500/20 bg-gray-500/5";
  };

  // Fetch logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getLogs();
      const logsData = Array.isArray(res.data) ? res.data : [];
      setLogs(logsData);
      calculateStats(logsData);
      setFilteredLogs(logsData);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (logsData) => {
    const today = new Date().toISOString().split('T')[0];
    const flagged = logsData.filter(log => log.flagged).length;
    const todayLogs = logsData.filter(log => {
      if (!log.timestamp) return false;
      return log.timestamp.split('T')[0] === today;
    }).length;
    
    setStats({
      total: logsData.length,
      flagged: flagged,
      today: todayLogs
    });
  };

  // Search and filter logs
  const handleSearch = () => {
    let filtered = [...logs];
    
    // Search by action or user
    if (search) {
      filtered = filtered.filter(log => {
        const actionStr = safeRender(log.action, "");
        const userIdStr = safeRender(log.user_id, "");
        const detailsStr = safeRender(log.details, "");
        
        return actionStr.toLowerCase().includes(search.toLowerCase()) ||
          userIdStr.toLowerCase().includes(search.toLowerCase()) ||
          detailsStr.toLowerCase().includes(search.toLowerCase());
      });
    }
    
    // Filter by action type
    if (selectedAction !== "all") {
      filtered = filtered.filter(log => {
        const actionStr = safeRender(log.action, "");
        return actionStr.toLowerCase().includes(selectedAction.toLowerCase());
      });
    }
    
    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(log => {
        if (!log.timestamp) return false;
        return log.timestamp.split('T')[0] >= dateRange.start;
      });
    }
    if (dateRange.end) {
      filtered = filtered.filter(log => {
        if (!log.timestamp) return false;
        return log.timestamp.split('T')[0] <= dateRange.end;
      });
    }
    
    setFilteredLogs(filtered);
  };

  // Flag/Unflag log
  const flagLog = async (id, current) => {
    try {
      await api.flagLog(id, {
        flagged: !current,
        reason: "Suspicious activity"
      });
      fetchLogs();
    } catch (error) {
      console.error("Error flagging log:", error);
    }
  };

  // Export logs
  const exportLogs = () => {
    const exportData = filteredLogs.map(log => ({
      id: log._id,
      action: safeRender(log.action),
      user_id: safeRender(log.user_id),
      details: safeRender(log.details),
      timestamp: log.timestamp,
      flagged: log.flagged,
      ip_address: log.ip_address || "N/A"
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `audit-logs-${new Date().toISOString()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, selectedAction, dateRange.start, dateRange.end]);

  // Get unique actions for filter
  const uniqueActions = ["all", ...new Set(logs.map(log => safeRender(log.action)).filter(a => a && a !== "N/A"))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header with 3D effect */}
        <div className="transform transition-all duration-500 hover:scale-[1.02]">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Audit Logs
                  </h1>
                  <p className="text-gray-400 mt-1">Monitor and track all system activities</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={fetchLogs}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all transform hover:scale-105 border border-gray-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={exportLogs}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards with 3D hover effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 transform transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Activities</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 transform transition-all duration-300 group-hover:scale-105 group-hover:border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Flagged Activities</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.flagged}</p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-full">
                  <Flag className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 transform transition-all duration-300 group-hover:scale-105 group-hover:border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Today's Activities</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.today}</p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Calendar className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                placeholder="Search by action, user, or details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-900/50 pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none transition-all text-white"
              />
            </div>

            {/* Action Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full bg-gray-900/50 pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none appearance-none cursor-pointer text-white"
              >
                {uniqueActions.map(action => (
                  <option key={action} value={action}>
                    {action === "all" ? "All Actions" : action}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="flex-1 bg-gray-900/50 px-3 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none text-white"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="flex-1 bg-gray-900/50 px-3 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none text-white"
                placeholder="End Date"
              />
            </div>
          </div>
        </div>

        {/* Logs List with animations */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
                </div>
              </div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No logs found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <div
                key={log._id || index}
                className="group relative transform transition-all duration-300 hover:scale-[1.02]"
                style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: `${index * 50}ms`, opacity: 0 }}
              >
                <div className={`absolute inset-0 ${getActionColor(log.action)} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500`}></div>
                <div className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border ${log.flagged ? 'border-red-500/50 shadow-red-500/20' : 'border-gray-700'} shadow-xl overflow-hidden`}>
                  
                  {/* Animated border on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Left side - Action info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${log.flagged ? 'bg-red-500/20' : 'bg-gray-700/50'} transition-all group-hover:scale-110`}>
                        {getActionIcon(log.action)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {safeRender(log.action, "Unknown Action")}
                          </h3>
                          {log.flagged && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs animate-pulse">
                              <AlertTriangle className="w-3 h-3" />
                              Flagged
                            </span>
                          )}
                        </div>
                        
                        {/* Safe rendering of details */}
                        {log.details && (
                          <p className="text-gray-400 text-sm mb-2">
                            {safeRender(log.details)}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>User: {safeRender(log.user_id)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}</span>
                          </div>
                          {log.ip_address && (
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              <span>IP: {log.ip_address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Action button */}
                    <button
                      onClick={() => flagLog(log._id, log.flagged)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all transform hover:scale-105 ${
                        log.flagged
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                      }`}
                    >
                      {log.flagged ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Unflag
                        </>
                      ) : (
                        <>
                          <Flag className="w-4 h-4" />
                          Flag Activity
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {filteredLogs.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {filteredLogs.length} of {logs.length} activities
          </div>
        )}
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}