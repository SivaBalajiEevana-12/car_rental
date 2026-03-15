import React from "react";

export default function NotFound() {
  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold tracking-wide">DriveNow</h1>
      </nav>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center justify-center flex-1 px-10 gap-12">

        {/* Left Text */}
        <div className="text-center md:text-left max-w-lg">

          <h1 className="text-7xl font-bold text-yellow-400">
            404
          </h1>

          <h2 className="text-4xl font-bold mt-4">
            Page Not Found
          </h2>

          <p className="text-gray-400 mt-4 text-lg">
            Looks like the road you're trying to take doesn't exist.
            Let's get you back on track and find your perfect ride.
          </p>

          <button
            onClick={() => (window.location.href = "/")}
            className="mt-8 bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Go Back Home
          </button>

        </div>

        {/* Right Image */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
            alt="car"
            className="rounded-xl shadow-2xl max-w-lg"
          />
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500">
        © 2026 DriveNow. All rights reserved.
      </footer>

    </div>
  );
}