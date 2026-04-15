// src/Components/customer/VehicleDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, MapPin, Fuel, Gauge, Users, 
  Star, CheckCircle, XCircle, Clock, Car, 
  CalendarDays, Info, ChevronRight
} from 'lucide-react';
import { vehicleApi } from '../../Services/customerApi';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      const data = await vehicleApi.getVehicleDetails(id);
      setVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if vehicle is currently available based on stored dates
  const isCurrentlyAvailable = () => {
    if (!vehicle) return false;
    const today = new Date().toISOString().split('T')[0];
    return vehicle.availability_start <= today && vehicle.availability_end >= today;
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!vehicle) return '';
    const start = new Date(vehicle.availability_start).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const end = new Date(vehicle.availability_end).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `${start} - ${end}`;
  };

  // Calculate days remaining in availability period
  const getDaysRemaining = () => {
    if (!vehicle) return 0;
    const today = new Date();
    const endDate = new Date(vehicle.availability_end);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Check if vehicle is expiring soon
  const isExpiringSoon = () => {
    const daysRemaining = getDaysRemaining();
    return daysRemaining > 0 && daysRemaining <= 7;
  };

  // Generate array of available months for display
  const getAvailableMonths = () => {
    if (!vehicle) return [];
    const start = new Date(vehicle.availability_start);
    const end = new Date(vehicle.availability_end);
    const months = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const monthYear = currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      if (!months.includes(monthYear)) {
        months.push(monthYear);
      }
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
  };

  const isAvailable = isCurrentlyAvailable();
  const daysRemaining = getDaysRemaining();
  const availableMonths = getAvailableMonths();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Vehicle not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/customer')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-gray-900 rounded-xl overflow-hidden h-96">
              <img
                src={vehicle.images?.[selectedImage] || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={vehicle.model}
                className="w-full h-full object-cover"
              />
            </div>
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {vehicle.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{vehicle.brand} {vehicle.model}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span>4.5</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{vehicle.year}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{vehicle.vehicle_type}</span>
            </div>

            {/* Availability Status - Based on Database */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Availability Period</span>
                </div>
                <div className={`flex items-center gap-2 ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                  {isAvailable ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span>{isAvailable ? 'Available Now' : 'Not Available'}</span>
                </div>
              </div>
              
              {/* Date Range Display */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Available From:</span>
                  <span className="text-gray-300">
                    {new Date(vehicle.availability_start).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Available Until:</span>
                  <span className="text-gray-300">
                    {new Date(vehicle.availability_end).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Days Remaining Badge */}
              {isAvailable && (
                <div className={`rounded-lg p-3 ${isExpiringSoon() ? 'bg-yellow-500/20 border border-yellow-500' : 'bg-green-500/20 border border-green-500'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-5 h-5 ${isExpiringSoon() ? 'text-yellow-500' : 'text-green-500'}`} />
                      <span className="text-sm">Available for {daysRemaining} more days</span>
                    </div>
                    {isExpiringSoon() && (
                      <span className="text-xs text-yellow-500">⚠️ Limited time!</span>
                    )}
                  </div>
                </div>
              )}

              {/* Available Months Quick View */}
              <div className="mt-4 pt-3 border-t border-gray-800">
                <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  Available in:
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableMonths.slice(0, 4).map((month, index) => (
                    <span key={index} className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-300">
                      {month}
                    </span>
                  ))}
                  {availableMonths.length > 4 && (
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-400">
                      +{availableMonths.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price and Booking Section */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Price</span>
                <div>
                  <span className="text-3xl font-bold text-blue-500">₹{vehicle.price_per_day?.toLocaleString()}</span>
                  <span className="text-gray-400"> /day</span>
                </div>
              </div>
              
              {/* Estimated Total for minimum booking */}
              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Minimum booking total:</p>
                <p className="text-lg font-semibold text-blue-400">
                  ₹{(vehicle.price_per_day * 1).toLocaleString()}
                  <span className="text-sm text-gray-400"> (1 day)</span>
                </p>
              </div>
              
              <Link
                to={isAvailable ? `/customer/book/${vehicle._id}` : '#'}
                className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
                  isAvailable 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed pointer-events-none'
                }`}
              >
                {isAvailable ? 'Book Now' : 'Currently Unavailable'}
              </Link>
              
              {!isAvailable && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  This vehicle is not available for booking at this time
                </p>
              )}
            </div>

            {/* Quick Availability Info Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-500">
                  {Math.ceil((new Date(vehicle.availability_end) - new Date(vehicle.availability_start)) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-xs text-gray-400">Total Available Days</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <Car className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-500">
                  {vehicle.year}
                </p>
                <p className="text-xs text-gray-400">Model Year</p>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-400">Fuel Type</p>
                    <p className="font-semibold">{vehicle.fuel_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-400">Mileage</p>
                    <p className="font-semibold">15 km/l</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-400">Seats</p>
                    <p className="font-semibold">5</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="font-semibold">{vehicle.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-gray-300">{vehicle.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}