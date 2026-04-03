// src/pages/car-owner/CarOwnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Calendar, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { analyticsApi, vehicleApi } from '../../Services/carOwnerApi';
import CarOwnerNavbar from './CarOwnerNavbar';

export default function CarOwnerDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch vehicles first
      const vehiclesData = await vehicleApi.getMyVehicles();
      const vehiclesArray = Array.isArray(vehiclesData) ? vehiclesData : vehiclesData.vehicles || [];
      setVehicles(vehiclesArray);
      
      // Fetch analytics
      const analyticsData = await analyticsApi.getAnalytics();
      setAnalytics(analyticsData);
      
      console.log('Dashboard data loaded:', { vehicles: vehiclesArray, analytics: analyticsData });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.detail || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Vehicles',
      value: vehicles.length,
      icon: <Car className="w-8 h-8 text-yellow-500" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      title: 'Total Bookings',
      value: analytics?.total_bookings || 0,
      icon: <Calendar className="w-8 h-8 text-yellow-500" />,
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      title: 'Total Earnings',
      value: `₹${(analytics?.total_earnings || 0).toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8 text-yellow-500" />,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      title: 'Utilization Rate',
      value: `${analytics?.utilization_rate || 0}%`,
      icon: <TrendingUp className="w-8 h-8 text-yellow-500" />,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600'
    }
  ];

  if (loading) {
    return (

      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    // <CarOwnerNavbar>
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Car Owner Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage your fleet and track performance</p>
            </div>
            <Link
              to="/car-owner/vehicles/add"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Add Vehicle
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.color} rounded-xl p-6 text-white`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="opacity-90 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Vehicles */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-xl font-semibold">Your Vehicles</h3>
          </div>
          <div className="p-6">
            {vehicles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No vehicles added yet</p>
                <Link
                  to="/car-owner/vehicles/add"
                  className="inline-block mt-4 bg-yellow-500 text-black px-4 py-2 rounded-lg"
                >
                  Add Your First Vehicle
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.slice(0, 3).map((vehicle) => (
                  <div key={vehicle._id} className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold">{vehicle.brand} {vehicle.model}</h4>
                    <p className="text-gray-400 text-sm">{vehicle.year} • {vehicle.vehicle_type}</p>
                    <p className="text-yellow-500 font-bold mt-2">₹{vehicle.price_per_day}/day</p>
                    <Link
                      to={`/car-owner/vehicles/${vehicle._id}/edit`}
                      className="inline-block mt-3 text-yellow-500 hover:text-yellow-400 text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {vehicles.length > 3 && (
              <div className="text-center mt-4">
                <Link to="/car-owner/vehicles" className="text-yellow-500 hover:text-yellow-400">
                  View all {vehicles.length} vehicles →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    // </CarOwnerNavbar>
  );
}