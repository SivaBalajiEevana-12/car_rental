import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { adminAPI } from "../../Services/adminApi";
import AdminLayout from "./AdminLayout";

export default function UsersPage() {
  const token = useSelector((state) => state.auth.token)||  localStorage.getItem("token");
  const api = adminAPI(token);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    const res = await api.getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 Search
  const handleSearch = async () => {
    if (!search) return fetchUsers();

    const res = await api.searchUsers({ email: search });
    setUsers(res.data);
  };

  // 🗑 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.deleteUser(id);
    fetchUsers();
  };

  // 🔄 Change Role
  const changeRole = async (id, role) => {
    await api.assignRole(id, role);
    fetchUsers();
  };

  // 🟢 Activate / Deactivate
  const toggleActive = async (id, current) => {
    await api.activateUser(id, { is_active: !current });
    fetchUsers();
  };

  // 🚫 Suspend / Unsuspend
  const toggleSuspend = async (id, current) => {
    await api.suspendUser(id, {
      suspended: !current,
      reason: "Admin action"
    });
    fetchUsers();
  };

  return (
    <AdminLayout>
    <div className="bg-gray-200 min-h-screen p-10">

      {/* Title */}
      <h1 className="text-3xl text-yellow-500 mb-6 font-semibold">
        Users
      </h1>

      {/* Search */}
      <div className="flex gap-4 mb-6 text-black">
        <input
          placeholder="Search by email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-lg w-full text-black border outline-none"
        />

        <button
          onClick={handleSearch}
          className="bg-yellow-500 px-6 rounded-lg text-black font-semibold"
        >
          Search
        </button>
      </div>

      {/* Users */}
      <div className="space-y-6">

        {users.map((u) => (
          <div
            key={u.user_id}
            className="bg-gray-900 text-white p-6 rounded-xl flex justify-between items-center"
          >
            {/* Left */}
            <div>
              <p className="text-lg font-medium">{u.email}</p>
              <p className="text-yellow-400 mt-1">{u.role}</p>

              {/* Status */}
              <div className="text-sm mt-2">
                <span>
                  Active: {u.is_active ? "✅" : "❌"}
                </span>{" "}
                |{" "}
                <span>
                  Suspended: {u.suspended ? "🚫" : "✔"}
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 flex-wrap">

              {/* Role */}
              <select
                value={u.role}
                onChange={(e) =>
                  changeRole(u.user_id, e.target.value)
                }
                className="bg-gray-700 px-3 py-2 rounded"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="car_owner">Owner</option>
              </select>

              {/* Activate */}
              <button
                onClick={() => toggleActive(u.user_id, u.is_active)}
                className="bg-blue-500 px-3 py-2 rounded"
              >
                {u.is_active ? "Deactivate" : "Activate"}
              </button>

              {/* Suspend */}
              <button
                onClick={() => toggleSuspend(u.user_id, u.suspended)}
                className="bg-orange-500 px-3 py-2 rounded"
              >
                {u.suspended ? "Unsuspend" : "Suspend"}
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(u.user_id)}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-400"
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
    </AdminLayout>
  );
}