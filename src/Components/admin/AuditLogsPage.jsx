import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { adminAPI } from "../../Services/adminApi";
// import AdminLayout from "./AdminLayout";

export default function AuditLogsPage() {
    
  // const token = useSelector((state) => state.auth.token);
  const token = localStorage.getItem("token")
  const api = adminAPI(token);

  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  // 🔹 Fetch logs
  const fetchLogs = async () => {
    const res = await api.getLogs();
    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 🔹 Search logs
  const handleSearch = async () => {
    const res = await api.searchLogs(search);
    setLogs(res.data);
  };

  // 🔹 Flag activity
  const flagLog = async (id, current) => {
    await api.flagLog(id, {
      flagged: !current,
      reason: "Suspicious activity"
    });

    fetchLogs();
  };

  return (
    
    <div className="bg-gray-950 min-h-screen text-white p-10">

      {/* Header */}
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Audit Logs
      </h1>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 p-3 rounded w-full"
        />

        <button
          onClick={handleSearch}
          className="bg-yellow-500 text-black px-6 rounded"
        >
          Search
        </button>
      </div>

      {/* Logs List */}
      <div className="space-y-4">

        {logs.length===0 ?logs.map((log) => (
          <div
            key={log._id}
            className="bg-gray-900 p-6 rounded-xl"
          >

            <p className="text-yellow-400 font-semibold">
              {log.action}
            </p>

            <p className="text-gray-400 mt-1">
              User: {log.user_id}
            </p>

            <p className="text-gray-400">
              Time: {new Date(log.timestamp).toLocaleString()}
            </p>

            <p className="mt-2">
              Status:{" "}
              <span className="text-yellow-400">
                {log.flagged ? "🚫 Flagged" : "✔ Normal"}
              </span>
            </p>

            <button
              onClick={() => flagLog(log._id, log.flagged)}
              className="mt-4 bg-red-500 px-4 py-2 rounded"
            >
              {log.flagged ? "Unflag" : "Flag"}
            </button>

          </div>
        )):<p className="text-gray-400">No logs found.</p>}

      </div>
    </div>
    
  );
}