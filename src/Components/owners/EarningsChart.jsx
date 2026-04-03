// src/components/car-owner/EarningsChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function EarningsChart({ earnings }) {
  // Process earnings data for chart
  const chartData = earnings.reduce((acc, transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.amount += transaction.amount;
    } else {
      acc.push({ date, amount: transaction.amount });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4">Earnings Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#EAB308"
            strokeWidth={2}
            dot={{ fill: '#EAB308' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}