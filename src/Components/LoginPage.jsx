// src/Components/LoginPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure, loginStart } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const BASE_URL = "http://127.0.0.1:8000/login";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await axios.post(BASE_URL, {
        email: formData.email,
        password: formData.password
      });

      const data = response.data;
      console.log("Login response:", data);

      // Fix: Dispatch with correct structure
      dispatch(
        loginSuccess({
          user: { 
            id: data.user_id, 
            email: formData.email,
            name: data.name || "User"
          },
          role: data.role,
          token: data.access_token
        })
      );

      // Redirect based on dashboard_url from backend
      if (data.dashboard_url) {
        navigate(data.dashboard_url);
      } else if (data.role === 'car_owner') {
        navigate('/car-owner-dashboard');
      } else if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error("Login error:", error);
      dispatch(loginFailure(error.response?.data?.detail || "Login failed"));
    }
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">
          Login to DriveNow
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register">
            <span className="text-yellow-400 cursor-pointer hover:underline">
              Register
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}