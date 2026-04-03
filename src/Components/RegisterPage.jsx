// src/Components/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number must be 10 digits";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Register user
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password
      };

      await axios.post("http://127.0.0.1:8000/register", registrationData);
      console.log("Registration successful");

      // Auto login after registration
      const loginResponse = await axios.post("http://127.0.0.1:8000/login", {
        email: formData.email,
        password: formData.password
      });

      const loginData = loginResponse.data;
      console.log("Login successful:", loginData);

      // Dispatch login success with correct structure
      dispatch(
        loginSuccess({
          user: {
            id: loginData.user_id,
            email: formData.email,
            name: formData.name
          },
          role: loginData.role,
          token: loginData.access_token
        })
      );

      // Redirect based on role
      if (loginData.role === 'car_owner') {
        navigate('/car-owner-dashboard');
      } else if (loginData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error("Registration error:", error.response?.data);
      setErrors({ api: error.response?.data?.detail || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.phone_number && (
              <p className="text-red-400 text-sm mt-1">{errors.phone_number}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* API Error */}
          {errors.api && (
            <div className="bg-red-500 text-white p-3 rounded-lg text-sm">
              {errors.api}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login">
            <span className="text-yellow-400 cursor-pointer hover:underline">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}