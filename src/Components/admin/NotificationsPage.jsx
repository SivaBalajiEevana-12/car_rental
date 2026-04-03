import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { adminAPI } from "../../Services/adminApi";
import AdminLayout from "./AdminLayout";

export default function NotificationsPage() {
  // const token = useSelector((state) => state.auth.token);
  const token = useSelector((state) => state.auth.token)||  localStorage.getItem("token")
  const api = adminAPI(token);

  const [notifications, setNotifications] = useState([]);

  const [form, setForm] = useState({
    user_id: "",
    title: "",
    message: ""
  });

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    const res = await api.getNotifications();
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 🔹 Handle form change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Send notification
  const sendNotification = async () => {
    if (!form.user_id || !form.title || !form.message) return;

    await api.sendNotification(form);

    setForm({ user_id: "", title: "", message: "" });
    fetchNotifications();
  };

  return (
    <AdminLayout>
    <div className="bg-gray-950 min-h-screen text-white p-10">

      {/* Header */}
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Notifications
      </h1>

      {/* Send Notification */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8">

        <h2 className="text-xl mb-4">Send Notification</h2>

        <input
          name="user_id"
          placeholder="User ID"
          value={form.user_id}
          onChange={handleChange}
          className="bg-gray-800 p-3 rounded w-full mb-3"
        />

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="bg-gray-800 p-3 rounded w-full mb-3"
        />

        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          className="bg-gray-800 p-3 rounded w-full mb-3"
        />

        <button
          onClick={sendNotification}
          className="bg-yellow-500 text-black px-6 py-2 rounded"
        >
          Send
        </button>

      </div>

      {/* Notifications List */}
      <div className="space-y-4">

        {notifications.map((n) => (
          <div
            key={n._id}
            className="bg-gray-900 p-6 rounded-xl"
          >

            <h2 className="text-yellow-400 font-semibold">
              {n.title}
            </h2>

            <p className="text-gray-400 mt-2">
              {n.message}
            </p>

            <p className="text-sm mt-3">
              To: {n.user_id}
            </p>

            <p className="text-sm text-gray-500">
              {new Date(n.created_at).toLocaleString()}
            </p>

          </div>
        ))}

      </div>
    </div>
    </AdminLayout>
  );
}