import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { adminAPI } from "../../Services/adminApi";
import AdminLayout from "./AdminLayout";

export default function RolesPage() {
  const token =  localStorage.getItem("token");
  const api = adminAPI(token);

  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [permissions, setPermissions] = useState("");

  // 🔹 Fetch roles
  const fetchRoles = async () => {
    const res = await api.getRoles();
    setRoles(res.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // 🔹 Create role
  const createRole = async () => {
    if (!newRole) return;

    await api.createRole({
      role_name: newRole,
      permissions: permissions.split(",").map(p => p.trim())
    });

    setNewRole("");
    setPermissions("");
    fetchRoles();
  };

  // 🔹 Update role
  const updateRole = async (id, role) => {
    await api.updateRole(id, {
      permissions: role.permissions,
      is_active: !role.is_active
    });

    fetchRoles();
  };

  return (
    <AdminLayout>
    <div className="bg-gray-950 min-h-screen text-white p-10">

      {/* Header */}
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Roles & Permissions
      </h1>

      {/* Create Role */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8">

        <h2 className="text-xl mb-4">Create New Role</h2>

        <input
          placeholder="Role Name"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="bg-gray-800 p-3 rounded mr-3"
        />

        <input
          placeholder="Permissions (comma separated)"
          value={permissions}
          onChange={(e) => setPermissions(e.target.value)}
          className="bg-gray-800 p-3 rounded mr-3 w-1/2"
        />

        <button
          onClick={createRole}
          className="bg-yellow-500 text-black px-6 py-2 rounded"
        >
          Create
        </button>

      </div>

      {/* Roles List */}
      <div className="grid md:grid-cols-3 gap-6">

        {roles.length===0 ?roles.map((r) => (
          <div
            key={r._id}
            className="bg-gray-900 p-6 rounded-xl"
          >
            <h2 className="text-xl text-yellow-400">
              {r.role_name}
            </h2>

            <p className="mt-2 text-gray-400">
              Permissions:
            </p>

            <ul className="text-sm mt-2">
              {r.permissions?.map((p, i) => (
                <li key={i}>• {p}</li>
              ))}
            </ul>

            <p className="mt-3">
              Status:{" "}
              <span className="text-yellow-400">
                {r.is_active ? "Active" : "Inactive"}
              </span>
            </p>

            <button
              onClick={() => updateRole(r._id, r)}
              className="mt-4 bg-blue-500 px-4 py-2 rounded"
            >
              Toggle Active
            </button>

          </div>
        )):<p className="text-gray-400">No roles found.</p>}

      </div>
    </div>
    </AdminLayout>
  );
}