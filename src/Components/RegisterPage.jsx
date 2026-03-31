import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";
import { useDispatch } from "react-redux";


export default function Register() {
  const BASE_URL = "http://127.0.0.1:8000/register";
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

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

  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {

    const Registeration = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      password: formData.password
    };

    const response = await axios.post(
      "http://127.0.0.1:8000/register",
      Registeration
    );
      console.log("Registration successful:", response.data);
      const data={
        email:formData.email,
        password:formData.password
      }
    const login= await axios.post(
      "http://127.0.0.1:8000/login",
      data,
    )
    dispatch(loginSuccess({name:response}))
    console.log("Login successfull",login);
    navigate('/');
 
  } catch (error) {
    console.error("Registration error:", error.response?.data);
    setErrors({ api: "Registration failed. Please try again." });
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
              className="w-full bg-gray-800 p-3 rounded-lg outline-none"
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
              className="w-full bg-gray-800 p-3 rounded-lg outline-none"
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
              className="w-full bg-gray-800 p-3 rounded-lg outline-none"
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
              className="w-full bg-gray-800 p-3 rounded-lg outline-none"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Register
          </button>

        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
         <Link to="/login"><span className="text-yellow-400 cursor-pointer hover:underline">
            Login
          </span>
          </Link> 
        </p>

      </div>
    </div>
  );
}