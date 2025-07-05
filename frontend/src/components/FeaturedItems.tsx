"use client";

import { useState } from 'react';
import Link from 'next/link';

const featuredItems = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    description: "Excellent condition, 256GB, Space Gray",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    category: "Electronics",
    owner: "TechTrader",
    location: "New York, NY",
    tradeFor: "MacBook Air or iPad Pro",
    price: 85000,
    views: 127,
    likes: 23,
    action: "Bid"
  },
  {
    id: 2,
    title: "Nike Air Jordan 1",
    description: "Retro High OG, Size 10, Like new",
    image: "https://images.unsplash.com/photo-1517263904808-5dc0d6e1ad21?auto=format&fit=crop&w=400&q=80",
    category: "Fashion",
    owner: "SneakerHead",
    location: "Los Angeles, CA",
    tradeFor: "Yeezy 350 or cash",
    price: 15000,
    views: 89,
    likes: 45,
    action: "Exchange"
  },
  {
    id: 3,
    title: "Guitar - Fender Stratocaster",
    description: "American Standard, Sunburst finish",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80",
    category: "Music",
    owner: "MusicLover",
    location: "Austin, TX",
    tradeFor: "Drum set or keyboard",
    price: 50000,
    views: 156,
    likes: 67,
    action: "Buy/Sell"
  },
  {
    id: 4,
    title: "Gaming PC Setup",
    description: "RTX 3080, Ryzen 7, 32GB RAM",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    category: "Electronics",
    owner: "GamerPro",
    location: "Seattle, WA",
    tradeFor: "PS5 + games or cash",
    price: 120000,
    views: 234,
    likes: 89,
    action: "Bid"
  },
  {
    id: 5,
    title: "Vintage Camera Collection",
    description: "Leica M3, Canon AE-1, lenses included",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    category: "Collectibles",
    owner: "PhotoBuff",
    location: "San Francisco, CA",
    tradeFor: "Vintage watches or art",
    price: 25000,
    views: 78,
    likes: 34,
    action: "Exchange"
  },
  {
    id: 6,
    title: "Mountain Bike",
    description: "Trek Fuel EX 8, Carbon frame, 29er",
    image: "/api/placeholder/300/200",
    category: "Sports",
    owner: "BikeRider",
    location: "Denver, CO",
    tradeFor: "Road bike or camping gear",
    price: 80000,
    views: 145,
    likes: 56
  },
  {
    id: 7,
    title: "Dell Optiplex 7040 All-in-One Computer",
    description: "With 24in Monitor, Windows 10 Pro",
    image: "/api/placeholder/300/200",
    category: "Computers",
    owner: "OfficeDeals",
    location: "Chicago, IL",
    tradeFor: "Laptop or cash",
    price: 40000,
    views: 120,
    likes: 22
  },
  {
    id: 8,
    title: "4K UHD LED Smart TV with Chromecast",
    description: "Brand new, 55in, warranty included",
    image: "/api/placeholder/300/200",
    category: "Electronics",
    owner: "HomeTech",
    location: "Houston, TX",
    tradeFor: "Soundbar or cash",
    price: 60000,
    views: 99,
    likes: 18
  }
];

const ITEMS_PER_PAGE = 5;

export default function FeaturedItems() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(featuredItems.length / ITEMS_PER_PAGE);
  const startIdx = page * ITEMS_PER_PAGE;
  const itemsToShow = featuredItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-10">Featured Items</h2>
        <div className="flex gap-8 overflow-x-auto flex-nowrap pb-2 hide-scrollbar">
          {itemsToShow.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-2xl shadow-lg flex flex-col w-72 h-[430px] mx-auto transition-transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className="uppercase text-xs text-gray-400 tracking-wider mb-1">{item.category}</span>
              <h3 className="text-lg font-bold text-purple-700 mb-1 text-center">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-2 text-center flex-1">{item.description}</p>
              {/* Action label as pill button */}
              {item.action === 'Exchange' ? (
                <Link href="/exchange" className="block w-full mb-2 py-2 rounded-full bg-purple-600 text-white text-center font-semibold hover:bg-purple-700 transition-colors">Exchange</Link>
              ) : item.action === 'Bid' ? (
                <Link href="/bidding" className="block w-full mb-2 py-2 rounded-full bg-purple-600 text-white text-center font-semibold hover:bg-purple-700 transition-colors">Bid</Link>
              ) : item.action === 'Buy/Sell' ? (
                <Link href="/resell" className="block w-full mb-2 py-2 rounded-full bg-purple-600 text-white text-center font-semibold hover:bg-purple-700 transition-colors">Buy/Sell</Link>
              ) : null}
              <Link
                href={`/item/${item.id}`}
                className="mt-auto w-full border-2 border-purple-500 text-purple-700 font-semibold rounded-full py-2 text-center hover:bg-purple-600 hover:text-white transition-all duration-200 text-base shadow-sm focus:outline-none"
              >
                View Item
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border-2 ${page === idx ? 'bg-purple-600 border-purple-600' : 'bg-white border-purple-300'} transition-all`}
              onClick={() => setPage(idx)}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/browse"
            className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-purple-600 border-2 border-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Browse All Items
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* Add this to your global CSS or Tailwind config for hide-scrollbar:
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/ 