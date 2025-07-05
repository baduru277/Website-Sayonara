'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-5xl font-extrabold text-purple-700 underline decoration-purple-300 decoration-4 underline-offset-8 drop-shadow-lg hover:text-purple-900 transition-colors duration-300">
            Sayonara
          </Link>

          {/* Right-side buttons */}
          <div className="flex items-center gap-6">
            <Link
              href="/add-item"
              className="px-7 py-2 border-2 border-purple-500 text-purple-700 font-semibold rounded-full bg-white hover:bg-purple-50 hover:text-purple-900 transition-all duration-200 text-xl shadow-sm focus:outline-none"
            >
              Post
            </Link>
            <select
              className="px-7 py-2 border-2 border-purple-500 text-purple-700 font-semibold rounded-full bg-white hover:bg-purple-50 hover:text-purple-900 transition-all duration-200 text-xl shadow-sm focus:outline-none"
              defaultValue="Choose Location"
            >
              <option disabled>Choose Location</option>
              <option>Delhi</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
              <option>Chennai</option>
              <option>Kolkata</option>
            </select>
            <Link
              href="/login"
              className="px-7 py-2 border-2 border-purple-500 text-purple-700 font-semibold rounded-full bg-white hover:bg-purple-50 hover:text-purple-900 transition-all duration-200 text-xl shadow-sm focus:outline-none"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 