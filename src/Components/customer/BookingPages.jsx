// src/Components/customer/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, ArrowLeft, AlertCircle } from 'lucide-react';
import { vehicleApi, bookingApi } from '../../Services/customerApi';

export default function BookingPages() {
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
      const data = await vehicleApi.getVehicleDetails(id);
      setVehicle(data);
      setBookingData(prev => ({
        ...prev,
        pickup_location: data.location,
        dropoff_location: data.location
      }));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
    
    if (bookingData.start_date && bookingData.end_date) {
      calculatePrice();
    }
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
      }
    }
  };

  useEffect(() => {
    if (bookingData.start_date && bookingData.end_date) {
      calculatePrice();
    }
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

    try {
      const response = await bookingApi.createBooking({
        vehicle_id: id,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        pickup_location: bookingData.pickup_location,
        dropoff_location: bookingData.dropoff_location
      });
      navigate(`/customer/payment/${response.booking._id}`);
    } catch (error) {
      setError(error.response?.data?.detail || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/customer/vehicles/${id}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Vehicle
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl p-6">
              <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>
              
              {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date *</label>
                  <input
                    type="date"
                    name="start_date"
                    value={bookingData.start_date}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Date *</label>
                  <input
                    type="date"
                    name="end_date"
                    value={bookingData.end_date}
                    onChange={handleDateChange}
                    min={bookingData.start_date || new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Pickup Location</label>
                  <input
                    type="text"
                    name="pickup_location"
                    value={bookingData.pickup_location}
                    onChange={handleDateChange}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Dropoff Location</label>
                  <input
                    type="text"
                    name="dropoff_location"
                    value={bookingData.dropoff_location}
                    onChange={handleDateChange}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || priceInfo.days === 0}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>

          {/* Price Summary */}
          <div>
            <div className="bg-gray-900 rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">{vehicle.brand} {vehicle.model}</span>
                  <span className="font-semibold">₹{vehicle.price_per_day}/day</span>
                </div>
                {priceInfo.days > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rental Days</span>
                      <span>{priceInfo.days} days</span>
                    </div>
                    <div className="border-t border-gray-800 pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-blue-500">₹{priceInfo.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}