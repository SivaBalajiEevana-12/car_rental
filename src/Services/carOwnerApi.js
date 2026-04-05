// src/services/carOwnerApi.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/car-owner';

// Helper to get auth token
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
  // Add new vehicle
  addVehicle: async (vehicleData) => {
    const response = await axios.post(
      `${API_BASE_URL}/vehicles`,
      vehicleData,
      getAuthHeader()
    );
    return response.data;
  },

  // Get all my vehicles
  getMyVehicles: async (status = null) => {
    const url = status 
      ? `${API_BASE_URL}/vehicles?status=${status}`
      : `${API_BASE_URL}/vehicles`;
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  },

  // Get single vehicle
  getVehicle: async (vehicleId) => {
    const response = await axios.get(
      `${API_BASE_URL}/vehicles/${vehicleId}`,
      getAuthHeader()
    );
    return response.data;
  },

  // Update vehicle
  updateVehicle: async (vehicleId, updateData) => {
    const response = await axios.put(
      `${API_BASE_URL}/vehicles/${vehicleId}`,
      updateData,
      getAuthHeader()
    );
    return response.data;
  },

  // Upload images
  uploadImages: async (vehicleId, imageUrls) => {
    const response = await axios.patch(
      `${API_BASE_URL}/vehicles/${vehicleId}/images`,
      { image_urls: imageUrls },
      getAuthHeader()
    );
    return response.data;
  },

  // Activate vehicle
  activateVehicle: async (vehicleId) => {
    const response = await axios.patch(
      `${API_BASE_URL}/vehicles/${vehicleId}/activate`,
      {},
      getAuthHeader()
    );
    return response.data;
  },
// Add to src/services/carOwnerApi.js

// Update booking status (you'll need to create this endpoint in your backend)
updateBookingStatus: async (bookingId, status) => {
  const response = await axios.patch(
    `${API_BASE_URL}/bookings/${bookingId}/status`,
    { status },
    getAuthHeader()
  );
  return response.data;
},
  // Deactivate vehicle
  deactivateVehicle: async (vehicleId) => {
    const response = await axios.patch(
      `${API_BASE_URL}/vehicles/${vehicleId}/deactivate`,
      {},
      getAuthHeader()
    );
    return response.data;
  },

  // Delete vehicle
  deleteVehicle: async (vehicleId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/vehicles/${vehicleId}`,
      getAuthHeader()
    );
    return response.data;
  }
};

// Booking APIs
export const bookingApi = {
  // Get owner bookings
  getOwnerBookings: async (status = null, sortBy = 'created_at', order = 'desc') => {
    let url = `${API_BASE_URL}/bookings?sort_by=${sortBy}&order=${order}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  },

  // Get booking detail
  getBookingDetail: async (bookingId) => {
    const response = await axios.get(
      `${API_BASE_URL}/bookings/${bookingId}`,
      getAuthHeader()
    );
    return response.data;
  }
};

// Earnings APIs
export const earningsApi = {
  // Get earnings
  getEarnings: async (startDate = null, endDate = null) => {
    let url = `${API_BASE_URL}/earnings`;
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  },

  // Generate report
  generateReport: async (startDate = null, endDate = null) => {
    let url = `${API_BASE_URL}/earnings/report`;
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  }
};

// Analytics API
export const analyticsApi = {
  getAnalytics: async (startDate = null, endDate = null) => {
    let url = `${API_BASE_URL}/analytics`;
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  }
};
// Add to src/Services/customerApi.js

// Profile APIs
