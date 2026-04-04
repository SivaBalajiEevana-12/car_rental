// src/Components/admin/VehiclesPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Car, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MapPin,
  DollarSign,
  Calendar,
  Fuel,
  Clock
} from "lucide-react";
import { adminAPI } from "../../Services/adminApi";

export default function VehiclesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const api = adminAPI(token);

  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [view, setView] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      let res;
      if (view === "pending") {
        res = await api.getPendingVehicles();
      } else {
        res = await api.getVehicles();
      }
      const vehiclesData = res.data?.data || res.data || [];
      setVehicles(vehiclesData);
      setFilteredVehicles(vehiclesData);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]);
      setFilteredVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchVehicles();
  }, [view]);

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, vehicles]);

  const applyFilters = () => {
    let filtered = [...vehicles];
    
    if (search) {
      filtered = filtered.filter(v => 
        v.brand?.toLowerCase().includes(search.toLowerCase()) ||
        v.model?.toLowerCase().includes(search.toLowerCase()) ||
        v.location?.toLowerCase().includes(search.toLowerCase()) ||
        v._id?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(v => v.verification_status === statusFilter);
    }
    
    setFilteredVehicles(filtered);
  };

  const verifyVehicle = async (id, status) => {
    setActionLoading(true);
    try {
      await api.verifyVehicle(id, {
        status: status,
        reason: status === "rejected" ? "Not meeting platform standards" : null
      });
      fetchVehicles();
    } catch (error) {
      console.error("Verify error:", error);
      alert(error.response?.data?.detail || "Failed to verify vehicle");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteVehicle = async (id) => {
    setActionLoading(true);
    try {
      await api.deleteVehicle(id);
      fetchVehicles();
      setShowDeleteModal(false);
      setSelectedVehicle(null);
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.detail || "Failed to delete vehicle");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { bg: "bg-green-500/20", text: "text-green-500", border: "border-green-500", icon: <CheckCircle className="w-3 h-3" />, label: "Approved" },
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-500", border: "border-yellow-500", icon: <Clock className="w-3 h-3" />, label: "Pending" },
      rejected: { bg: "bg-red-500/20", text: "text-red-500", border: "border-red-500", icon: <XCircle className="w-3 h-3" />, label: "Rejected" },
      info_requested: { bg: "bg-blue-500/20", text: "text-blue-500", border: "border-blue-500", icon: <AlertCircle className="w-3 h-3" />, label: "Info Requested" }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`${badge.bg} ${badge.text} border ${badge.border} px-2 py-0.5 rounded-full text-xs flex items-center gap-1 w-fit`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const getStats = () => {
    return {
      total: vehicles.length,
      approved: vehicles.filter(v => v.verification_status === "approved").length,
      pending: vehicles.filter(v => v.verification_status === "pending").length,
      rejected: vehicles.filter(v => v.verification_status === "rejected").length
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading vehicles...</div>
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
              <h1 className="text-3xl font-bold">Vehicle Management</h1>
              <p className="text-gray-400 mt-1">Manage all vehicle listings across the platform</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchVehicles}
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/admin/add-vehicle")}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition flex items-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 cursor-pointer" onClick={() => setView("all")}>
            <p className="text-white opacity-90 text-sm">Total Vehicles</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 cursor-pointer" onClick={() => setView("all")}>
            <p className="text-white opacity-90 text-sm">Approved</p>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 cursor-pointer" onClick={() => setView("pending")}>
            <p className="text-white opacity-90 text-sm">Pending</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 cursor-pointer" onClick={() => setView("all")}>
            <p className="text-white opacity-90 text-sm">Rejected</p>
            <p className="text-2xl font-bold">{stats.rejected}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setView("all")}
            className={`px-5 py-2 rounded-lg transition font-semibold ${
              view === "all"
                ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/25"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            All Vehicles
          </button>
          <button
            onClick={() => setView("pending")}
            className={`px-5 py-2 rounded-lg transition font-semibold ${
              view === "pending"
                ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/25"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            Pending Approval
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by brand, model, location, or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>
            
            {view === "all" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="info_requested">Info Requested</option>
              </select>
            )}
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-gray-400">
              {search || statusFilter !== "all" 
                ? "Try adjusting your search or filters"
                : view === "pending" 
                  ? "No vehicles pending approval"
                  : "No vehicles have been added yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle._id} className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition duration-300 border border-gray-800">
                {/* Image */}
                <div className="h-48 bg-gray-800 flex items-center justify-center relative">
                  {vehicle.images && vehicle.images[0] ? (
                    <img 
                      src={vehicle.images[0]} 
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Car className="w-16 h-16 text-gray-600" />
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(vehicle.verification_status || "approved")}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{vehicle.year}</span>
                      <span className="mx-1">•</span>
                      <span>{vehicle.vehicle_type || "N/A"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{vehicle.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Fuel className="w-4 h-4" />
                      <span>{vehicle.fuel_type || "N/A"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-500 font-bold text-xl">₹{vehicle.price_per_day?.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm">/day</span>
                    </div>

                    {vehicle.owner_id && (
                      <div className="text-gray-500 text-xs mt-2">
                        Owner ID: {vehicle.owner_id}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    
                    <button
                      onClick={() => navigate(`/admin/vehicles/${vehicle._id}/edit`)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Approval Actions for Pending */}
                  {(view === "pending" || vehicle.verification_status === "pending") && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
                      <button
                        onClick={() => verifyVehicle(vehicle._id, "approved")}
                        disabled={actionLoading}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => verifyVehicle(vehicle._id, "rejected")}
                        disabled={actionLoading}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vehicle Details Modal */}
      {showDetailsModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">
                {selectedVehicle.brand} {selectedVehicle.model}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Images */}
            {selectedVehicle.images && selectedVehicle.images.length > 0 && (
              <div className="mb-4">
                <div className="h-64 bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={selectedVehicle.images[0]} 
                    alt={selectedVehicle.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedVehicle.images.length > 1 && (
                  <div className="flex gap-2 mt-2">
                    {selectedVehicle.images.slice(1, 4).map((img, idx) => (
                      <img key={idx} src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Vehicle ID</p>
                <p className="font-mono text-sm">{selectedVehicle._id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                {getStatusBadge(selectedVehicle.verification_status || "approved")}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Brand</p>
                <p className="font-semibold">{selectedVehicle.brand}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Model</p>
                <p className="font-semibold">{selectedVehicle.model}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Year</p>
                <p className="font-semibold">{selectedVehicle.year}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Vehicle Type</p>
                <p className="font-semibold">{selectedVehicle.vehicle_type || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Fuel Type</p>
                <p className="font-semibold">{selectedVehicle.fuel_type || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Location</p>
                <p className="font-semibold">{selectedVehicle.location}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Price per Day</p>
                <p className="font-bold text-yellow-500 text-xl">₹{selectedVehicle.price_per_day?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Availability</p>
                <p className="text-sm">
                  {selectedVehicle.availability_start?.split("T")[0]} to {selectedVehicle.availability_end?.split("T")[0]}
                </p>
              </div>
              {selectedVehicle.owner_id && (
                <div className="col-span-2">
                  <p className="text-gray-400 text-sm">Owner ID</p>
                  <p className="font-mono">{selectedVehicle.owner_id}</p>
                </div>
              )}
            </div>

            {selectedVehicle.description && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm">Description</p>
                <p className="text-gray-300">{selectedVehicle.description}</p>
              </div>
            )}

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-800">
              <button
                onClick={() => navigate(`/admin/vehicles/${selectedVehicle._id}/edit`)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >
                Edit Vehicle
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
              <h3 className="text-xl font-bold">Delete Vehicle</h3>
            </div>
            <p className="text-gray-400 mb-2">
              Are you sure you want to delete <span className="text-white font-semibold">{selectedVehicle.brand} {selectedVehicle.model}</span>?
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
                onClick={() => deleteVehicle(selectedVehicle._id)}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition disabled:opacity-50"
              >
                {actionLoading ? "Deleting..." : "Delete Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}