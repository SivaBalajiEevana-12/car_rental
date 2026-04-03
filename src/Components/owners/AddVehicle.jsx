// src/pages/car-owner/AddVehicle.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { vehicleApi } from '../../Services/carOwnerApi';

export default function AddVehicle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    vehicle_type: '',
    fuel_type: '',
    location: '',
    price_per_day: '',
    availability_start: '',
    availability_end: '',
    description: '',
    images: []
  });

  const [imageUrls, setImageUrls] = useState(['']);

  const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'MUV', 'Convertible', 'Truck', 'Van'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrlField = (index) => {
    if (imageUrls.length > 1) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.brand.trim()) errors.brand = 'Brand is required';
    if (!formData.model.trim()) errors.model = 'Model is required';
    if (!formData.year) errors.year = 'Year is required';
    if (!formData.vehicle_type) errors.vehicle_type = 'Vehicle type is required';
    if (!formData.fuel_type) errors.fuel_type = 'Fuel type is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.price_per_day) errors.price_per_day = 'Price per day is required';
    if (!formData.availability_start) errors.availability_start = 'Availability start date is required';
    if (!formData.availability_end) errors.availability_end = 'Availability end date is required';
    
    if (formData.availability_start && formData.availability_end) {
      if (new Date(formData.availability_start) > new Date(formData.availability_end)) {
        errors.availability_end = 'End date must be after start date';
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    // Filter out empty image URLs
    const validImageUrls = imageUrls.filter(url => url.trim() !== '');
    
    const vehicleData = {
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year: parseInt(formData.year),
      vehicle_type: formData.vehicle_type,
      fuel_type: formData.fuel_type,
      location: formData.location.trim(),
      price_per_day: parseFloat(formData.price_per_day),
      availability_start: formData.availability_start,
      availability_end: formData.availability_end,
      description: formData.description || '',
      images: validImageUrls
    };

    console.log('Submitting vehicle data:', vehicleData);
    setLoading(true);

    try {
      const response = await vehicleApi.addVehicle(vehicleData);
      console.log('Add vehicle response:', response);
      setSuccess('Vehicle added successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/car-owner/vehicles');
      }, 1500);
    } catch (err) {
      console.error('Error adding vehicle:', err);
      console.error('Error response:', err.response?.data);
      setError({ submit: err.response?.data?.detail || 'Failed to add vehicle. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/car-owner/vehicles')}
              className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-800 rounded-lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Add New Vehicle</h1>
              <p className="text-gray-400 mt-1">Fill in the details to list your vehicle for rent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-500 text-white p-4 rounded-lg">
              ✅ {success} Redirecting...
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-500">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  placeholder="e.g., Toyota, Honda, BMW"
                />
                {error?.brand && <p className="text-red-500 text-sm mt-1">{error.brand}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  placeholder="e.g., Camry, Civic, X5"
                />
                {error?.model && <p className="text-red-500 text-sm mt-1">{error.model}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Year *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  placeholder="e.g., 2022"
                  min={1990}
                  max={new Date().getFullYear() + 1}
                />
                {error?.year && <p className="text-red-500 text-sm mt-1">{error.year}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Vehicle Type *</label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="">Select type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {error?.vehicle_type && <p className="text-red-500 text-sm mt-1">{error.vehicle_type}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Fuel Type *</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="">Select fuel type</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {error?.fuel_type && <p className="text-red-500 text-sm mt-1">{error.fuel_type}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  placeholder="e.g., New York, Los Angeles, Chicago"
                />
                {error?.location && <p className="text-red-500 text-sm mt-1">{error.location}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Price per Day (₹) *</label>
                <input
                  type="number"
                  name="price_per_day"
                  value={formData.price_per_day}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  placeholder="e.g., 2500"
                  min={0}
                  step={100}
                />
                {error?.price_per_day && <p className="text-red-500 text-sm mt-1">{error.price_per_day}</p>}
              </div>
            </div>
          </div>

          {/* Availability Dates */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-500">Availability Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Available From *</label>
                <input
                  type="date"
                  name="availability_start"
                  value={formData.availability_start}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  min={new Date().toISOString().split('T')[0]}
                />
                {error?.availability_start && <p className="text-red-500 text-sm mt-1">{error.availability_start}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Available Until *</label>
                <input
                  type="date"
                  name="availability_end"
                  value={formData.availability_end}
                  onChange={handleChange}
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  min={formData.availability_start || new Date().toISOString().split('T')[0]}
                />
                {error?.availability_end && <p className="text-red-500 text-sm mt-1">{error.availability_end}</p>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-500">Description</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 resize-none"
              placeholder="Describe your vehicle features, condition, and any special notes for renters..."
            />
          </div>

          {/* Images */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-500">Vehicle Images</h2>
            <p className="text-gray-400 text-sm mb-4">Add image URLs of your vehicle (optional but recommended)</p>
            
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  className="flex-1 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
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

          {/* Error Display */}
          {error?.submit && typeof error.submit === 'string' && (
            <div className="bg-red-500 text-white p-4 rounded-lg">
              ❌ {error.submit}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 justify-end sticky bottom-0 bg-gray-950 py-4">
            <button
              type="button"
              onClick={() => navigate('/car-owner/vehicles')}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                'Add Vehicle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}