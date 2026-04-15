// src/Components/admin/UsersPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  Users, 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  UserCheck, 
  UserX,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  RefreshCw,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  FileText,
  Image,
  X,
  ChevronRight,
  User
} from "lucide-react";
import { adminAPI } from "../../Services/adminApi";

export default function UsersPage() {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const api = adminAPI(token);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      const usersData = res.data?.data || res.data || [];
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch individual user details
  const fetchUserDetails = async (userId) => {
    setLoadingDetails(true);
    try {
      const res = await api.getUser(userId);
      const userData = res.data?.data || res.data;
      setUserDetails(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Failed to load user details");
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, roleFilter, statusFilter, users]);

  const applyFilters = () => {
    let filtered = [...users];
    
    if (search) {
      filtered = filtered.filter(u => 
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.user_id?.toLowerCase().includes(search.toLowerCase()) ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone_number?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (roleFilter !== "all") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    
    if (statusFilter === "active") {
      filtered = filtered.filter(u => u.is_active === true && u.suspended !== true);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter(u => u.is_active === false);
    } else if (statusFilter === "suspended") {
      filtered = filtered.filter(u => u.suspended === true);
    }
    
    setFilteredUsers(filtered);
  };

  const handleSearch = async () => {
    if (!search) {
      fetchUsers();
      return;
    }
    try {
      const res = await api.searchUsers({ email: search });
      const searchData = res.data?.data || res.data || [];
      setFilteredUsers(searchData);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.deleteUser(userId);
      fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const changeRole = async (userId, role) => {
    try {
      await api.assignRole(userId, role);
      fetchUsers();
      setShowRoleModal(false);
      setSelectedUser(null);
      if (showUserModal) {
        await fetchUserDetails(userId);
      }
    } catch (error) {
      console.error("Error changing role:", error);
      alert("Failed to change role");
    }
  };

  const toggleActive = async (userId, currentStatus) => {
    try {
      await api.activateUser(userId, { is_active: !currentStatus });
      fetchUsers();
      if (showUserModal && userDetails?.user_id === userId) {
        await fetchUserDetails(userId);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update user status");
    }
  };

  const toggleSuspend = async (userId, currentStatus) => {
    try {
      await api.suspendUser(userId, {
        suspended: !currentStatus,
        reason: suspendReason || "Admin action"
      });
      fetchUsers();
      setShowSuspendModal(false);
      setSelectedUser(null);
      setSuspendReason("");
      if (showUserModal && userDetails?.user_id === userId) {
        await fetchUserDetails(userId);
      }
    } catch (error) {
      console.error("Error toggling suspension:", error);
      alert("Failed to update user suspension");
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { bg: "bg-purple-500/20", text: "text-purple-500", border: "border-purple-500", icon: <Shield className="w-3 h-3" /> },
      car_owner: { bg: "bg-yellow-500/20", text: "text-yellow-500", border: "border-yellow-500", icon: <Users className="w-3 h-3" /> },
      customer: { bg: "bg-blue-500/20", text: "text-blue-500", border: "border-blue-500", icon: <UserCheck className="w-3 h-3" /> }
    };
    const badge = badges[role] || badges.customer;
    return (
      <span className={`${badge.bg} ${badge.text} border ${badge.border} px-2 py-0.5 rounded-full text-xs flex items-center gap-1 w-fit`}>
        {badge.icon}
        {role?.replace("_", " ")}
      </span>
    );
  };

  const getStatusIcon = (user) => {
    if (user.suspended) return <XCircle className="w-5 h-5 text-red-500" title="Suspended" />;
    if (user.is_active) return <CheckCircle className="w-5 h-5 text-green-500" title="Active" />;
    return <AlertCircle className="w-5 h-5 text-gray-500" title="Inactive" />;
  };

  const roleOptions = [
    { value: "customer", label: "Customer" },
    { value: "car_owner", label: "Car Owner" },
    { value: "admin", label: "Admin" }
  ];

  const getStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.is_active && !u.suspended).length,
      carOwners: users.filter(u => u.role === "car_owner").length,
      admins: users.filter(u => u.role === "admin").length
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading users...</div>
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
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-gray-400 mt-1">Manage all users, roles, and account statuses</p>
            </div>
            <button
              onClick={fetchUsers}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Total Users</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Active Users</p>
            <p className="text-2xl font-bold">{stats.active}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Car Owners</p>
            <p className="text-2xl font-bold">{stats.carOwners}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Admins</p>
            <p className="text-2xl font-bold">{stats.admins}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email, name, phone, or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="car_owner">Car Owner</option>
              <option value="admin">Admin</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
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

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">User ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user.user_id} 
                      className="hover:bg-gray-800 transition cursor-pointer"
                      onClick={() => fetchUserDetails(user.user_id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user.email?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">{user.name || "N/A"}</p>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                            {user.phone_number && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3" />
                                {user.phone_number}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">{user.user_id}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user)}
                          <span className="text-sm">
                            {user.suspended ? "Suspended" : user.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => fetchUserDetails(user.user_id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setNewRole(user.role);
                              setShowRoleModal(true);
                            }}
                            className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition"
                            title="Change Role"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleActive(user.user_id, user.is_active)}
                            className={`${user.is_active ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"} text-white p-2 rounded-lg transition`}
                            title={user.is_active ? "Deactivate" : "Activate"}
                          >
                            {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowSuspendModal(true);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black p-2 rounded-lg transition"
                            title={user.suspended ? "Unsuspend" : "Suspend"}
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* User Details Modal */}
      {showUserModal && userDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900 pb-4 border-b border-gray-800">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-purple-500" />
                User Details
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                {/* User Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-800">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {userDetails.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{userDetails.name || "N/A"}</h4>
                    <p className="text-gray-400 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {userDetails.email}
                    </p>
                    {userDetails.phone_number && (
                      <p className="text-gray-400 flex items-center gap-1 mt-1">
                        <Phone className="w-4 h-4" />
                        {userDetails.phone_number}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {getRoleBadge(userDetails.role)}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        userDetails.suspended ? "bg-red-500/20 text-red-500" :
                        userDetails.is_active ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"
                      }`}>
                        {userDetails.suspended ? "Suspended" : userDetails.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Basic Information Section */}
                <div className="mb-6">
                  <h5 className="text-md font-semibold text-purple-400 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Basic Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">User ID</p>
                      <p className="font-mono text-sm">{userDetails.user_id}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Full Name</p>
                      <p className="font-semibold">{userDetails.name || "Not provided"}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Email Address</p>
                      <p className="text-sm break-all">{userDetails.email}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Phone Number</p>
                      <p className="font-semibold">{userDetails.phone_number || "Not provided"}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Member Since</p>
                      <p>{userDetails.created_at ? new Date(userDetails.created_at).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Last Updated</p>
                      <p>{userDetails.updated_at ? new Date(userDetails.updated_at).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Address & Experience Section */}
                {(userDetails.address || userDetails.experience) && (
                  <div className="mb-6">
                    <h5 className="text-md font-semibold text-purple-400 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location & Experience
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userDetails.address && (
                        <div className="bg-gray-800 rounded-lg p-3 md:col-span-2">
                          <p className="text-gray-400 text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Address
                          </p>
                          <p className="text-sm">{userDetails.address}</p>
                        </div>
                      )}
                      {userDetails.experience && (
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-gray-400 text-xs flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            Driving Experience
                          </p>
                          <p className="font-semibold">{userDetails.experience} years</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Verification Documents Section */}
                {(userDetails.license_number || userDetails.license_image_url || userDetails.id_proof_url) && (
                  <div className="mb-6">
                    <h5 className="text-md font-semibold text-purple-400 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Verification Documents
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userDetails.license_number && (
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-gray-400 text-xs flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            Driver's License Number
                          </p>
                          <p className="font-mono text-sm">{userDetails.license_number}</p>
                        </div>
                      )}
                      {userDetails.license_image_url && (
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-gray-400 text-xs flex items-center gap-1">
                            <Image className="w-3 h-3" />
                            License Document
                          </p>
                          <a 
                            href={userDetails.license_image_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mt-1"
                          >
                            <Eye className="w-3 h-3" />
                            View License Image
                            <ChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {userDetails.id_proof_url && (
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-gray-400 text-xs flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            ID Proof
                          </p>
                          <a 
                            href={userDetails.id_proof_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mt-1"
                          >
                            <Eye className="w-3 h-3" />
                            View ID Proof
                            <ChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => {
                      setSelectedUser(userDetails);
                      setNewRole(userDetails.role);
                      setShowRoleModal(true);
                      setShowUserModal(false);
                    }}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Change Role
                  </button>
                  <button
                    onClick={() => toggleActive(userDetails.user_id, userDetails.is_active)}
                    className={`flex-1 ${userDetails.is_active ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"} text-white py-2 rounded-lg transition flex items-center justify-center gap-2`}
                  >
                    {userDetails.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    {userDetails.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(userDetails);
                      setShowSuspendModal(true);
                      setShowUserModal(false);
                    }}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {userDetails.suspended ? "Unsuspend" : "Suspend"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(userDetails);
                      setShowDeleteModal(true);
                      setShowUserModal(false);
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-purple-500" />
              <h3 className="text-xl font-bold">Change User Role</h3>
            </div>
            <p className="text-gray-400 mb-4">
              User: <span className="text-white font-semibold">{selectedUser.email}</span>
            </p>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-6"
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => changeRole(selectedUser.user_id, newRole)}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition"
              >
                Change Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
              <h3 className="text-xl font-bold">
                {selectedUser.suspended ? "Unsuspend User" : "Suspend User"}
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              User: <span className="text-white font-semibold">{selectedUser.email}</span>
            </p>
            {!selectedUser.suspended && (
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Reason for suspension</label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Enter reason for suspension..."
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none resize-none"
                  rows="3"
                />
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setSuspendReason("");
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => toggleSuspend(selectedUser.user_id, selectedUser.suspended)}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition"
              >
                {selectedUser.suspended ? "Unsuspend" : "Suspend"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
              <h3 className="text-xl font-bold">Delete User</h3>
            </div>
            <p className="text-gray-400 mb-2">
              Are you sure you want to delete user <span className="text-white font-semibold">{selectedUser.email}</span>?
            </p>
            <p className="text-red-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedUser.user_id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}