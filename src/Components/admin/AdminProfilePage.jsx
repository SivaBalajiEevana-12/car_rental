// src/Components/admin/AdminProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Save, 
  Edit2, 
  X, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle,
  Calendar,
  Lock,
  Home
} from "lucide-react";
import axios from "axios";

const API = "http://127.0.0.1:8000/admin";

export default function AdminProfilePage() {
  const { user: authUser, token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    role: "",
    created_at: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Get user details from /admin/users/me or similar endpoint
      const response = await axios.get(`${API}/users`, { headers });
      const users = response.data;
      const currentUser = users.find(u => u.user_id === authUser?.id);
      
      if (currentUser) {
        setProfile({
          name: currentUser.name || "Admin User",
          email: currentUser.email || "",
          phone_number: currentUser.phone_number || "",
          role: currentUser.role || "admin",
          created_at: currentUser.created_at || new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    
    try {
      // Find user by email and update
      const users = await axios.get(`${API}/users`, { headers });
      const currentUser = users.data.find(u => u.email === profile.email);
      
      if (currentUser) {
        await axios.put(`${API}/users/${currentUser.user_id}`, {
          name: profile.name,
          phone_number: profile.phone_number
        }, { headers });
      }
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: error.response?.data?.detail || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });
    
    try {
      // Find user and reset password
      const users = await axios.get(`${API}/users`, { headers });
      const currentUser = users.data.find(u => u.email === profile.email);
      
      if (currentUser) {
        await axios.patch(`${API}/users/${currentUser.user_id}/reset-password`, {
          new_password: passwordData.new_password
        }, { headers });
      }
      
      setMessage({ type: "success", text: "Password changed successfully!" });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
        setMessage({ type: "", text: "" });
      }, 2000);
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({ type: "error", text: error.response?.data?.detail || "Failed to change password" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account information</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success" 
              ? "bg-green-500/20 border border-green-500 text-green-500"
              : "bg-red-500/20 border border-red-500 text-red-500"
          }`}>
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
          {/* Cover Image - Purple gradient for admin */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600"></div>
          
          {/* Avatar */}
          <div className="flex justify-center -mt-12 mb-6">
            <div className="bg-gray-900 rounded-full p-2">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-24 h-24 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {profile.name?.charAt(0)?.toUpperCase() || "A"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Full Name</p>
                      <p className="font-semibold">{profile.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Email Address</p>
                      <p className="font-semibold">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Phone Number</p>
                      <p className="font-semibold">{profile.phone_number || "Not set"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Account Type</p>
                      <p className="font-semibold capitalize">{profile.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Member Since</p>
                      <p className="font-semibold">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email (Cannot be changed)</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 opacity-50 cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone_number}
                      onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition disabled:opacity-50"
              >
                {saving ? "Changing..." : "Change Password"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
                }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}