'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLoading(true);
    router.push('/');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
    }, 400); // adjust as needed
  };

  return (
    <header className="bg-white border-b-2 border-purple-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo as website name, perfectly aligned */}
          <a href="/" onClick={handleLogoClick} className="flex items-center h-full cursor-pointer">
            <span className="text-4xl font-extrabold text-purple-700 underline decoration-purple-300 decoration-4 underline-offset-8 drop-shadow-lg hover:text-purple-900 transition-colors duration-300">
              Sayonara
            </span>
            {loading && (
              <span className="ml-3 animate-spin inline-block w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full"></span>
            )}
          </a>

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