// src/Components/customer/BrowseVehicles.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Fuel, Calendar, DollarSign, Car, Star, ChevronDown } from 'lucide-react';
import { vehicleApi } from '../../Services/customerApi';

export default function BrowseVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Ride</h1>
          <p className="text-xl text-blue-100">Browse our wide selection of premium vehicles</p>
        </div>
      </div>

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
    </div>
  );
}