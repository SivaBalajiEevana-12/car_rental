// src/Components/customer/VehicleDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, MapPin, Fuel, Gauge, Users, 
  Snowflake, Wifi, Music, Shield, Star, ChevronRight 
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
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
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

            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Price</span>
                <div>
                  <span className="text-3xl font-bold text-blue-500">₹{vehicle.price_per_day?.toLocaleString()}</span>
                  <span className="text-gray-400"> /day</span>
                </div>
              </div>
              <Link
                to={`/customer/book/${vehicle._id}`}
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg font-semibold transition"
              >
                Book Now
              </Link>
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