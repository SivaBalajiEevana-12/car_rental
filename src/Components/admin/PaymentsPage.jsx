import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { adminAPI } from "../../Services/adminApi";
import AdminLayout from "./AdminLayout";

export default function PaymentsPage() {
  const token = useSelector((state) => state.auth.token);
  const api = adminAPI(token);

  const [payments, setPayments] = useState([]);

  // 🔹 Fetch payments
  const fetchPayments = async () => {
    const res = await api.getPayments();
    setPayments(res.data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // 🔹 Flag transaction
  const flagPayment = async (id, current) => {
    await api.flagPayment(id, {
      flagged: !current,
      reason: "Suspicious activity"
    });

    fetchPayments();
  };

  return (
    <AdminLayout>
    <div className="bg-gray-950 min-h-screen text-white p-10">

      {/* Header */}
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Payments & Transactions
      </h1>

      <div className="overflow-x-auto">

        <table className="w-full bg-gray-900 rounded-xl">

          <thead className="bg-gray-800">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Flagged</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b border-gray-800">

                <td className="p-4">{p.user_id}</td>

                <td className="p-4 text-yellow-400 font-semibold">
                  ₹{p.amount}
                </td>

                <td className="p-4">
                  {p.status}
                </td>

                <td className="p-4">
                  {p.flagged ? "🚫 Yes" : "✔ No"}
                </td>

                <td className="p-4">

                  <button
                    onClick={() => flagPayment(p._id, p.flagged)}
                    className="bg-red-500 px-3 py-1 rounded"
                  >
                    {p.flagged ? "Unflag" : "Flag"}
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
    </AdminLayout>
  );
}