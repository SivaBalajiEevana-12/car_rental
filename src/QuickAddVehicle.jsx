// src/pages/car-owner/QuickAddVehicle.jsx (Temporary test page)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleApi } from './Services/carOwnerApi';

export default function QuickAddVehicle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: 'Toyota',
    model: 'Camry',
    year: 2022,
    vehicle_type: 'Sedan',
    fuel_type: 'Petrol',
    location: 'New York',
    price_per_day: 2500,
    availability_start: new Date().toISOString().split('T')[0],
    availability_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: 'Test vehicle',
    images: ['https://via.placeholder.com/400x300?text=Car+Image']
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await vehicleApi.addVehicle(formData);
      console.log('Vehicle added:', result);
      alert('Vehicle added successfully!');
      navigate('/car-owner/vehicles');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-md mx-auto bg-gray-900 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Quick Add Test Vehicle</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Brand"
          />
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({...formData, model: e.target.value})}
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Model"
          />
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Year"
          />
          <select
            value={formData.vehicle_type}
            onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
            className="w-full bg-gray-800 p-2 rounded"
          >
            <option>Sedan</option>
            <option>SUV</option>
            <option>Hatchback</option>
          </select>
          <select
            value={formData.fuel_type}
            onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
            className="w-full bg-gray-800 p-2 rounded"
          >
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
          </select>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Location"
          />
          <input
            type="number"
            value={formData.price_per_day}
            onChange={(e) => setFormData({...formData, price_per_day: parseInt(e.target.value)})}
            className="w-full bg-gray-800 p-2 rounded"
            placeholder="Price per day"
          />
          <input
            type="date"
            value={formData.availability_start}
            onChange={(e) => setFormData({...formData, availability_start: e.target.value})}
            className="w-full bg-gray-800 p-2 rounded"
          />
          <input
            type="date"
            value={formData.availability_end}
            onChange={(e) => setFormData({...formData, availability_end: e.target.value})}
            className="w-full bg-gray-800 p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-2 rounded font-semibold"
          >
            {loading ? 'Adding...' : 'Add Test Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
}