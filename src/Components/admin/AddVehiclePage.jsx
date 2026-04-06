// src/Components/admin/AddVehiclePage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Car, Plus, X, AlertCircle, CheckCircle } from "lucide-react";

const API = "http://127.0.0.1:8000/admin";

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
    description: "",
    images: [],
     vehicle_registration_number: "",  // ✅ ADD THIS
    rc_book_url: "",                  // ✅ ADD THIS
    insurance_url: "",   
  });

  const [imageUrls, setImageUrls] = useState([""]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'MUV', 'Convertible', 'Truck', 'Van'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrlField = (index) => {
    if (imageUrls.length > 1) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    // Filter out empty image URLs
    const validImageUrls = imageUrls.filter(url => url.trim() !== "");

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
          images: validImageUrls,
          description: form.description,
          vehicle_registration_number: form.vehicle_registration_number,  // ✅ ADD THIS
                rc_book_url: form.rc_book_url,                                  // ✅ ADD THIS
                insurance_url: form.insurance_url, 
        },
        { headers }
      );

      setMessageType("success");
      setMessage("✅ Vehicle added successfully!");

      // Reset form
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
        description: "",
        images: [],
         vehicle_registration_number: "",  // ✅ ADD THIS
    rc_book_url: "",                  // ✅ ADD THIS
    insurance_url: "", 
      });
      setImageUrls([""]);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin/vehicles");
      }, 2000);

    } catch (error) {
      setMessageType("error");
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/vehicles")}
              className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-800 rounded-lg"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold">Add New Vehicle</h1>
              <p className="text-gray-400 mt-1">Fill in the details to add a vehicle to the fleet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success/Error Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              messageType === "success" 
                ? "bg-green-500 text-white" 
                : "bg-red-500 text-white"
            }`}>
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-500">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Brand *</label>
                <input
                  name="brand"
                  placeholder="e.g., Toyota, Honda, BMW"
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Model *</label>
                <input
                  name="model"
                  placeholder="e.g., Camry, Civic, X5"
                  value={form.model}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Year *</label>
                <input
                  type="number"
                  name="year"
                  placeholder="e.g., 2022"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  min={1990}
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Vehicle Type *</label>
                <select
                  name="vehicle_type"
                  value={form.vehicle_type}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  required
                >
                  <option value="">Select type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Fuel Type *</label>
                <select
                  name="fuel_type"
                  value={form.fuel_type}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  required
                >
                  <option value="">Select fuel type</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Location *</label>
                <input
                  name="location"
                  placeholder="e.g., New York, Los Angeles"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Price per Day (₹) *</label>
                <input
                  type="number"
                  name="price_per_day"
                  placeholder="e.g., 2500"
                  value={form.price_per_day}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  min={0}
                  step={100}
                  required
                />
              </div>
            </div>
          </div>

          {/* Availability Dates */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-500">Availability Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Available From *</label>
                <input
                  type="date"
                  name="availability_start"
                  value={form.availability_start}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Available Until *</label>
                <input
                  type="date"
                  name="availability_end"
                  value={form.availability_end}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-500">Vehicle Images</h2>
            <p className="text-gray-400 text-sm mb-4">Add image URLs of the vehicle (optional but recommended)</p>

            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  className="flex-1 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  placeholder="https://example.com/vehicle-image.jpg"
                />
                {index === imageUrls.length - 1 ? (
                  <button
                    type="button"
                    onClick={addImageUrlField}
                    className="bg-green-500 hover:bg-green-600 px-4 rounded-lg transition text-white"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeImageUrlField(index)}
                    className="bg-red-500 hover:bg-red-600 px-4 rounded-lg transition text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-500">Description</h2>
            <textarea
              name="description"
              placeholder="Describe the vehicle features, condition, and any special notes..."
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
              required
            />
          </div>
          {/* Vehicle Documents */}
<div className="bg-gray-900 rounded-xl p-6">
    <h2 className="text-xl font-semibold mb-4 text-purple-500">Vehicle Documents</h2>
    <div className="grid grid-cols-1 gap-4">
        <div>
            <label className="block text-sm text-gray-400 mb-1">
                Vehicle Registration Number *
            </label>
            <input
                name="vehicle_registration_number"
                placeholder="e.g., KA01AB1234"
                value={form.vehicle_registration_number}
                onChange={handleChange}
                className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
            />
        </div>

        <div>
            <label className="block text-sm text-gray-400 mb-1">
                RC Book URL *
            </label>
            <input
                type="url"
                name="rc_book_url"
                placeholder="https://example.com/rc-book.pdf"
                value={form.rc_book_url}
                onChange={handleChange}
                className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
            />
        </div>

        <div>
            <label className="block text-sm text-gray-400 mb-1">
                Insurance URL *
            </label>
            <input
                type="url"
                name="insurance_url"
                placeholder="https://example.com/insurance.pdf"
                value={form.insurance_url}
                onChange={handleChange}
                className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
            />
        </div>
    </div>
</div>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end sticky bottom-0 bg-gray-950 py-4">
            <button
              type="button"
              onClick={() => navigate("/admin/vehicles")}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Vehicle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}