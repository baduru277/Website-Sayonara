"use client";

import { useState } from 'react';

const heroButtons = [
  { label: 'Start Bidding' },
  { label: 'Exchange' },
  { label: 'Buy/Sell' }
];

export default function Hero() {
  const [search, setSearch] = useState('');
  return (
    <section className="bg-gradient-to-b from-purple-50 to-white w-full pt-16 pb-10 border-b border-gray-200">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-2 mt-8 drop-shadow-lg">
          Welcome to Exchange & Bidding Platform
        </h1>
        <p className="text-lg md:text-xl text-purple-500 mb-6 font-medium">
          Your ultimate destination for trading and auctions.
        </p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items like 'phone', 'chair', or 'pen'"
          className="w-full max-w-2xl px-8 py-4 mb-6 border-2 border-purple-400 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white placeholder-purple-400 shadow-lg font-medium text-purple-700"
        />
        <div className="flex flex-row gap-4 w-full justify-center mb-2">
          {heroButtons.map(btn => (
            <button
              key={btn.label}
              className="flex-1 min-w-[140px] px-8 py-3 border-2 border-purple-600 text-purple-700 font-semibold rounded-full bg-white hover:bg-purple-600 hover:text-white transition-all duration-200 text-lg shadow focus:outline-none"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
} 