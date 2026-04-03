// src/pages/car-owner/MyVehicles.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import { vehicleApi } from '../../Services/carOwnerApi';
import VehicleCard from './VehicleCard';

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchVehicles();
  }, [filter]);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = filter === 'all' ? null : filter;
      const data = await vehicleApi.getMyVehicles(status);
      console.log('Fetched vehicles:', data); // Debug log
      
      // Handle both array and object responses
      const vehiclesArray = Array.isArray(data) ? data : data.vehicles || [];
      setVehicles(vehiclesArray);
      
      if (vehiclesArray.length === 0) {
        console.log('No vehicles found for filter:', filter);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError(error.response?.data?.detail || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (vehicleId, currentStatus) => {
    try {
      if (currentStatus === 'active') {
        await vehicleApi.deactivateVehicle(vehicleId);
      } else {
        await vehicleApi.activateVehicle(vehicleId);
      }
      await fetchVehicles(); // Refresh after status change
    } catch (error) {
      console.error('Error toggling vehicle status:', error);
      alert('Failed to update vehicle status');
    }
  };

  const handleDelete = async (vehicle) => {
    if (window.confirm(`Are you sure you want to delete ${vehicle.brand} ${vehicle.model}?`)) {
      try {
        await vehicleApi.deleteVehicle(vehicle._id);
        await fetchVehicles(); // Refresh after delete
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Failed to delete vehicle');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading vehicles...</div>
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Vehicles</h1>
              <p className="text-gray-400 mt-1">Manage your vehicle fleet</p>
            </div>
            <Link
              to="/car-owner/vehicles/add"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Add New Vehicle
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' 
                ? 'bg-yellow-500 text-black' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            All ({vehicles.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'active' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Active ({vehicles.filter(v => v.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'inactive' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Inactive ({vehicles.filter(v => v.status === 'inactive').length})
          </button>
        </div>

        {/* Vehicles Grid */}
        {vehicles.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-gray-400 mb-4">Get started by adding your first vehicle</p>
            <Link
              to="/car-owner/vehicles/add"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Vehicle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}