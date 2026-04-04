// src/Components/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Car, 
  AlertCircle,
  ArrowRight,
  CheckCircle,
  FileText,
  CreditCard,
  Home,
  Briefcase,
  Upload,
  Shield
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    // Required for ALL users
    license_number: "",
    license_image_url: "",
    id_proof_url: "",
    address: "",
    experience: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    let newErrors = {};

    // Basic validations
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
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

    // Document validations - REQUIRED FOR ALL USERS
    if (!formData.license_number) {
      newErrors.license_number = "Driver's license number is required";
    }
    
    if (!formData.license_image_url) {
      newErrors.license_image_url = "License image URL is required";
    } else if (!formData.license_image_url.startsWith("http")) {
      newErrors.license_image_url = "Please enter a valid URL";
    }
    
    if (!formData.id_proof_url) {
      newErrors.id_proof_url = "ID proof URL is required";
    } else if (!formData.id_proof_url.startsWith("http")) {
      newErrors.id_proof_url = "Please enter a valid URL";
    }
    
    if (!formData.address) {
      newErrors.address = "Address is required";
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
      // Register user with ALL fields (required for everyone)
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        license_number: formData.license_number,
        license_image_url: formData.license_image_url,
        id_proof_url: formData.id_proof_url,
        address: formData.address,
        experience: formData.experience || ""
      };

      await axios.post("http://127.0.0.1:8000/register", registrationData);
      console.log("Registration successful");

      // Auto login after registration
      const loginResponse = await axios.post("http://127.0.0.1:8000/login", {
        email: formData.email,
        password: formData.password
      });

      const loginData = loginResponse.data;

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
        navigate('/customer');
      }

    } catch (error) {
      console.error("Registration error:", error.response?.data);
      setErrors({ api: error.response?.data?.detail || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-400 p-3 rounded-2xl shadow-lg mb-4 animate-bounce">
            <Car className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            DriveNow
          </h1>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>

        {/* Registration Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Information Section */}
            <div className="border-b border-gray-800 pb-4 mb-2">
              <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h3>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 border ${
                    errors.name ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="9876543210"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 border ${
                    errors.phone_number ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.phone_number && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone_number}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
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
                Password *
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
              <p className="text-gray-500 text-xs mt-2">
                Password must be at least 6 characters
              </p>
            </div>

            {/* Verification Documents Section - REQUIRED FOR ALL */}
            <div className="border-b border-gray-800 pb-4 mb-2 mt-4">
              <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification Documents (Required for all users)
              </h3>
              <p className="text-gray-500 text-xs mt-1">
                These documents are required for account verification
              </p>
            </div>

            {/* License Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Driver's License Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="license_number"
                  placeholder="DL-1234567890"
                  value={formData.license_number}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 border ${
                    errors.license_number ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.license_number && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.license_number}
                </p>
              )}
            </div>

            {/* License Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                License Image URL *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Upload className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="url"
                  name="license_image_url"
                  placeholder="https://example.com/license.jpg"
                  value={formData.license_image_url}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 border ${
                    errors.license_image_url ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.license_image_url && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.license_image_url}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Upload a clear image of your driver's license
              </p>
            </div>

            {/* ID Proof URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID Proof URL *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="url"
                  name="id_proof_url"
                  placeholder="https://example.com/id-proof.jpg"
                  value={formData.id_proof_url}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 border ${
                    errors.id_proof_url ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.id_proof_url && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.id_proof_url}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Upload your Aadhar card, passport, or voter ID
              </p>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Home className="h-5 w-5 text-gray-500" />
                </div>
                <textarea
                  name="address"
                  placeholder="Your full address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full bg-gray-800/50 border ${
                    errors.address ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 resize-none`}
                />
              </div>
              {errors.address && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.address}
                </p>
              )}
            </div>

            {/* Experience (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Driving Experience (Years)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="experience"
                  placeholder="e.g., 5 years"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Verification Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-yellow-500 text-sm font-semibold">Document Verification Required</p>
                  <p className="text-gray-400 text-xs">
                    Your documents will be reviewed by our admin team. This is required for all users to ensure platform safety.
                  </p>
                </div>
              </div>
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
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
              <span className="px-2 bg-gray-900 text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 font-semibold py-3 rounded-lg transition-all duration-200 border border-gray-700"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}