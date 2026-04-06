// src/Components/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { 
  Car, 
  MapPin, 
  Calendar, 
  Search, 
  Star, 
  ArrowRight, 
  Shield, 
  Clock, 
  Phone, 
  Mail,
  Menu,
  X,
  Sparkles,
  Play,
  Pause,
  Users,
  Award,
  TrendingUp,
  Fuel,
  Gauge,
  Navigation,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react";
import axios from "axios";

export default function Home() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    location: "",
    startDate: "",
    endDate: ""
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const heroRef = useRef(null);

  // Hero section images
  const heroImages = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80"
  ];

  useEffect(() => {
    fetchAllVehicles();
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const fetchAllVehicles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Fetch all active vehicles from the backend
      const response = await axios.get("http://127.0.0.1:8000/admin/vehicles", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: {
          // Optional: Add default filters
          // status: "active"
        }
      });
      
      const vehicles = response.data?.results || [];
      setAllCars(vehicles);
      setFeaturedCars(vehicles.slice(0, 6)); // Show first 6 as featured
      
      console.log("Fetched vehicles:", vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      // Fallback data if API fails - but now it will show real data
      setAllCars([]);
      setFeaturedCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Search vehicles function
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/customer/vehicles/search", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: {
          location: searchData.location || undefined,
          start_date: searchData.startDate || undefined,
          end_date: searchData.endDate || undefined
        }
      });
      
      const vehicles = response.data?.results || [];
      setAllCars(vehicles);
      setFeaturedCars(vehicles.slice(0, 6));
      
      // Scroll to cars section
      document.getElementById("cars")?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleRentNow = (carId) => {
    if (user) {
      navigate(`/customer/book/${carId}`);
    } else {
      navigate("/login", { state: { from: `/customer/book/${carId}` } });
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: allCars.length > 0 ? `${allCars.length}+` : "100+", label: "Available Cars" },
    { icon: <Car className="w-6 h-6" />, value: "500+", label: "Happy Customers" },
    { icon: <Award className="w-6 h-6" />, value: "98%", label: "Satisfaction Rate" },
    { icon: <TrendingUp className="w-6 h-6" />, value: "24/7", label: "Support" }
  ];

  const features = [
    { icon: <Shield className="w-8 h-8" />, title: "Fully Insured", description: "All rentals come with comprehensive insurance coverage" },
    { icon: <Clock className="w-8 h-8" />, title: "24/7 Support", description: "Round-the-clock customer assistance" },
    { icon: <MapPin className="w-8 h-8" />, title: "Multiple Locations", description: "Pick up and drop off at convenient locations" },
    { icon: <Sparkles className="w-8 h-8" />, title: "Premium Fleet", description: "Access to luxury and premium vehicles" }
  ];

  return (
    <div className="bg-gray-950 text-white min-h-screen overflow-x-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection("home")}>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 p-1.5 rounded-lg transform transition-transform group-hover:scale-110">
                <Car className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                DriveNow
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("home")} className="text-gray-300 hover:text-yellow-400 transition">Home</button>
              <button onClick={() => scrollToSection("cars")} className="text-gray-300 hover:text-yellow-400 transition">Cars</button>
              <button onClick={() => scrollToSection("features")} className="text-gray-300 hover:text-yellow-400 transition">Features</button>
              <button onClick={() => scrollToSection("contact")} className="text-gray-300 hover:text-yellow-400 transition">Contact</button>
            </div>

            {!user ? (
              <div className="flex gap-3">
                <Link to="/login" className="px-5 py-2 text-yellow-400 border border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition transform hover:scale-105">
                  Sign Up
                </Link>
              </div>
            ) : (
              <button onClick={handleLogout} className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition">
                Logout
              </button>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 py-4">
            <div className="flex flex-col items-center gap-4">
              <button onClick={() => scrollToSection("home")} className="text-gray-300 hover:text-yellow-400">Home</button>
              <button onClick={() => scrollToSection("cars")} className="text-gray-300 hover:text-yellow-400">Cars</button>
              <button onClick={() => scrollToSection("features")} className="text-gray-300 hover:text-yellow-400">Features</button>
              <button onClick={() => scrollToSection("contact")} className="text-gray-300 hover:text-yellow-400">Contact</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={img} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent"></div>
            </div>
          ))}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute bottom-8 right-8 z-20 bg-black/50 p-3 rounded-full hover:bg-black/70 transition"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                Premium Car Rental Service
              </span>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Rent Your{" "}
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                  Dream Car
                </span>{" "}
                Today
              </h1>
              <p className="text-gray-300 text-lg mt-6">
                Discover premium vehicles at affordable prices. Book your ride in seconds and experience luxury driving anywhere.
              </p>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => scrollToSection("cars")}
                  className="group bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-500/25 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  Browse Cars
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
                <button className="border border-gray-600 px-8 py-3 rounded-lg font-semibold hover:border-yellow-400 hover:text-yellow-400 transition">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-yellow-400 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-2xl text-yellow-400 group-hover:scale-110 transition-transform mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 z-20 relative">
        <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                placeholder="Pickup Location"
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="w-full bg-gray-800 pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none transition"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={searchData.startDate}
                onChange={(e) => setSearchData({ ...searchData, startDate: e.target.value })}
                className="w-full bg-gray-800 pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none transition"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={searchData.endDate}
                onChange={(e) => setSearchData({ ...searchData, endDate: e.target.value })}
                className="w-full bg-gray-800 pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none transition"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Featured Cars Section - DYNAMIC FROM BACKEND */}
      <section id="cars" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured{" "}
              <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                Vehicles
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose from our extensive collection of {allCars.length} premium vehicles
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredCars.length === 0 ? (
            <div className="text-center py-20">
              <Car className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No vehicles available</h3>
              <p className="text-gray-400">Please check back later for new vehicles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car, index) => (
                <div
                  key={car._id || index}
                  className="group bg-gray-900 rounded-2xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={car.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                    {car.status === "active" && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        Available
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">
                        {car.brand} {car.model}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm">4.8</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        {car.year || "2024"}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Fuel className="w-3 h-3" />
                        {car.fuel_type || "Petrol"}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Gauge className="w-3 h-3" />
                        {car.vehicle_type || "Luxury"}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Navigation className="w-3 h-3" />
                        {car.location || "Multiple"}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-yellow-500">
                          ₹{car.price_per_day?.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-sm"> /day</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRentNow(car._id)}
                      className="w-full bg-gray-800 group-hover:bg-yellow-500 text-white group-hover:text-black py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Rent Now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {allCars.length > 6 && (
            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/customer")}
                className="inline-flex items-center gap-2 border border-yellow-500 text-yellow-500 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 hover:text-black transition"
              >
                View All {allCars.length} Vehicles
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                DriveNow
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience the best car rental service with our premium features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-800/50 rounded-2xl hover:bg-gray-800 transition-all group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-2xl text-yellow-400 group-hover:scale-110 transition-transform mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-500 to-yellow-400 p-12 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-black rounded-full filter blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
                Choose from {allCars.length}+ vehicles and book instantly. Experience luxury driving today!
              </p>
              <button
                onClick={() => scrollToSection("cars")}
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition transform hover:scale-105"
              >
                Book a Car
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Car className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-bold">DriveNow</span>
              </div>
              <p className="text-gray-400 text-sm">
                Premium car rental service offering the best vehicles at affordable prices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => scrollToSection("home")} className="hover:text-yellow-400 transition">Home</button></li>
                <li><button onClick={() => scrollToSection("cars")} className="hover:text-yellow-400 transition">Cars</button></li>
                <li><button onClick={() => scrollToSection("features")} className="hover:text-yellow-400 transition">Features</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 234 567 890</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@drivenow.com</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition cursor-pointer group">
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-black" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition cursor-pointer group">
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-black" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-black transition cursor-pointer group">
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-black" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-800 text-gray-500 text-sm">
        © 2026 DriveNow. All rights reserved. | Premium Car Rental Service
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
