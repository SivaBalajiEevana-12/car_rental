// src/services/customerApi.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/customer';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

// Vehicle APIs
export const vehicleApi = {
  searchVehicles: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.fuel_type) params.append('fuel_type', filters.fuel_type);
    if (filters.vehicle_type) params.append('vehicle_type', filters.vehicle_type);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    
    const response = await axios.get(`${API_BASE_URL}/vehicles/search?${params.toString()}`, getAuthHeader());
    return response.data;
  },

  getVehicleDetails: async (vehicleId) => {
    const response = await axios.get(`${API_BASE_URL}/vehicles/${vehicleId}`, getAuthHeader());
    return response.data;
  }
};

// Booking APIs
export const bookingApi = {
  createBooking: async (bookingData) => {
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData, getAuthHeader());
    return response.data;
  },

  getMyBookings: async (status = null) => {
    let url = `${API_BASE_URL}/bookings`;
    if (status) {
      url += `?status=${status}`;
    }
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  },

  getBookingDetails: async (bookingId) => {
    const response = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`, getAuthHeader());
    return response.data;
  },

  modifyBooking: async (bookingId, modifyData) => {
    const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/modify`, modifyData, getAuthHeader());
    return response.data;
  },

  cancelBooking: async (bookingId) => {
    const response = await axios.patch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {}, getAuthHeader());
    return response.data;
  }
};

// Payment APIs
export const paymentApi = {
  processPayment: async (paymentData) => {
    const response = await axios.post(`${API_BASE_URL}/payments`, paymentData, getAuthHeader());
    return response.data;
  },

  getMyPayments: async () => {
    const response = await axios.get(`${API_BASE_URL}/payments`, getAuthHeader());
    return response.data;
  },

  getPaymentReceipt: async (paymentId) => {
    const response = await axios.get(`${API_BASE_URL}/payments/${paymentId}`, getAuthHeader());
    return response.data;
  }
};

// Notification APIs
export const notificationApi = {
  getMyNotifications: async () => {
    const response = await axios.get(`${API_BASE_URL}/notifications`, getAuthHeader());
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await axios.patch(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, getAuthHeader());
    return response.data;
  }
};
export const profileApi = {
  getProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/profile`, getAuthHeader());
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axios.put(`${API_BASE_URL}/profile`, profileData, getAuthHeader());
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axios.post(`${API_BASE_URL}/change-password`, passwordData, getAuthHeader());
    return response.data;
  }
};