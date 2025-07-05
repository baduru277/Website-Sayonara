"use client";

import { useState } from 'react';

export default function Hero() {
  const [search, setSearch] = useState('');
  return (
    <section className="bg-gray-50 w-full py-12 border-b border-gray-200">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-2 mt-6 drop-shadow-sm">
          Welcome to Exchange & Bidding Platform
        </h1>
        <p className="text-lg text-purple-400 mb-8 font-medium">
          Your ultimate destination for trading and auctions.
        </p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items like 'phone', 'chair', or 'pen'"
          className="w-full max-w-xl px-6 py-4 mb-8 border-2 border-purple-400 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white placeholder-purple-300 shadow-md"
        />
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-4">
          <button className="flex-1 px-8 py-3 border-2 border-purple-500 text-purple-700 font-semibold rounded-full bg-white hover:bg-purple-50 hover:text-purple-900 transition-all duration-200 text-lg shadow-sm">
            Start Bidding
          </button>
          <button className="flex-1 px-8 py-3 border-2 border-purple-500 text-purple-700 font-semibold rounded-full bg-white hover:bg-purple-50 hover:text-purple-900 transition-all duration-200 text-lg shadow-sm">
            Exchange
          </button>
          <button className="flex-1 px-8 py-3 border-2 border-purple-500 text-purple-700 font-semibold rounded-full bg-white hover:bg-purple-50 hover:text-purple-900 transition-all duration-200 text-lg shadow-sm">
            Buy/Sell
          </button>
        </div>
      </div>
    </section>
  );
} 