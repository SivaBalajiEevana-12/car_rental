// src/Components/admin/PendingVehiclesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Car, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Calendar,
  MapPin,
  Fuel,
  DollarSign,
  User,
  Eye,
  RefreshCw,
  Clock,
  Info,
  MessageSquare
} from "lucide-react";

const API = "http://127.0.0.1:8000/admin";

export default function PendingVehiclesPage() {
  const token = localStorage.getItem("token");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/vehicles/pending`, { headers });
      const vehicleData = res.data?.data || res.data || [];
      setVehicles(vehicleData);
    } catch (error) {
      console.error("Error fetching pending vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const verifyVehicle = async (id, status, reason = null) => {
    setActionLoading(true);
    try {
      await axios.patch(
        `${API}/vehicles/${id}/verify`,
        { status, reason },
        { headers }
      );
      fetchVehicles();
      setShowRejectModal(false);
      setShowInfoModal(false);
      setRejectReason("");
      setInfoMessage("");
      setSelectedVehicle(null);
    } catch (error) {
      console.error("Error verifying vehicle:", error);
      alert(error.response?.data?.detail || "Failed to update vehicle status");
    } finally {
      setActionLoading(false);
    }
  };

  const requestAdditionalInfo = async (vehicleId, message) => {
    setActionLoading(true);
    try {
      await axios.post(
        `${API}/vehicles/request-info`,
        { vehicle_id: vehicleId, message },
        { headers }
      );
      alert("Information request sent to vehicle owner");
      setShowInfoModal(false);
      setInfoMessage("");
      setSelectedVehicle(null);
    } catch (error) {
      console.error("Error requesting info:", error);
      alert(error.response?.data?.detail || "Failed to send request");
    } finally {
      setActionLoading(false);
    }
  };

  const getVehicleTypeIcon = (type) => {
    const types = {
      Sedan: "🚗",
      SUV: "🚙",
      Hatchback: "🚘",
      Luxury: "🏎️",
      MUV: "🚐",
      Convertible: "🏎️"
    };
    return types[type] || "🚗";
  };

  const getFuelTypeIcon = (type) => {
    const types = {
      Petrol: "⛽",
      Diesel: "⛽",
      Electric: "⚡",
      Hybrid: "🔋"
    };
    return types[type] || "⛽";
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filter === "all") return true;
    return vehicle.verification_status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading pending vehicles...</div>
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
              <h1 className="text-3xl font-bold">Pending Vehicle Approvals</h1>
              <p className="text-gray-400 mt-1">Review and manage vehicle listings awaiting verification</p>
            </div>
            <button
              onClick={fetchVehicles}
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
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Pending Review</p>
            <p className="text-2xl font-bold">{vehicles.filter(v => v.verification_status === "pending").length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Approved</p>
            <p className="text-2xl font-bold">{vehicles.filter(v => v.verification_status === "approved").length}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4">
            <p className="text-white opacity-90 text-sm">Rejected</p>
            <p className="text-2xl font-bold">{vehicles.filter(v => v.verification_status === "rejected").length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "all" 
                ? "bg-yellow-500 text-black" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            All ({vehicles.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              filter === "pending" 
                ? "bg-yellow-500 text-black" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending ({vehicles.filter(v => v.verification_status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("info_requested")}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              filter === "info_requested" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <Info className="w-4 h-4" />
            Info Requested ({vehicles.filter(v => v.verification_status === "info_requested").length})
          </button>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No pending vehicles</h3>
            <p className="text-gray-400">All vehicle listings have been reviewed</p>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      vehicle.verification_status === "pending" ? "bg-yellow-500 text-black" :
                      vehicle.verification_status === "approved" ? "bg-green-500 text-white" :
                      vehicle.verification_status === "info_requested" ? "bg-blue-500 text-white" :
                      "bg-red-500 text-white"
                    }`}>
                      {vehicle.verification_status?.replace("_", " ")}
                    </span>
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
                      <span>{getVehicleTypeIcon(vehicle.vehicle_type)}</span>
                      <span>{vehicle.vehicle_type}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{vehicle.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Fuel className="w-4 h-4" />
                      <span>{vehicle.fuel_type}</span>
                      <span className="mx-1">•</span>
                      <span>{getFuelTypeIcon(vehicle.fuel_type)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-yellow-500 font-bold">₹{vehicle.price_per_day?.toLocaleString()}</span>
                      <span>/day</span>
                    </div>

                    {vehicle.owner_id && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <User className="w-4 h-4" />
                        <span className="font-mono text-xs">Owner: {vehicle.owner_id}</span>
                      </div>
                    )}
                  </div>

                  {vehicle.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {vehicle.description}
                    </p>
                  )}

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
                      View Details
                    </button>
                    
                    {vehicle.verification_status === "pending" && (
                      <>
                        <button
                          onClick={() => verifyVehicle(vehicle._id, "approved")}
                          disabled={actionLoading}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setShowRejectModal(true);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setShowInfoModal(true);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition flex items-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Request Info
                        </button>
                      </>
                    )}
                  </div>
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
                <p className="font-semibold">{selectedVehicle.vehicle_type}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Fuel Type</p>
                <p className="font-semibold">{selectedVehicle.fuel_type}</p>
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
                <p className="font-semibold text-sm">
                  {selectedVehicle.availability_start?.split("T")[0]} to {selectedVehicle.availability_end?.split("T")[0]}
                </p>
              </div>
            </div>

            {selectedVehicle.description && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm">Description</p>
                <p className="text-gray-300">{selectedVehicle.description}</p>
              </div>
            )}

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  verifyVehicle(selectedVehicle._id, "approved");
                  setShowDetailsModal(false);
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowRejectModal(true);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowInfoModal(true);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
              >
                Request Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
              <h3 className="text-xl font-bold">Reject Vehicle Listing</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Vehicle: <span className="text-white font-semibold">{selectedVehicle.brand} {selectedVehicle.model}</span>
            </p>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Reason for rejection (optional)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none resize-none"
                rows="3"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => verifyVehicle(selectedVehicle._id, "rejected", rejectReason)}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                {actionLoading ? "Processing..." : "Reject Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Info Modal */}
      {showInfoModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-8 h-8 text-blue-500" />
              <h3 className="text-xl font-bold">Request Additional Information</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Vehicle: <span className="text-white font-semibold">{selectedVehicle.brand} {selectedVehicle.model}</span>
            </p>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Message to Owner</label>
              <textarea
                value={infoMessage}
                onChange={(e) => setInfoMessage(e.target.value)}
                placeholder="What additional information do you need from the vehicle owner?"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                rows="4"
                required
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowInfoModal(false);
                  setInfoMessage("");
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => requestAdditionalInfo(selectedVehicle._id, infoMessage)}
                disabled={actionLoading || !infoMessage.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition disabled:opacity-50"
              >
                {actionLoading ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}