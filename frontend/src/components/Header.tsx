'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-purple-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo as website name, perfectly aligned */}
          <Link href="/" className="flex items-center h-full">
            <span className="text-5xl font-extrabold text-purple-700 drop-shadow-lg rounded-full px-4 py-1">Sayonara</span>
          </Link>

          {/* Right-side buttons */}
          <div className="flex items-center gap-6">
            <Link
              href="/add-item"
              className="px-7 py-2 border-2 border-purple-500 text-purple-700 font-bold rounded-full bg-white hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 text-xl shadow-none focus:outline-none"
            >
              Post
            </Link>
            <select
              className="px-7 py-2 border-2 border-purple-500 text-purple-700 font-bold rounded-full bg-white hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 text-xl shadow-none focus:outline-none appearance-none"
              defaultValue="Choose Location"
              style={{ color: '#7e22ce' }}
            >
              <option disabled className="text-purple-400">Choose Location</option>
              <option className="text-purple-700">Delhi</option>
              <option className="text-purple-700">Mumbai</option>
              <option className="text-purple-700">Bangalore</option>
              <option className="text-purple-700">Chennai</option>
              <option className="text-purple-700">Kolkata</option>
            </select>
            <Link
              href="/login"
              className="px-7 py-2 border-2 border-purple-500 text-purple-700 font-bold rounded-full bg-white hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 text-xl shadow-none focus:outline-none"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
