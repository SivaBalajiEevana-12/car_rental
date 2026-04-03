// src/Components/customer/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Shield, Key } from 'lucide-react';
import axios from 'axios';

export default function ProfilePage() {
  const { user, token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    joined_date: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProfile({
        name: response.data.name || '',
        email: response.data.email || user?.email || '',
        phone_number: response.data.phone_number || '',
        address: response.data.address || '',
        joined_date: response.data.created_at ? new Date(response.data.created_at).toLocaleDateString() : 'N/A'
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      await axios.put('http://127.0.0.1:8000/users/profile', {
        name: profile.name,
        phone_number: profile.phone_number,
        address: profile.address
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    setPasswordError('');
    setPasswordSuccess('');
    
    try {
      await axios.post('http://127.0.0.1:8000/users/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPasswordSuccess('Password changed successfully!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setPasswordSuccess('');
      }, 2000);
    } catch (error) {
      setPasswordError(error.response?.data?.detail || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>
          
          {/* Avatar */}
          <div className="flex justify-center -mt-12 mb-6">
            <div className="bg-gray-900 rounded-full p-2">
              <div className="bg-blue-500 rounded-full w-24 h-24 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
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
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Full Name</p>
                      <p className="font-semibold">{profile.name || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Email Address</p>
                      <p className="font-semibold">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Phone Number</p>
                      <p className="font-semibold">{profile.phone_number || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Address</p>
                      <p className="font-semibold">{profile.address || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Member Since</p>
                      <p className="font-semibold">{profile.joined_date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Account Type</p>
                      <p className="font-semibold capitalize">Customer</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition"
                  >
                    <Key className="w-4 h-4" />
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
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
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
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Address</label>
                    <textarea
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      rows="3"
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
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
                  setPasswordError('');
                  setPasswordSuccess('');
                  setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {passwordSuccess && (
              <div className="bg-green-500 text-white p-3 rounded-lg mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div className="bg-red-500 text-white p-3 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {saving ? 'Changing...' : 'Change Password'}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordSuccess('');
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