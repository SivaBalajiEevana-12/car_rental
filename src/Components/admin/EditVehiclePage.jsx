// src/Components/admin/EditVehiclePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Car, 
  Save, 
  ArrowLeft, 
  Plus, 
  X, 
  Trash2, 
  AlertCircle,
  CheckCircle
} from "lucide-react";
import axios from "axios";

const API = "http://127.0.0.1:8000/admin";

export default function EditVehiclePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  
  const [formData, setFormData] = useState({
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
    images: []
  });
  
  const [newImageUrls, setNewImageUrls] = useState([""]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'MUV', 'Convertible', 'Truck', 'Van'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    setLoading(true);
    try {
        console.log("images to delete:", imagesToDelete);
      const response = await axios.get(`${API}/vehicles/${id}`, { headers });
      const vehicle = response.data;
      
      setFormData({
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        year: vehicle.year || "",
        vehicle_type: vehicle.vehicle_type || "",
        fuel_type: vehicle.fuel_type || "",
        location: vehicle.location || "",
        price_per_day: vehicle.price_per_day || "",
        availability_start: vehicle.availability_start ? vehicle.availability_start.split('T')[0] : "",
        availability_end: vehicle.availability_end ? vehicle.availability_end.split('T')[0] : "",
        description: vehicle.description || "",
        images: vehicle.images || []
      });
      setExistingImages(vehicle.images || []);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      setMessageType("error");
      setMessage(error.response?.data?.detail || "Failed to load vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNewImageUrlChange = (index, value) => {
    const newUrls = [...newImageUrls];
    newUrls[index] = value;
    setNewImageUrls(newUrls);
  };

  const addNewImageField = () => {
    setNewImageUrls([...newImageUrls, ""]);
  };

  const removeNewImageField = (index) => {
    if (newImageUrls.length > 1) {
      const newUrls = newImageUrls.filter((_, i) => i !== index);
      setNewImageUrls(newUrls);
    }
  };

  const removeExistingImage = (indexToRemove) => {
    const imageToDelete = existingImages[indexToRemove];
    setImagesToDelete(prev => [...prev, imageToDelete]);
    const updatedImages = existingImages.filter((_, index) => index !== indexToRemove);
    setExistingImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setMessageType("");

    // Filter out empty new image URLs
    const validNewImages = newImageUrls.filter(url => url.trim() !== "");
    
    // Combine existing images (excluding deleted ones) with new images
    const allImages = [...existingImages, ...validNewImages];
    
    const updateData = {
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year),
      vehicle_type: formData.vehicle_type,
      fuel_type: formData.fuel_type,
      location: formData.location,
      price_per_day: parseFloat(formData.price_per_day),
      availability_start: formData.availability_start,
      availability_end: formData.availability_end,
      description: formData.description,
      images: allImages
    };

    try {
      await axios.put(`${API}/vehicles/${id}`, updateData, { headers });
      setMessageType("success");
      setMessage("Vehicle updated successfully!");
      
      setTimeout(() => {
        navigate("/admin/vehicles");
      }, 1500);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      setMessageType("error");
      setMessage(error.response?.data?.detail || "Failed to update vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading vehicle details...</div>
        </div>
      </div>
    );
  }

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
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Edit Vehicle</h1>
              <p className="text-gray-400 mt-1">
                Update details for {formData.brand} {formData.model}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message */}
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
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
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
                  value={formData.year}
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
                  value={formData.vehicle_type}
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
                  value={formData.fuel_type}
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
                  type="text"
                  name="location"
                  value={formData.location}
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
                  value={formData.price_per_day}
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
                  value={formData.availability_start}
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
                  value={formData.availability_end}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-500">Current Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Vehicle ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-3">Click on the ✕ to remove images</p>
            </div>
          )}

          {/* Add New Images */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-500">Add New Images</h2>
            <p className="text-gray-400 text-sm mb-4">Add additional image URLs of the vehicle</p>
            
            {newImageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleNewImageUrlChange(index, e.target.value)}
                  className="flex-1 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  placeholder="https://example.com/vehicle-image.jpg"
                />
                {index === newImageUrls.length - 1 ? (
                  <button
                    type="button"
                    onClick={addNewImageField}
                    className="bg-green-500 hover:bg-green-600 px-4 rounded-lg transition text-white"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeNewImageField(index)}
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
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
              placeholder="Describe the vehicle features, condition, and any special notes..."
            />
          </div>

          {/* Form Actions */}
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
              disabled={submitting}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}