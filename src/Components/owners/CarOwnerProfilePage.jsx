// src/Components/owners/CarOwnerProfilePage.jsx
import axios from "axios";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  Car,
  CheckCircle,
  Edit2,
  Eye,
  EyeOff,
  FileText,
  Image,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const API = "http://127.0.0.1:8000/customer";

export default function CarOwnerProfilePage() {
  const { user: authUser, token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    experience: "",
    license_number: "",
    license_image_url: "",
    id_proof_url: "",
    role: "",
    created_at: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
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
    console.log("Fetching profile with token:", authUser);
    setLoading(true);
    try {
      const response = await axios.get(`${API}/profile`, { headers });
      setProfile({
        name: response.data.name || "",
        email: response.data.email || "",
        phone_number: response.data.phone_number || "",
        address: response.data.address || "",
        experience: response.data.experience || "",
        license_number: response.data.license_number || "",
        license_image_url: response.data.license_image_url || "",
        id_proof_url: response.data.id_proof_url || "",
        role: response.data.role || "car_owner",
        created_at: response.data.created_at || new Date().toISOString()
      });
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
      await axios.put(`${API}/profile`, {
        name: profile.name,
        phone_number: profile.phone_number,
        address: profile.address,
        experience: profile.experience
      }, { headers });
      
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
      await axios.post(`${API}/change-password`, {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      }, { headers });
      
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

  const viewDocument = (url, title) => {
    setSelectedDocument({ url, title });
    setShowDocumentModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
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
          <h1 className="text-3xl font-bold">Car Owner Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account and vehicle owner information</p>
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
          {/* Cover Image - Yellow gradient for car owner */}
          <div className="h-32 bg-gradient-to-r from-yellow-600 to-orange-600"></div>
          
          {/* Avatar */}
          <div className="flex justify-center -mt-12 mb-6">
            <div className="bg-gray-900 rounded-full p-2">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full w-24 h-24 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {profile.name?.charAt(0)?.toUpperCase() || "O"}
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
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Full Name</p>
                      <p className="font-semibold">{profile.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Email Address</p>
                      <p className="font-semibold">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Phone Number</p>
                      <p className="font-semibold">{profile.phone_number || "Not set"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Address</p>
                      <p className="font-semibold">{profile.address || "Not set"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Experience</p>
                      <p className="font-semibold">{profile.experience || "Not set"} years</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Account Type</p>
                      <p className="font-semibold capitalize">{profile.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Member Since</p>
                      <p className="font-semibold">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="border-t border-gray-800 pt-6 mt-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-yellow-500" />
                    Verified Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-400 text-sm">License Number</p>
                      <p className="font-semibold">{profile.license_number || "Not provided"}</p>
                      {profile.license_image_url && (
                        <button
                          onClick={() => viewDocument(profile.license_image_url, "License Document")}
                          className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1"
                        >
                          <Image className="w-4 h-4" />
                          View License Image
                        </button>
                      )}
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-400 text-sm">ID Proof</p>
                      {profile.id_proof_url ? (
                        <button
                          onClick={() => viewDocument(profile.id_proof_url, "ID Proof Document")}
                          className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1"
                        >
                          <Image className="w-4 h-4" />
                          View ID Proof
                        </button>
                      ) : (
                        <p className="text-gray-500">Not provided</p>
                      )}
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
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition disabled:opacity-50"
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
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
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
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone_number}
                      onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Experience (Years)</label>
                    <input
                      type="text"
                      value={profile.experience}
                      onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Address</label>
                    <textarea
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      rows="3"
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none resize-none"
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
                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none pr-10"
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
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none pr-10"
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
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-lg transition disabled:opacity-50"
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

      {/* Document View Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedDocument.title}</h3>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <img 
                src={selectedDocument.url} 
                alt={selectedDocument.title}
                className="w-full h-auto max-h-96 object-contain"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500x300?text=Image+Not+Found";
                }}
              />
            </div>
            <div className="mt-4">
              <a
                href={selectedDocument.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 text-sm"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}