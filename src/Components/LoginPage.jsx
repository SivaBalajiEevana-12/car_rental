// src/Components/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure, loginStart } from "../redux/authSlice";
import axios from "axios";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Car, 
  ArrowRight,
  AlertCircle,
  Home
} from "lucide-react";

export default function LoginPage() {
  const BASE_URL = "http://127.0.0.1:8000/login";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
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
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    dispatch(loginStart());

    try {
      const response = await axios.post(BASE_URL, {
        email: formData.email,
        password: formData.password
      });
      const data = response.data;
      dispatch(
        loginSuccess({
          user: { 
            id: data.user_id, 
            email: formData.email,
            name: data.name || formData.email.split('@')[0]
          },
          role: data.role,
          token: data.access_token
        })
      );
      if (data.dashboard_url) {
        navigate(data.dashboard_url);
      } else if (data.role === 'car_owner') {
        navigate('/car-owner-dashboard');
      } else if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/customer');
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.detail || "Invalid email or password";
      setErrors({ api: errorMsg });
      dispatch(loginFailure(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-400 p-3 rounded-2xl shadow-lg mb-4 animate-bounce">
            <Car className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            DriveNow
          </h1>
          <p className="text-gray-400 mt-2">Welcome back! Please login to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800 p-8">
          {/* Back to Home Button - Top Right Inside Card */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition group text-sm"
            >
              <Home className="w-4 h-4 group-hover:-translate-x-1 transition" />
              Back to Home
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 border ${
                    errors.email ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 border ${
                    errors.password ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-yellow-400 hover:text-yellow-300 transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* API Error */}
            {errors.api && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errors.api}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-500">New to DriveNow?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="w-full flex items-center justify-center gap-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 font-semibold py-3 rounded-lg transition-all duration-200 border border-gray-700"
          >
            Create New Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}