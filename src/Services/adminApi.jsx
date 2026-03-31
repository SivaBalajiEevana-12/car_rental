import axios from "axios";

const API = "http://127.0.0.1:8000/admin";

export const adminAPI = (token) => ({
  
  // 👤 USERS
  getUsers: () =>
    axios.get(`${API}/users`, auth(token)),

  getUser: (id) =>
    axios.get(`${API}/users/${id}`, auth(token)),

  searchUsers: (params) =>
    axios.get(`${API}/users/search/`, { ...auth(token), params }),

  createUser: (data) =>
    axios.post(`${API}/users`, data, auth(token)),

  updateUser: (id, data) =>
    axios.put(`${API}/users/${id}`, data, auth(token)),

  assignRole: (id, role) =>
    axios.patch(`${API}/users/${id}/assign-role`, { role }, auth(token)),

  suspendUser: (id, data) =>
    axios.patch(`${API}/users/${id}/suspend`, data, auth(token)),

  activateUser: (id, data) =>
    axios.patch(`${API}/users/${id}/activate`, data, auth(token)),

  deleteUser: (id) =>
    axios.delete(`${API}/users/${id}`, auth(token)),


  // 🚗 VEHICLES
  getVehicles: () =>
    axios.get(`${API}/vehicles`, auth(token)),

  getPendingVehicles: () =>
    axios.get(`${API}/vehicles/pending`, auth(token)),

  verifyVehicle: (id, data) =>
    axios.patch(`${API}/vehicles/${id}/verify`, data, auth(token)),


  // 📅 BOOKINGS
  getBookings: () =>
    axios.get(`${API}/bookings`, auth(token)),

  bookingAction: (id, data) =>
    axios.patch(`${API}/bookings/${id}/action`, data, auth(token)),


  // 💰 PAYMENTS
  getPayments: () =>
    axios.get(`${API}/payments`, auth(token)),

  flagPayment: (id, data) =>
    axios.patch(`${API}/payments/${id}/flag`, data, auth(token)),


  // 📊 FINANCE
  getRevenue: () =>
    axios.get(`${API}/finance/revenue-summary`, auth(token)),

  getCommission: () =>
    axios.get(`${API}/finance/platform-commission`, auth(token)),

  getReport: () =>
    axios.get(`${API}/finance/report`, auth(token)),


  // 🔐 ROLES
  getRoles: () =>
    axios.get(`${API}/roles`, auth(token)),

  createRole: (data) =>
    axios.post(`${API}/roles`, data, auth(token)),

  updateRole: (id, data) =>
    axios.put(`${API}/roles/${id}`, data, auth(token)),


  // 📜 AUDIT LOGS
  getLogs: () =>
    axios.get(`${API}/audit-logs`, auth(token)),

  searchLogs: (keyword) =>
    axios.get(`${API}/audit-logs/search`, {
      ...auth(token),
      params: { keyword }
    }),

  flagLog: (id, data) =>
    axios.patch(`${API}/audit-logs/${id}/flag`, data, auth(token)),


  // 🔔 NOTIFICATIONS
  sendNotification: (data) =>
    axios.post(`${API}/notifications`, data, auth(token)),

  getNotifications: () =>
    axios.get(`${API}/notifications`, auth(token))
});

const auth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});