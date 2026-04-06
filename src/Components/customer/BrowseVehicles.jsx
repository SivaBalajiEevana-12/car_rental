// src/Components/customer/BrowseVehicles.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Fuel, 
  Calendar, 
  DollarSign, 
  Star, 
  ChevronDown,
  Car,
  AlertCircle,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Award
} from 'lucide-react';
import { vehicleApi } from '../../Services/customerApi';
import axios from 'axios';

export default function BrowseVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationData, setApplicationData] = useState({
    vehicle_registration_number: '',
    vehicle_type: '',
    vehicle_brand: '',
    vehicle_model: '',
    vehicle_year: new Date().getFullYear(),
    rc_book_url: '',
    insurance_url: '',
    vehicle_images: ['']
  });
  const [applicationError, setApplicationError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState('');
  
  const [filters, setFilters] = useState({
    location: '',
    start_date: '',
    end_date: '',
    fuel_type: '',
    vehicle_type: '',
    min_price: '',
    max_price: '',
    sort_by: ''
  });

  const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'MUV', 'Convertible'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

  useEffect(() => {
    searchVehicles();
    checkApplicationStatus();
  }, []);

  const searchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleApi.searchVehicles(filters);
      setVehicles(data.results || []);
    } catch (error) {
      console.error('Error searching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/customer/owner-application-status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicationStatus(response.data);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    searchVehicles();
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      start_date: '',
      end_date: '',
      fuel_type: '',
      vehicle_type: '',
      min_price: '',
      max_price: '',
      sort_by: ''
    });
    setTimeout(() => searchVehicles(), 100);
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...applicationData.vehicle_images];
    newUrls[index] = value;
    setApplicationData({ ...applicationData, vehicle_images: newUrls });
  };

  const addImageField = () => {
    setApplicationData({
      ...applicationData,
      vehicle_images: [...applicationData.vehicle_images, '']
    });
  };

  const removeImageField = (index) => {
    if (applicationData.vehicle_images.length > 1) {
      const newUrls = applicationData.vehicle_images.filter((_, i) => i !== index);
      setApplicationData({ ...applicationData, vehicle_images: newUrls });
    }
  };

  const handleApplicationChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value
    });
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setApplicationLoading(true);
    setApplicationError('');
    setApplicationSuccess('');

    // Filter out empty image URLs
    const validImages = applicationData.vehicle_images.filter(url => url.trim() !== '');

    const submitData = {
      ...applicationData,
      vehicle_images: validImages,
      vehicle_year: parseInt(applicationData.vehicle_year)
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/customer/apply-owner', submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicationSuccess('Application submitted successfully! Our team will review your application.');
      setTimeout(() => {
        setShowApplicationModal(false);
        setApplicationSuccess('');
        checkApplicationStatus();
      }, 3000);
    } catch (error) {
      setApplicationError(error.response?.data?.detail || 'Failed to submit application');
    } finally {
      setApplicationLoading(false);
    }
  };

  const getApplicationStatusBadge = () => {
    if (!applicationStatus) return null;
    
    const status = applicationStatus.status;
    if (status === 'pending') {
      return (
        <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-500 px-4 py-2 rounded-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span>Application Pending Review</span>
        </div>
      );
    } else if (status === 'approved') {
      return (
        <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-2 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Application Approved! You can now list vehicles.</span>
        </div>
      );
    } else if (status === 'rejected') {
      return (
        <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          <span>Application Rejected: {applicationStatus.remarks || 'No reason provided'}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Find Your Perfect Ride</h1>
              <p className="text-xl text-blue-100">Browse our wide selection of premium vehicles</p>
            </div>
            
            {/* Apply for Car Owner Button */}
            {(!applicationStatus || applicationStatus.status !== 'approved') && (
              <button
                onClick={() => setShowApplicationModal(true)}
                className="bg-blue-500 hover:bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition transform hover:scale-105"
              >
                <UserPlus className="w-5 h-5 text-white" />
                Become a Car Owner
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Application Status Banner */}
      {applicationStatus && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          {getApplicationStatusBadge()}
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-gray-900 rounded-xl shadow-xl p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[150px]">
              <input
                type="date"
                name="start_date"
                placeholder="Start Date"
                value={filters.start_date}
                onChange={handleFilterChange}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <input
                type="date"
                name="end_date"
                placeholder="End Date"
                value={filters.end_date}
                onChange={handleFilterChange}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={applyFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  name="vehicle_type"
                  value={filters.vehicle_type}
                  onChange={handleFilterChange}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Vehicle Types</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  name="fuel_type"
                  value={filters.fuel_type}
                  onChange={handleFilterChange}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Fuel Types</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="min_price"
                  placeholder="Min Price (₹)"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  name="max_price"
                  placeholder="Max Price (₹)"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <select
                  name="sort_by"
                  value={filters.sort_by}
                  onChange={handleFilterChange}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Sort By</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <button
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white transition"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Available Vehicles ({vehicles.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-gray-400">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition duration-300">
                <div className="h-48 bg-gray-800 flex items-center justify-center">
                  {vehicle.images && vehicle.images[0] ? (
                    <img src={vehicle.images[0]} alt={vehicle.model} className="w-full h-full object-cover" />
                  ) : (
                    <Car className="w-16 h-16 text-gray-600" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{vehicle.brand} {vehicle.model}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">4.5</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{vehicle.year} • {vehicle.vehicle_type}</p>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{vehicle.location}</span>
                    <Fuel className="w-4 h-4 ml-2" />
                    <span>{vehicle.fuel_type}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-500">₹{vehicle.price_per_day?.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm"> /day</span>
                    </div>
                  </div>
                  <Link
                    to={`/customer/vehicles/${vehicle._id}`}
                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-lg font-semibold transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply for Car Owner Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Become a Car Owner
              </h2>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-400 mb-6">
              Fill out the form below to apply for becoming a car owner. Our team will review your application and get back to you.
            </p>

            {applicationError && (
              <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {applicationError}
              </div>
            )}

            {applicationSuccess && (
              <div className="bg-green-500/20 border border-green-500 text-green-500 p-3 rounded-lg mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {applicationSuccess}
              </div>
            )}

            <form onSubmit={submitApplication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Vehicle Registration Number *
                </label>
                <input
                  type="text"
                  name="vehicle_registration_number"
                  placeholder="KA-01-AB-1234"
                  value={applicationData.vehicle_registration_number}
                  onChange={handleApplicationChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Vehicle Brand *
                  </label>
                  <input
                    type="text"
                    name="vehicle_brand"
                    placeholder="Toyota, Honda, BMW"
                    value={applicationData.vehicle_brand}
                    onChange={handleApplicationChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    name="vehicle_model"
                    placeholder="Camry, Civic, X5"
                    value={applicationData.vehicle_model}
                    onChange={handleApplicationChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    name="vehicle_type"
                    value={applicationData.vehicle_type}
                    onChange={handleApplicationChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none"
                    required
                  >
                    <option value="">Select Type</option>
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Vehicle Year *
                  </label>
                  <input
                    type="number"
                    name="vehicle_year"
                    placeholder="2024"
                    value={applicationData.vehicle_year}
                    onChange={handleApplicationChange}
                    min={1990}
                    max={new Date().getFullYear() + 1}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  RC Book URL *
                </label>
                <input
                  type="url"
                  name="rc_book_url"
                  placeholder="https://example.com/rc-book.pdf"
                  value={applicationData.rc_book_url}
                  onChange={handleApplicationChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Insurance Document URL *
                </label>
                <input
                  type="url"
                  name="insurance_url"
                  placeholder="https://example.com/insurance.pdf"
                  value={applicationData.insurance_url}
                  onChange={handleApplicationChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Vehicle Images URLs
                </label>
                {applicationData.vehicle_images.map((url, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder={`Image URL ${index + 1}`}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none"
                    />
                    {index === applicationData.vehicle_images.length - 1 ? (
                      <button
                        type="button"
                        onClick={addImageField}
                        className="bg-green-500 hover:bg-green-600 px-3 rounded-lg text-white"
                      >
                        +
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="bg-red-500 hover:bg-red-600 px-3 rounded-lg text-white"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={applicationLoading}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg transition disabled:opacity-50"
                >
                  {applicationLoading ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}