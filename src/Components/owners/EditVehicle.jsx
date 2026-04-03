// src/pages/car-owner/EditVehicle.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { vehicleApi } from '../../Services/carOwnerApi';

export default function EditVehicle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    vehicle_type: '',
    fuel_type: '',
    location: '',
    price_per_day: '',
    availability_start: '',
    availability_end: '',
    description: '',
    images: []
  });
  
  const [newImageUrls, setNewImageUrls] = useState(['']);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'MUV', 'Convertible', 'Truck', 'Van'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleApi.getVehicle(id);
      console.log('Fetched vehicle:', data);
      
      setFormData({
        brand: data.brand || '',
        model: data.model || '',
        year: data.year || '',
        vehicle_type: data.vehicle_type || '',
        fuel_type: data.fuel_type || '',
        location: data.location || '',
        price_per_day: data.price_per_day || '',
        availability_start: data.availability_start ? data.availability_start.split('T')[0] : '',
        availability_end: data.availability_end ? data.availability_end.split('T')[0] : '',
        description: data.description || '',
        images: data.images || []
      });
      setExistingImages(data.images || []);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      setError('Failed to load vehicle details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewImageUrlChange = (index, value) => {
    const newUrls = [...newImageUrls];
    newUrls[index] = value;
    setNewImageUrls(newUrls);
  };

  const addNewImageField = () => {
    setNewImageUrls([...newImageUrls, '']);
  };

  const removeNewImageField = (index) => {
    if (newImageUrls.length > 1) {
      const newUrls = newImageUrls.filter((_, i) => i !== index);
      setNewImageUrls(newUrls);
    }
  };

  const removeExistingImage = async (indexToRemove) => {
    const imageToDelete = existingImages[indexToRemove];
    setImagesToDelete(prev => [...prev, imageToDelete]);
    const updatedImages = existingImages.filter((_, index) => index !== indexToRemove);
    setExistingImages(updatedImages);
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

    // Filter out empty new image URLs
    const validNewImages = newImageUrls.filter(url => url.trim() !== '');
    
    // Combine existing images (excluding deleted ones) with new images
    const allImages = [...existingImages, ...validNewImages];
    
    const updateData = {
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
      images: allImages
    };

    console.log('Updating vehicle with data:', updateData);
    setSubmitting(true);

    try {
      await vehicleApi.updateVehicle(id, updateData);
      setSuccess('Vehicle updated successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/car-owner/vehicles');
      }, 1500);
    } catch (err) {
      console.error('Error updating vehicle:', err);
      setError({ submit: err.response?.data?.detail || 'Failed to update vehicle. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
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
              onClick={() => navigate('/car-owner/vehicles')}
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
          {/* Success Message */}
          {success && (
            <div className="bg-green-500 text-white p-4 rounded-lg flex items-center gap-3">
              <Save className="w-5 h-5" />
              {success} Redirecting...
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
                  placeholder="e.g., Toyota, Honda"
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
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g., Camry, Civic"
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
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
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
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
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
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
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
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g., New York, Los Angeles"
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
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
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
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
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
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
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
              className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none resize-none"
              placeholder="Describe your vehicle features, condition, and any special notes for renters..."
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-yellow-500">Current Images</h2>
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
            <h2 className="text-xl font-semibold mb-4 text-yellow-500">Add New Images</h2>
            <p className="text-gray-400 text-sm mb-4">Add additional image URLs of your vehicle</p>
            
            {newImageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleNewImageUrlChange(index, e.target.value)}
                  className="flex-1 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
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

          {/* Error Display */}
          {error?.submit && typeof error.submit === 'string' && (
            <div className="bg-red-500 text-white p-4 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              {error.submit}
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
              disabled={submitting}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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