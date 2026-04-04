// src/Components/NotFound.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Car, ArrowLeft, Home, AlertTriangle, MapPin, Fuel, Calendar } from "lucide-react";
import axios from "axios";

export default function NotFound() {
  const navigate = useNavigate();
  const [randomCar, setRandomCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomCar();
  }, []);

  const fetchRandomCar = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/customer/vehicles/search", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const vehicles = response.data?.results || [];
      if (vehicles.length > 0) {
        const randomIndex = Math.floor(Math.random() * vehicles.length);
        setRandomCar(vehicles[randomIndex]);
      }
    } catch (error) {
      console.error("Error fetching random car:", error);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { title: "Browse Available Cars", path: "/customer", icon: <Car className="w-5 h-5" /> },
    { title: "Go to Homepage", path: "/", icon: <Home className="w-5 h-5" /> },
    { title: "Check Your Bookings", path: "/customer/bookings", icon: <Calendar className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Simple Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 p-1.5 rounded-lg transform transition-transform group-hover:scale-110">
                <Car className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                DriveNow
              </span>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Error Message */}
            <div className="text-center md:text-left">
              {/* Animated 404 */}
              <div className="relative inline-block mb-6">
                <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent animate-bounce">
                  404
                </h1>
                <div className="absolute -top-4 -right-8 animate-pulse">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Oops! Page Not Found
              </h2>
              
              <p className="text-gray-400 text-lg mb-6">
                Looks like the road you're trying to take doesn't exist. 
                Let's get you back on track and find your perfect ride.
              </p>
              
              {/* Error Code Details */}
              <div className="bg-gray-900/50 rounded-xl p-4 mb-8 inline-block">
                <code className="text-gray-400 text-sm">
                  Error: 404 - Route not found
                </code>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate("/")}
                  className="group bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-500/25 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Go Back Home
                </button>
                <button
                  onClick={() => navigate("/customer")}
                  className="border border-gray-600 hover:border-yellow-500 text-gray-300 hover:text-yellow-400 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Car className="w-5 h-5" />
                  Browse Cars
                </button>
              </div>
              
              {/* Quick Suggestions */}
              <div className="mt-12">
                <h3 className="text-sm font-semibold text-gray-500 mb-4">QUICK SUGGESTIONS</h3>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(suggestion.path)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm text-gray-300 hover:text-yellow-400 transition group"
                    >
                      {suggestion.icon}
                      {suggestion.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Side - Dynamic Car Image from Backend */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800">
                {loading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400 text-sm">Finding a car for you...</p>
                    </div>
                  </div>
                ) : randomCar ? (
                  <>
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={randomCar.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"}
                        alt={`${randomCar.brand} ${randomCar.model}`}
                        className="w-full h-full object-cover transform hover:scale-110 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm font-semibold">
                        Featured Car
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">
                        {randomCar.brand} {randomCar.model}
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar className="w-3 h-3" />
                          {randomCar.year || "2024"}
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Fuel className="w-3 h-3" />
                          {randomCar.fuel_type || "Petrol"}
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <MapPin className="w-3 h-3" />
                          {randomCar.location || "Multiple Locations"}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-yellow-500">
                            ₹{randomCar.price_per_day?.toLocaleString()}
                          </span>
                          <span className="text-gray-400 text-sm"> /day</span>
                        </div>
                        <button
                          onClick={() => navigate(randomCar._id ? `/customer/vehicles/${randomCar._id}` : "/customer")}
                          className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500 hover:text-black transition text-sm font-semibold"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center p-8 text-center">
                    <Car className="w-16 h-16 text-gray-600 mb-4" />
                    <p className="text-gray-400">No vehicles available at the moment</p>
                    <p className="text-gray-500 text-sm mt-2">Please check back later</p>
                  </div>
                )}
              </div>
              
              {/* Car Suggestion Text */}
              {randomCar && (
                <p className="text-center text-gray-500 text-sm mt-4">
                  While you're here, check out this {randomCar.brand} {randomCar.model}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-800 text-gray-500 text-sm">
        <p>© 2026 DriveNow. All rights reserved. | Premium Car Rental Service</p>
        <p className="text-xs mt-2">Error Code: 404 - Page Not Found</p>
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}