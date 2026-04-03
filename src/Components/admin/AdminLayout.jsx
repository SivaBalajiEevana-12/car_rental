import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
{/* <Route path="/admin" element={<Dashboard />} />
<Route path="/admin/add-vehicle" element={<AddVehiclePage />} />
<Route path="/admin/pending-vehicles" element={<PendingVehiclesPage />} />
<Route path="/admin/finance" element={<FinanceDashboard />} /> */}
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">

      {/* 🔥 SIDEBAR */}
      <div className="w-64 bg-gray-900 p-6">

        <h1 className="text-2xl font-bold text-yellow-400 mb-10">
          Admin Panel
        </h1>

        <nav className="flex flex-col gap-3">

          <button onClick={() => navigate("/admin/add-vehicle")} className="nav-btn">
            Add Vehicle
          </button>
          <button onClick={() => navigate("/admin/pending-vehicles")} className="nav-btn">
           pending-vehicles
          </button>
          <button onClick={() => navigate("/admin/finance")} className="nav-btn">
            FinanceDashboard
          </button>
          <button onClick={() => navigate("/admin")} className="nav-btn">
            Dashboard
          </button>

          <button onClick={() => navigate("/admin/users")} className="nav-btn">
            Users
          </button>

          <button onClick={() => navigate("/admin/vehicles")} className="nav-btn">
            Vehicles
          </button>

          <button onClick={() => navigate("/admin/bookings")} className="nav-btn">
            Bookings
          </button>

          <button onClick={() => navigate("/admin/payments")} className="nav-btn">
            Payments
          </button>

          <button onClick={() => navigate("/admin/roles")} className="nav-btn">
            Roles
          </button>

          <button onClick={() => navigate("/admin/logs")} className="nav-btn">
            Audit Logs
          </button>

          <button onClick={() => navigate("/admin/notifications")} className="nav-btn">
            Notifications
          </button>

        </nav>
      </div>

      {/* 🔥 MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* 🔥 TOP NAVBAR */}
        <div className="flex justify-between items-center bg-gray-900 px-8 py-4 border-b border-gray-800">

          <h2 className="text-lg font-semibold text-gray-300">
            Admin Dashboard
          </h2>

          <div className="flex gap-4">

            <button
              onClick={() => navigate("/")}
              className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Site
            </button>

            <button
              onClick={handleLogout}
              className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400"
            >
              Logout
            </button>

          </div>
        </div>

        {/* 🔥 PAGE CONTENT */}
        <div className="p-8">
          {children}
        </div>

      </div>
    </div>
  );
}