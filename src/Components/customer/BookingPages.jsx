// src/Components/customer/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, ArrowLeft, AlertCircle, Car, Clock, Shield } from 'lucide-react';
import axios from 'axios';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: '',
    pickup_location: '',
    dropoff_location: ''
  });
  const [priceInfo, setPriceInfo] = useState({
    days: 0,
    total: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://127.0.0.1:8000/customer/vehicles/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVehicle(response.data);
      setBookingData(prev => ({
        ...prev,
        pickup_location: response.data.location,
        dropoff_location: response.data.location
      }));
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      setError('Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const calculatePrice = () => {
    if (bookingData.start_date && bookingData.end_date && vehicle) {
      const start = new Date(bookingData.start_date);
      const end = new Date(bookingData.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days > 0) {
        setPriceInfo({
          days: days,
          total: days * vehicle.price_per_day
        });
      } else {
        setPriceInfo({ days: 0, total: 0 });
      }
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [bookingData.start_date, bookingData.end_date, vehicle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!bookingData.start_date || !bookingData.end_date) {
      setError('Please select start and end dates');
      setSubmitting(false);
      return;
    }

    const start = new Date(bookingData.start_date);
    const end = new Date(bookingData.end_date);
    if (start >= end) {
      setError('End date must be after start date');
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const bookingPayload = {
        vehicle_id: id,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        pickup_location: bookingData.pickup_location,
        dropoff_location: bookingData.dropoff_location
      };
      
      console.log('Creating booking with payload:', bookingPayload);
      
      const response = await axios.post(
        'http://127.0.0.1:8000/customer/bookings',
        bookingPayload,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      
      console.log('Booking response:', response.data);
      
      // Navigate to payment page
      navigate(`/customer/payment/${response.data.booking._id}`);
      
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.detail || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading vehicle details...</div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Vehicle Not Found</h2>
          <p className="text-gray-400 mb-4">The vehicle you're looking for doesn't exist or is not available.</p>
          <Link to="/customer" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-block">
            Browse Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/customer/vehicles/${id}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          Back to Vehicle Details
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Complete Your Booking</h1>
                  <p className="text-gray-400 text-sm">Fill in the details to reserve this vehicle</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl flex items-center gap-3 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="date"
                        name="start_date"
                        value={bookingData.start_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        max={vehicle.availability_end?.split('T')[0]}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="date"
                        name="end_date"
                        value={bookingData.end_date}
                        onChange={handleChange}
                        min={bookingData.start_date || new Date().toISOString().split('T')[0]}
                        max={vehicle.availability_end?.split('T')[0]}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pickup Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="pickup_location"
                        value={bookingData.pickup_location}
                        onChange={handleChange}
                        placeholder="Pickup location"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Dropoff Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="dropoff_location"
                        value={bookingData.dropoff_location}
                        onChange={handleChange}
                        placeholder="Dropoff location"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || priceInfo.days === 0}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-500" />
                Booking Summary
              </h3>
              
              {/* Vehicle Info */}
              <div className="flex gap-4 pb-4 border-b border-gray-800">
                <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
                  {vehicle.images?.[0] ? (
                    <img src={vehicle.images[0]} alt={vehicle.model} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{vehicle.brand} {vehicle.model}</h4>
                  <p className="text-sm text-gray-400">{vehicle.year} • {vehicle.vehicle_type}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {vehicle.location}
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Rate</span>
                  <span className="font-semibold">₹{vehicle.price_per_day?.toLocaleString()}</span>
                </div>
                
                {priceInfo.days > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Number of Days</span>
                      <span>{priceInfo.days} {priceInfo.days === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="border-t border-gray-800 pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-blue-500">₹{priceInfo.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}

                {priceInfo.days === 0 && bookingData.start_date && bookingData.end_date && (
                  <div className="text-center text-red-500 text-sm mt-2">
                    Please select valid dates
                  </div>
                )}
              </div>

              {/* Security Note */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Secure payment with Razorpay</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  No payment will be taken until you confirm the booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}