// src/Components/Layout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminNavbar from './admin/AdminNavbar';
import CarOwnerNavbar from './owners/CarOwnerNavbar';
import CustomerNavbar from './customer/CustomerNavbar';
import { Car, AlertCircle } from 'lucide-react';

export default function Layout() {
  const { role, token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
    } else {
      // Small delay for smooth transition
      const timer = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [token, navigate, location.pathname]);

  // Render navbar based on role
  const renderNavbar = () => {
    if (!token) return null;
    
    switch (role) {
      case 'car_owner':
        return <CarOwnerNavbar />;
      case 'admin':
        return <AdminNavbar />;
      case 'customer':
        return <CustomerNavbar />;
      default:
        return (
          <div className="bg-yellow-500/20 border-b border-yellow-500/30 py-2 px-4 text-center">
            <p className="text-yellow-500 text-sm flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Unknown user role. Please contact support.
            </p>
          </div>
        );
    }
  };

  // Loading state
  if (!token || isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 p-4 rounded-2xl shadow-lg shadow-yellow-500/25 inline-block mb-4">
            <Car className="w-10 h-10 text-black animate-pulse" />
          </div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {renderNavbar()}
      <main className="flex-1">
        <Outlet context={{ user, role }} />
      </main>
      
      {/* Footer - Optional subtle branding */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-4 px-4 text-center">
        <p className="text-gray-600 text-xs">
          DriveNow - Premium Car Rental Service
        </p>
      </footer>
    </div>
  );
}
