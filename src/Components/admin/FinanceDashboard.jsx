import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useSelector } from "react-redux";


const API = "http://127.0.0.1:8000/admin";

export default function FinanceDashboard() {
//   const token = useSelector((state) => state.auth.token);
const token = localStorage.getItem("token")

  const [data, setData] = useState({});

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      const revenue = await axios.get(`${API}/finance/revenue-summary`, { headers });
      const commission = await axios.get(`${API}/finance/platform-commission`, { headers });

      setData({
        revenue: revenue.data,
        commission: commission.data,
      });
    };

    fetchData();
  }, []);

  return (

<div>
      <h1 className="text-3xl text-yellow-400 mb-6">
        Finance Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-gray-900 p-6 rounded">
          <h2>Total Revenue</h2>
          <p className="text-yellow-400 text-xl">
            ₹{data.revenue?.total_revenue || 0}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded">
          <h2>Platform Commission</h2>
          <p className="text-yellow-400 text-xl">
            ₹{data.commission?.total_commission || 0}
          </p>
        </div>

      </div>
      </div>

   
  );
}