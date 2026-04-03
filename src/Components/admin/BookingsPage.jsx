import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { adminAPI } from "../../Services/adminApi";
// import AdminLayout from "./AdminLayout";

export default function BookingsPage() {
  const token = useSelector((state) => state.auth.token)||  localStorage.getItem("token");
  const api = adminAPI(token);

  const [bookings, setBookings] = useState([]);

  // 🔹 Fetch bookings
 const fetchBookings = async () => {
  try {
    const res = await api.getBookings();

    // 🔥 FIX: normalize response
    if (Array.isArray(res.data)) {
      setBookings(res.data);
    } else {
      setBookings(res.data.data || []);
    }

  } catch (error) {
    console.error("Error fetching bookings:", error);
    setBookings([]);
  }
};

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔹 Approve / Reject
  const handleAction = async (id, status) => {
    await api.bookingAction(id, { status });
    fetchBookings();
  };

  return (
    
    <div className="bg-gray-950 min-h-screen text-white p-10">

      {/* Header */}
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Bookings Management
      </h1>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full bg-gray-900 rounded-xl">

          <thead className="bg-gray-800">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4">Vehicle</th>
              <th className="p-4">From</th>
              <th className="p-4">To</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

<tbody>
  {bookings.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center p-4 text-gray-400">
        No bookings found
      </td>
    </tr>
  ) : (
    bookings.map((b) => (
      <tr key={b._id} className="border-b border-gray-800">

        <td className="p-4">{b.user_id}</td>

        <td className="p-4">{b.vehicle_id}</td>

        <td className="p-4">
          {new Date(b.start_date).toLocaleDateString()}
        </td>

        <td className="p-4">
          {new Date(b.end_date).toLocaleDateString()}
        </td>

        <td className="p-4 text-yellow-400">
          {b.status}
        </td>

        <td className="p-4 flex gap-2">

          <button
            onClick={() => handleAction(b._id, "approved")}
            className="bg-green-500 px-3 py-1 rounded"
          >
            Approve
          </button>

          <button
            onClick={() => handleAction(b._id, "rejected")}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Reject
          </button>

        </td>

      </tr>
    ))
  )}
</tbody>
        </table>

      </div>
    </div>
  
  );
}