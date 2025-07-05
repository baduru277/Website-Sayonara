"use client";

import { useState } from 'react';

export default function Hero() {
  const [search, setSearch] = useState('');
  return (
    <section className="bg-gray-50 w-full py-14 border-b border-gray-200">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-3 mt-10 drop-shadow-lg">
          Welcome to Exchange & Bidding Platform
        </h1>
        <p className="text-xl text-purple-400 mb-10 font-medium">
          Your ultimate destination for trading and auctions.
        </p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items like 'phone', 'chair', or 'pen'"
          className="w-full max-w-2xl px-8 py-5 mb-10 border-2 border-purple-400 rounded-full text-xl focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white placeholder-purple-300 shadow-lg font-medium"
        />
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center mb-2">
          <button className="flex-1 px-10 py-4 border-2 border-purple-500 text-purple-700 font-semibold rounded-full bg-white hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 text-xl shadow-md focus:outline-none">
            Start Bidding
          </button>
          <button className="flex-1 px-10 py-4 border-2 border-purple-500 text-purple-700 font-semibold rounded-full bg-white hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 text-xl shadow-md focus:outline-none">
            Exchange
          </button>
          <button className="flex-1 px-10 py-4 border-2 border-purple-500 text-purple-700 font-semibold rounded-full bg-white hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 text-xl shadow-md focus:outline-none">
            Buy/Sell
          </button>
        </div>
      </div>
    </section>
  );
} 