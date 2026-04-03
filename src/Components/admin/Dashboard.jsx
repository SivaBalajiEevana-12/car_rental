import React from "react";
import { useNavigate } from "react-router-dom";
// import AdminLayout from "../components/AdminLayout";
import AdminLayout from "./AdminLayout";

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: "Users", path: "/admin/users" },
    { title: "Vehicles", path: "/admin/vehicles" },
    { title: "Pending Vehicles", path: "/admin/pending-vehicles" },
    { title: "Bookings", path: "/admin/bookings" },
    { title: "Payments", path: "/admin/payments" },
    { title: "Finance", path: "/admin/finance" },
  ];

  return (
    <AdminLayout>

      <h1 className="text-3xl text-yellow-400 mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.path)}
            className="bg-gray-900 p-6 rounded-xl cursor-pointer hover:scale-105 transition"
          >
            <h2 className="text-xl text-yellow-400">
              {card.title}
            </h2>
          </div>
        ))}

      </div>

    </AdminLayout>
  );
}