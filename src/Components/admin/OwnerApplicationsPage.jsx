// src/Components/admin/OwnerApplicationsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Car, 
  CheckCircle, 
  XCircle, 
  Eye, 
  RefreshCw,
  Clock,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  CreditCard,
  Image,
  AlertCircle,
  Search,
  Filter
} from "lucide-react";
import axios from "axios";

const API = "http://127.0.0.1:8000/admin";

export default function OwnerApplicationsPage() {
//   const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewRemarks, setReviewRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let url = `${API}/owner-applications`;
      if (filter === "pending") {
        url = `${API}/owner-applications/pending`;
      }
      const response = await axios.get(url, { headers });
      const apps = response.data || [];
      setApplications(apps);
      setFilteredApps(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  useEffect(() => {
    filterApplications();
  }, [searchTerm, applications]);

  const filterApplications = () => {
    if (!searchTerm) {
      setFilteredApps(applications);
      return;
    }
    const filtered = applications.filter(app => 
      app.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.vehicle_brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.vehicle_model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.vehicle_registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApps(filtered);
  };

  const reviewApplication = async () => {
    if (!selectedApp || !reviewStatus) return;
    
    setActionLoading(true);
    try {
      await axios.put(
        `${API}/owner-applications/${selectedApp.application_id}`,
        { status: reviewStatus, remarks: reviewRemarks },
        { headers }
      );
      fetchApplications();
      setShowReviewModal(false);
      setShowDetailsModal(false);
      setSelectedApp(null);
      setReviewStatus("");
      setReviewRemarks("");
    } catch (error) {
      console.error("Error reviewing application:", error);
      alert(error.response?.data?.detail || "Failed to review application");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-500", border: "border-yellow-500", icon: <Clock className="w-3 h-3" />, label: "Pending" },
      approved: { bg: "bg-green-500/20", text: "text-green-500", border: "border-green-500", icon: <CheckCircle className="w-3 h-3" />, label: "Approved" },
      rejected: { bg: "bg-red-500/20", text: "text-red-500", border: "border-red-500", icon: <XCircle className="w-3 h-3" />, label: "Rejected" }
    };
    return badges[status] || badges.pending;
  };

  const getStats = () => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === "pending").length,
      approved: applications.filter(a => a.status === "approved").length,
      rejected: applications.filter(a => a.status === "rejected").length
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading applications...</div>
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
              <h1 className="text-3xl font-bold">Owner Applications</h1>
              <p className="text-gray-400 mt-1">Review and manage car owner registration requests</p>
            </div>
            <button
              onClick={fetchApplications}
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
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 cursor-pointer" onClick={() => setFilter("all")}>
            <p className="text-white opacity-90 text-sm">Total Applications</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 cursor-pointer" onClick={() => setFilter("pending")}>
            <p className="text-white opacity-90 text-sm">Pending Review</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 cursor-pointer" onClick={() => setFilter("all")}>
            <p className="text-white opacity-90 text-sm">Approved</p>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 cursor-pointer" onClick={() => setFilter("all")}>
            <p className="text-white opacity-90 text-sm">Rejected</p>
            <p className="text-2xl font-bold">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition ${
              filter === "all" 
                ? "bg-purple-500 text-white" 
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            All Applications
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
            Pending Review
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by User ID, Vehicle Brand, Model, or Registration Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No applications found</h3>
            <p className="text-gray-400">
              {filter === "pending" 
                ? "No pending applications to review"
                : "No owner applications have been submitted yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredApps.map((app) => {
              const statusBadge = getStatusBadge(app.status);
              return (
                <div key={app.application_id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/30 transition">
                  {/* Header */}
                  <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-800">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold">
                          {app.vehicle_brand} {app.vehicle_model}
                        </span>
                      </div>
                      <div className={`${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border} px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Application ID</p>
                        <p className="font-mono text-sm">{app.application_id?.slice(-12)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Submitted</p>
                        <p className="text-sm">{new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 pt-4 mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Vehicle Details</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Registration:</span>
                          <p className="font-mono text-xs">{app.vehicle_registration_number}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p>{app.vehicle_type}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Year:</span>
                          <p>{app.vehicle_year}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 pt-4 mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Owner Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>User ID: {app.user_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{app.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{app.phone_number || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setReviewStatus("approved");
                              setShowReviewModal(true);
                            }}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setReviewStatus("rejected");
                              setShowReviewModal(true);
                            }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl p-6 max-w-3xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Application Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Status Banner */}
            <div className={`mb-6 p-4 rounded-lg ${
              selectedApp.status === "pending" ? "bg-yellow-500/20 border border-yellow-500" :
              selectedApp.status === "approved" ? "bg-green-500/20 border border-green-500" :
              "bg-red-500/20 border border-red-500"
            }`}>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedApp.status).icon}
                <span className="font-semibold">Status: {selectedApp.status.toUpperCase()}</span>
              </div>
              {selectedApp.remarks && (
                <p className="text-sm mt-2">Remarks: {selectedApp.remarks}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner Information */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Owner Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">User ID:</span> {selectedApp.user_id}</p>
                  <p><span className="text-gray-400">Email:</span> {selectedApp.email || "N/A"}</p>
                  <p><span className="text-gray-400">Phone:</span> {selectedApp.phone_number || "N/A"}</p>
                  <p><span className="text-gray-400">License Number:</span> {selectedApp.license_number || "N/A"}</p>
                  <p><span className="text-gray-400">Experience:</span> {selectedApp.experience || "N/A"} years</p>
                  <p><span className="text-gray-400">Address:</span> {selectedApp.address || "N/A"}</p>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Car className="w-5 h-5 text-purple-500" />
                  Vehicle Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Brand:</span> {selectedApp.vehicle_brand}</p>
                  <p><span className="text-gray-400">Model:</span> {selectedApp.vehicle_model}</p>
                  <p><span className="text-gray-400">Year:</span> {selectedApp.vehicle_year}</p>
                  <p><span className="text-gray-400">Type:</span> {selectedApp.vehicle_type}</p>
                  <p><span className="text-gray-400">Registration Number:</span> {selectedApp.vehicle_registration_number}</p>
                </div>
              </div>
            </div>

            {/* Document Links */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Documents
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedApp.license_image_url && (
                  <a
                    href={selectedApp.license_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-3 rounded-lg text-center hover:bg-gray-700 transition"
                  >
                    <Image className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">License Image</span>
                  </a>
                )}
                {selectedApp.id_proof_url && (
                  <a
                    href={selectedApp.id_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-3 rounded-lg text-center hover:bg-gray-700 transition"
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">ID Proof</span>
                  </a>
                )}
                {selectedApp.rc_book_url && (
                  <a
                    href={selectedApp.rc_book_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-3 rounded-lg text-center hover:bg-gray-700 transition"
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">RC Book</span>
                  </a>
                )}
                {selectedApp.insurance_url && (
                  <a
                    href={selectedApp.insurance_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-3 rounded-lg text-center hover:bg-gray-700 transition"
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Insurance</span>
                  </a>
                )}
              </div>
            </div>

            {/* Vehicle Images */}
            {selectedApp.vehicle_images && selectedApp.vehicle_images.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Image className="w-5 h-5 text-purple-500" />
                  Vehicle Images
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedApp.vehicle_images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Vehicle ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons in Modal */}
            {selectedApp.status === "pending" && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-800">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setReviewStatus("approved");
                    setShowReviewModal(true);
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                >
                  Approve Application
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setReviewStatus("rejected");
                    setShowReviewModal(true);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                >
                  Reject Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              {reviewStatus === "approved" ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
              <h3 className="text-xl font-bold">
                {reviewStatus === "approved" ? "Approve Application" : "Reject Application"}
              </h3>
            </div>
            
            <p className="text-gray-400 mb-4">
              {reviewStatus === "approved" 
                ? "This will approve the owner application and create a vehicle listing."
                : "This will reject the owner application. Please provide a reason."}
            </p>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">
                {reviewStatus === "approved" ? "Remarks (Optional)" : "Reason for Rejection *"}
              </label>
              <textarea
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                placeholder={reviewStatus === "approved" 
                  ? "Add any remarks for the owner..." 
                  : "Please explain why this application is being rejected..."}
                rows="4"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewStatus("");
                  setReviewRemarks("");
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={reviewApplication}
                disabled={actionLoading || (reviewStatus === "rejected" && !reviewRemarks)}
                className={`px-4 py-2 rounded-lg transition disabled:opacity-50 ${
                  reviewStatus === "approved" 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-red-500 hover:bg-red-600"
                } text-white`}
              >
                {actionLoading ? "Processing..." : (reviewStatus === "approved" ? "Approve" : "Reject")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}