import React, { useEffect, useState } from "react";
import { adminAPI } from "../../Services/adminApi";
import AdminLayout from "./AdminLayout";

export default function VehiclesPage() {

  const token = localStorage.getItem("token");

  // ✅ CREATE API INSTANCE
  const api = adminAPI(token);

  const [vehicles, setVehicles] = useState([]);
  const [view, setView] = useState("all"); // all | pending
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);

      let res;

      if (view === "pending") {
        res = await api.getPendingVehicles();
      } else {
        res = await api.getVehicles();
      }

      setVehicles(res.data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchVehicles();
  }, [view]);

  // 🔹 Approve / Reject
  const verifyVehicle = async (id, status) => {
    try {
      await api.verifyVehicle(id, {
        status: status,
        reason: status === "rejected" ? "Not valid" : null
      });

      fetchVehicles();
    } catch (error) {
      console.error("Verify error:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-gray-950 min-h-screen text-white p-10">

        {/* Header */}
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">
          Vehicles Management
        </h1>

        {/* Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView("all")}
            className={`px-6 py-2 rounded ${
              view === "all"
                ? "bg-yellow-500 text-black"
                : "bg-gray-800"
            }`}
          >
            All Vehicles
          </button>

          <button
            onClick={() => setView("pending")}
            className={`px-6 py-2 rounded ${
              view === "pending"
                ? "bg-yellow-500 text-black"
                : "bg-gray-800"
            }`}
          >
            Pending Approvals
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading...</p>
        ) : vehicles.length === 0 ? (
          <p className="text-gray-400">No vehicles found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {vehicles.map((v) => (
              <div
                key={v._id}
                className="bg-gray-900 p-6 rounded-xl shadow hover:scale-105 transition"
              >
                <h2 className="text-xl font-semibold text-yellow-400">
                  {v.brand} {v.model}
                </h2>

                <p className="text-gray-400 mt-2">
                  Year: {v.year}
                </p>

                <p className="text-gray-400">
                  Price: ${v.price_per_day}/day
                </p>

                <p className="mt-2">
                  Status:{" "}
                  <span className="text-yellow-400">
                    {v.verification_status || "approved"}
                  </span>
                </p>

                {/* Actions (only for pending) */}
                {view === "pending" && (
                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() => verifyVehicle(v._id, "approved")}
                      className="bg-green-500 px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => verifyVehicle(v._id, "rejected")}
                      className="bg-red-500 px-3 py-1 rounded"
                    >
                      Reject
                    </button>

                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </AdminLayout>
  );
}