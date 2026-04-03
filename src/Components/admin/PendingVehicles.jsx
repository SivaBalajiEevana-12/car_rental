import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useSelector } from "react-redux";


const API = "http://127.0.0.1:8000/admin";

export default function PendingVehiclesPage() {
//   const token = useSelector((state) => state.auth.token);
const token = localStorage.getItem("token")

  const [vehicles, setVehicles] = useState([]);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchVehicles = async () => {
    const res = await axios.get(`${API}/vehicles/pending`, { headers });
    setVehicles(res.data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const verifyVehicle = async (id, status) => {
    await axios.patch(
      `${API}/vehicles/${id}/verify`,
      { status },
      { headers }
    );
    fetchVehicles();
  };

  return (
    <>

      <h1 className="text-3xl text-yellow-400 mb-6">
        Pending Vehicles
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {vehicles.map((v) => (
          <div key={v._id} className="bg-gray-900 p-5 rounded">

            <h2>{v.brand} {v.model}</h2>
            <p>{v.year}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => verifyVehicle(v._id, "approved")}
                className="bg-green-500 px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => verifyVehicle(v._id, "rejected")}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>

          </div>
        ))}

      </div>

    </>
  );
}