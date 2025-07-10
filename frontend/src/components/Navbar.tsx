"use client";
import Link from "next/link";
import SayonaraLogo from "./SayonaraLogo";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 w-full z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/">
            <span className="sr-only">Sayonara Home</span>
            <SayonaraLogo size={32} />
          </Link>
        </div>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/browse" className="text-gray-700 hover:text-[#924DAC] font-medium">Browse</Link>
          <Link href="/categories" className="text-gray-700 hover:text-[#924DAC] font-medium">Categories</Link>
          <Link href="/how-it-works" className="text-gray-700 hover:text-[#924DAC] font-medium">How it Works</Link>
          <Link href="/about" className="text-gray-700 hover:text-[#924DAC] font-medium">About</Link>
        </div>
        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Link href="/add-item">
            <button className="bg-[#924DAC] text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-[#7a3bbd] transition">Post</button>
          </Link>
          <Link href="/login">
            <button className="border border-[#924DAC] text-[#924DAC] px-4 py-2 rounded-md font-semibold hover:bg-[#f6f0fa] transition">Login</button>
          </Link>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {/* Hamburger menu logic can be added here if needed */}
        </div>
      </div>
    </nav>
  );
} 