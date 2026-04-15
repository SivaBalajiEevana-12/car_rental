import React, { useEffect, useState } from "react";
import { adminAPI } from "../../Services/adminApi";

export default function RolesPage() {
  const token = localStorage.getItem("token");
  const api = adminAPI(token);

  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [permissions, setPermissions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [editPermissions, setEditPermissions] = useState("");

  // 🔹 Fetch roles
  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getRoles();
      setRoles(res.data || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError("Failed to fetch roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // 🔹 Create role
  const createRole = async () => {
    if (!newRole.trim()) {
      setError("Role name is required");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const permissionsArray = permissions
        .split(",")
        .map(p => p.trim())
        .filter(p => p !== "");
      
      await api.createRole({
        role_name: newRole.trim(),
        permissions: permissionsArray
      });

      setNewRole("");
      setPermissions("");
      setSuccessMessage(`Role "${newRole}" created successfully!`);
      fetchRoles();
    } catch (err) {
      console.error("Error creating role:", err);
      setError("Failed to create role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Toggle role active status
  const toggleRoleStatus = async (id, role) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.updateRole(id, {
        permissions: role.permissions,
        is_active: !role.is_active
      });
      
      setSuccessMessage(`Role status updated successfully!`);
      fetchRoles();
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Failed to update role status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update role permissions
  const updateRolePermissions = async (id) => {
    if (!editPermissions) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const permissionsArray = editPermissions
        .split(",")
        .map(p => p.trim())
        .filter(p => p !== "");
      
      await api.updateRole(id, {
        permissions: permissionsArray,
        is_active: true
      });
      
      setEditingRole(null);
      setEditPermissions("");
      setSuccessMessage(`Role permissions updated successfully!`);
      fetchRoles();
    } catch (err) {
      console.error("Error updating permissions:", err);
      setError("Failed to update permissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete role
  const deleteRole = async (id, roleName) => {
    if (!window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await api.deleteRole(id);
      setSuccessMessage(`Role "${roleName}" deleted successfully!`);
      fetchRoles();
    } catch (err) {
      console.error("Error deleting role:", err);
      setError("Failed to delete role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">
          Roles & Permissions
        </h1>
        <p className="text-gray-400">
          Manage user roles and their access permissions
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Create Role Section */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">
          Create New Role
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Role Name
            </label>
            <input
              placeholder="e.g., Super Admin, Manager, Support"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none transition"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Permissions (comma separated)
            </label>
            <input
              placeholder="e.g., create_users, edit_roles, view_reports"
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none transition"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple permissions with commas
            </p>
          </div>

          <button
            onClick={createRole}
            disabled={loading || !newRole.trim()}
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Creating..." : "Create Role"}
          </button>
        </div>
      </div>

      {/* Roles List Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">
          Existing Roles ({roles.length})
        </h2>
        
        {loading && roles.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : roles.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-12 text-center">
            <div className="text-gray-600 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">No roles found</h3>
            <p className="text-gray-400">
              Create your first role using the form above
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((r) => (
              <div
                key={r._id}
                className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-yellow-400">
                      {r.role_name}
                    </h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      r.is_active 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {r.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Permissions Section */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">
                      Permissions:
                    </p>
                    {editingRole === r._id ? (
                      <div className="space-y-2">
                        <input
                          placeholder="Edit permissions (comma separated)"
                          defaultValue={r.permissions?.join(", ")}
                          onChange={(e) => setEditPermissions(e.target.value)}
                          className="w-full bg-gray-800 p-2 rounded-lg text-sm border border-gray-700 focus:border-yellow-500 focus:outline-none"
                          disabled={loading}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateRolePermissions(r._id)}
                            disabled={loading}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingRole(null);
                              setEditPermissions("");
                            }}
                            className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {r.permissions?.length > 0 ? (
                          <ul className="text-sm space-y-1 mb-3">
                            {r.permissions.slice(0, 5).map((p, i) => (
                              <li key={i} className="text-gray-300">
                                • {p}
                              </li>
                            ))}
                            {r.permissions.length > 5 && (
                              <li className="text-gray-500 text-xs">
                                +{r.permissions.length - 5} more
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500 mb-3">
                            No permissions assigned
                          </p>
                        )}
                        <button
                          onClick={() => setEditingRole(r._id)}
                          className="text-blue-400 text-sm hover:text-blue-300 transition mb-3"
                        >
                          Edit Permissions
                        </button>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => toggleRoleStatus(r._id, r)}
                      disabled={loading}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        r.is_active
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      }`}
                    >
                      {r.is_active ? "Deactivate" : "Activate"}
                    </button>
                    
                    <button
                      onClick={() => deleteRole(r._id, r.role_name)}
                      disabled={loading}
                      className="flex-1 bg-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}