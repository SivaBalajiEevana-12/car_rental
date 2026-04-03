// src/pages/car-owner/TestApi.jsx
import React, { useEffect, useState } from 'react';
import { vehicleApi } from '../../Services/carOwnerApi';

export default function TestApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testApi();
  }, []);

  const testApi = async () => {
    try {
      const vehicles = await vehicleApi.getMyVehicles();
      setData(vehicles);
      console.log('API Response:', vehicles);
    } catch (error) {
      console.error('API Error:', error);
      setData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">API Test Results</h1>
      <pre className="bg-gray-800 p-4 rounded-lg overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}