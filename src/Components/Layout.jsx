// src/Components/Layout.jsx
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminNavbar from './admin/AdminNavbar';
import CarOwnerNavbar from './owners/CarOwnerNavbar';
import CustomerNavbar from './customer/CustomerNavbar';

export default function Layout() {
  const { role, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Layout mounted - Token:", token ? "Present" : "Missing");
    console.log("Layout mounted - Role:", role);
    
    // If no token, redirect to login
    if (!token) {
      console.log("No token in Layout, redirecting to login");
      navigate('/login');
    }
  }, [token, navigate]);

  // Render navbar based on role
  const renderNavbar = () => {
    if (!token) return null;
    
    switch (role) {
      case 'car_owner':
        console.log("Rendering Car Owner Navbar");
        return <CarOwnerNavbar />;
      case 'admin':
        console.log("Rendering Admin Navbar");
        return <AdminNavbar />;
      case 'customer':
        console.log("Customer role - no navbar yet");
        return <CustomerNavbar/>;
      default:
        console.log("Unknown role:", role);
        return null;
    }
  };

  // Don't render anything while checking auth
  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {renderNavbar()}
      <main>
        <Outlet />
      </main>
    </div>
  );
}