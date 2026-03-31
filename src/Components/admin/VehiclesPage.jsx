import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { adminAPI } from "../../Services/adminApi";
import AdminLayout from "./AdminLayout";

export default function VehiclesPage() {
  const token = useSelector((state) => state.auth.token);
  const api = adminAPI(token);

  const [vehicles, setVehicles] = useState([]);
  const [view, setView] = useState("all"); // all | pending

  // 🔹 Fetch vehicles
  const fetchVehicles = async () => {
    if (view === "pending") {
      const res = await api.getPendingVehicles();
      setVehicles(res.data);
    } else {
      const res = await api.getVehicles();
      setVehicles(res.data);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [view]);

  // 🔹 Approve / Reject
  const verifyVehicle = async (id, status) => {
    await api.verifyVehicle(id, {
      status: status,
      reason: status === "rejected" ? "Not valid" : null
    });

    fetchVehicles();
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

      {/* Grid */}
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
                {v.status || "pending"}
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
    </div>
    </AdminLayout>
  );
}