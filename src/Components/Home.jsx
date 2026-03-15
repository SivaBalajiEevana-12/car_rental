import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector,useDispatch} from "react-redux";
import {  logout } from "../redux/authSlice";


const cars = [
  {
    name: "Tesla Model 3",
    price: "$120/day",
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "BMW M4",
    price: "$150/day",
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Audi R8",
    price: "$220/day",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Home() {
  const user=useSelector((state)=>state.auth.user)
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const handleLogout=()=>{
    dispatch(logout());
    navigate("/")
  }
  
//  dispatch(logout({ name: "John" }));
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold tracking-wide">DriveNow</h1>

        <div className="space-x-8 hidden md:flex">
          <a className="hover:text-gray-300">Home</a>
          <a className="hover:text-gray-300">Cars</a>
          <a className="hover:text-gray-300">Pricing</a>
          <a className="hover:text-gray-300">Contact</a>
        </div>
{!user ?
       <div className="flex gap-4">
        
    <Link to="/register" ><button className="!bg-yellow-500 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-400">
      Register
    </button>
</Link>
  <Link to="/login">
    <button className="!bg-yellow-500 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-400">
      Login
    </button>
    </Link>
  </div>: 
    <button className="!bg-yellow-500 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-400" onClick={()=>handleLogout()
    }>
      Logout
    </button>
   
}
      </nav>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 items-center px-10 py-20 gap-10">

        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Rent Your <span className="text-yellow-400">Dream Car</span> Today
          </h1>

          <p className="text-gray-400 mt-6 text-lg">
            Discover premium vehicles at affordable prices. Book your ride in
            seconds and experience luxury driving anywhere.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="!bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300">
              Browse Cars
            </button>

            <button className="border border-gray-600 px-6 py-3 rounded-lg hover:border-white">
              Learn More
            </button>
          </div>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
            alt="car"
            className="rounded-xl shadow-2xl"
          />
        </div>
      </section>

      {/* Search Box */}
      <div className="bg-gray-900 mx-10 rounded-xl p-6 shadow-lg grid md:grid-cols-4 gap-4">

        <input
          placeholder="Pickup Location"
          className="bg-gray-800 p-3 rounded-lg outline-none"
        />

        <input
          type="date"
          className="bg-gray-800 p-3 rounded-lg outline-none"
        />

        <input
          type="date"
          className="bg-gray-800 p-3 rounded-lg outline-none"
        />

    <button className="w-full !bg-yellow-400 text-black px-6 py-3 rounded-lg">
  Search
</button>
      </div>

      {/* Featured Cars */}
      <section className="px-10 py-20">

        <h2 className="text-4xl font-bold mb-10 text-center">
          Featured Vehicles
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition"
            >
              <img
                src={car.image}
                alt={car.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold">{car.name}</h3>
                <p className="text-gray-400 mt-2">{car.price}</p>

                <button className="mt-4 w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-300">
                  Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-yellow-400 text-black py-16 text-center px-10">

        <h2 className="text-4xl font-bold">
          Ready to Start Your Journey?
        </h2>

        <p className="mt-4 text-lg">
          Choose from hundreds of vehicles and book instantly.
        </p>

        <button className="mt-6 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800">
          Book a Car
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500">
        © 2026 DriveNow. All rights reserved.
      </footer>

    </div>
  );
}