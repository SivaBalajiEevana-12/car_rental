// src/components/car-owner/StatsCard.jsx
import React from 'react';

export default function StatsCard({ title, value, icon, color }) {
  return (
    <div className={`${color} rounded-xl p-6 text-white`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="opacity-90 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}