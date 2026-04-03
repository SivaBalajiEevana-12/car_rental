// src/components/car-owner/VehicleCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Power, PowerOff } from 'lucide-react';

export default function VehicleCard({ vehicle, onToggleStatus, onDelete }) {
  // Debug log
  console.log('Rendering VehicleCard:', vehicle);
  
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition duration-300 border border-gray-800">
      {/* Image */}
      <div className="h-48 bg-gray-800 flex items-center justify-center">
        {vehicle.images && vehicle.images.length > 0 && vehicle.images[0] ? (
          <img 
            src={vehicle.images[0]} 
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="text-gray-500 text-center">
            <div className="text-4xl mb-2">🚗</div>
            <div className="text-sm">No Image</div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">
            {vehicle.brand} {vehicle.model}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            vehicle.status === 'active' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {vehicle.status || 'inactive'}
          </span>
        </div>
        
        <p className="text-gray-400 text-sm mb-2">
          {vehicle.year} • {vehicle.vehicle_type || 'N/A'} • {vehicle.fuel_type || 'N/A'}
        </p>
        <p className="text-gray-400 text-sm mb-3 flex items-center gap-1">
          📍 {vehicle.location || 'Location not specified'}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-yellow-500">
              ₹{(vehicle.price_per_day || 0).toLocaleString()}
            </span>
            <span className="text-gray-400 text-sm"> /day</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/car-owner/vehicles/${vehicle._id}/edit`}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          
          <button
            onClick={() => onToggleStatus(vehicle._id, vehicle.status)}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm ${
              vehicle.status === 'active'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {vehicle.status === 'active' ? (
              <>
                <PowerOff className="w-4 h-4" />
                Deactivate
              </>
            ) : (
              <>
                <Power className="w-4 h-4" />
                Activate
              </>
            )}
          </button>
          
          <button
            onClick={() => onDelete(vehicle)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}