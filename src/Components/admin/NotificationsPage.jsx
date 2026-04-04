// src/Components/admin/NotificationsPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  Bell, 
  Send, 
  Trash2, 
  Users, 
  Mail, 
  Calendar,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  UserCheck
} from "lucide-react";
import { adminAPI } from "../../Services/adminApi";

export default function NotificationsPage() {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const api = adminAPI(token);

  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  // const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  const [form, setForm] = useState({
    user_id: "",
    title: "",
    message: ""
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await api.getUsers();
      const usersData = res.data?.data || res.data || [];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.getNotifications();
      const notificationsData = res.data?.data || res.data || [];
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Select user from list
  const selectUser = (user) => {
    setForm({
      ...form,
      user_id: user.user_id
    });
    setSelectedUser(user);
    setShowUserModal(false);
  };

  // Send notification
  const sendNotification = async () => {
    if (!form.user_id || !form.title || !form.message) {
      alert("Please fill in all fields and select a user");
      return;
    }

    setSending(true);
    try {
      await api.sendNotification(form);
      setForm({ user_id: "", title: "", message: "" });
      setSelectedUser(null);
      fetchNotifications();
      alert("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert(error.response?.data?.detail || "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await api.deleteNotification(id);
      fetchNotifications();
      setShowDeleteModal(false);
      setSelectedNotification(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert(error.response?.data?.detail || "Failed to delete notification");
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.user_id?.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const getStatusBadge = (read) => {
    if (read) {
      return (
        <span className="bg-green-500/20 text-green-500 border border-green-500 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 w-fit">
          <CheckCircle className="w-3 h-3" />
          Read
        </span>
      );
    } else {
      return (
        <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 w-fit">
          <AlertCircle className="w-3 h-3" />
          Unread
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading notifications...</div>
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
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-gray-400 mt-1">Send and manage notifications to users</p>
            </div>
            <button
              onClick={fetchNotifications}
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
            <p className="text-white opacity-90 text-sm">Total Notifications</p>
            <p className="text-2xl font-bold">{notifications.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Unread Notifications</p>
            <p className="text-2xl font-bold">{notifications.filter(n => !n.read).length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Send Notification Form */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-500" />
              Send Notification
            </h2>

            {/* Selected User Display */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Select User</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowUserModal(true)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 flex items-center justify-between"
                >
                  <span>
                    {selectedUser ? (
                      <span className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-green-500" />
                        {selectedUser.email} ({selectedUser.user_id})
                      </span>
                    ) : (
                      "Click to select a user"
                    )}
                  </span>
                  <Users className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              {form.user_id && (
                <p className="text-xs text-green-500 mt-1">
                  Selected User ID: {form.user_id}
                </p>
              )}
            </div>

            <input
              name="title"
              placeholder="Notification Title"
              value={form.title}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded-lg w-full mb-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
            />

            <textarea
              name="message"
              placeholder="Notification Message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              className="bg-gray-800 p-3 rounded-lg w-full mb-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
            />

            <button
              onClick={sendNotification}
              disabled={sending || !form.user_id || !form.title || !form.message}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Notification
                </>
              )}
            </button>
          </div>

          {/* Notifications List */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-500" />
              Recent Notifications
            </h2>

            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications sent yet
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification._id}
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-purple-500" />
                          <h3 className="font-semibold">{notification.title}</h3>
                          {getStatusBadge(notification.read)}
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex gap-3 mt-2 text-xs text-gray-500">
                          <span>To: {notification.user_id}</span>
                          <span>•</span>
                          <span>{new Date(notification.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedNotification(notification);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Selection Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Select User
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, user ID, or name..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.user_id}
                    onClick={() => selectUser(user)}
                    className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold">{user.email}</p>
                      <div className="flex gap-3 text-sm text-gray-400">
                        <span>ID: {user.user_id}</span>
                        <span>Role: {user.role}</span>
                        {user.name && <span>Name: {user.name}</span>}
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
              <h3 className="text-xl font-bold">Delete Notification</h3>
            </div>
            <p className="text-gray-400 mb-2">
              Are you sure you want to delete this notification?
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
                onClick={() => deleteNotification(selectedNotification._id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}