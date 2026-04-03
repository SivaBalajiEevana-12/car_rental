import React, { useState } from "react";
import axios from "axios";
// import { useSelector } from "react-redux";
// import AdminLayout from "./AdminLayout";

const API = "http://127.0.0.1:8000/admin";

export default function AddVehiclePage() {
//   const token = useSelector((state) => state.auth.token);
const token = localStorage.getItem("token"); // 🔹 FIXED TOKEN RETRIEVAL

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    vehicle_type: "",
    fuel_type: "",
    location: "",
    price_per_day: "",
    availability_start: "",
    availability_end: "",
    description: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        `${API}/vehicles`,
        {
          brand: form.brand,
          model: form.model,
          year: Number(form.year),
          vehicle_type: form.vehicle_type,
          fuel_type: form.fuel_type,
          location: form.location,
          price_per_day: Number(form.price_per_day),
          availability_start: form.availability_start,
          availability_end: form.availability_end,
          images: [], // required by backend
          description: form.description
        },
        { headers }
      );

      setMessage("✅ Vehicle added successfully");

      setForm({
        brand: "",
        model: "",
        year: "",
        vehicle_type: "",
        fuel_type: "",
        location: "",
        price_per_day: "",
        availability_start: "",
        availability_end: "",
        description: ""
      });

    } catch (error) {
      // 🔥 FIXED ERROR HANDLING
      if (error.response?.data?.detail) {
        const errors = Array.isArray(error.response.data.detail)
          ? error.response.data.detail.map(e => e.msg).join(", ")
          : error.response.data.detail;

        setMessage(errors);
      } else {
        setMessage("❌ Failed to add vehicle");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl text-yellow-400 mb-6">
          Add Vehicle
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-6 rounded-xl space-y-4"
        >

          {/* BASIC INFO */}
          <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded" required />

          <input name="model" placeholder="Model" value={form.model} onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded" required />

          <input type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded" required />

          {/* VEHICLE DETAILS */}
          <input name="vehicle_type" placeholder="Vehicle Type (SUV, Sedan...)" value={form.vehicle_type}
            onChange={handleChange} className="w-full p-3 bg-gray-800 rounded" required />

          <input name="fuel_type" placeholder="Fuel Type (Petrol, Diesel...)" value={form.fuel_type}
            onChange={handleChange} className="w-full p-3 bg-gray-800 rounded" required />

          <input name="location" placeholder="Location" value={form.location}
            onChange={handleChange} className="w-full p-3 bg-gray-800 rounded" required />

          {/* PRICING */}
          <input type="number" name="price_per_day" placeholder="Price per day"
            value={form.price_per_day} onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded" required />

          {/* AVAILABILITY */}
          <div className="flex gap-4">
            <input type="date" name="availability_start"
              value={form.availability_start} onChange={handleChange}
              className="w-full p-3 bg-gray-800 rounded" required />

            <input type="date" name="availability_end"
              value={form.availability_end} onChange={handleChange}
              className="w-full p-3 bg-gray-800 rounded" required />
          </div>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded"
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-3 rounded font-semibold hover:bg-yellow-400"
          >
            {loading ? "Adding..." : "Add Vehicle"}
          </button>

          {/* MESSAGE */}
          {message && (
            <p className="text-center mt-2 text-sm">{message}</p>
          )}

        </form>

      </div>

  
  );
}