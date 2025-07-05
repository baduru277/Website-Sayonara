"use client";
import { useState } from 'react';
import Link from 'next/link';

const likedItems = [
  {
    id: 101,
    title: "Samsung Galaxy S22 Ultra",
    description: "Phantom Black, 256GB, 12GB RAM",
    image: "/api/placeholder/300/200",
    category: "Electronics",
    owner: "MobileGuru",
    location: "Bangalore, IN",
    tradeFor: "iPhone 14 Pro or cash",
    price: 95000,
    views: 210,
    likes: 120
  },
  {
    id: 102,
    title: "Apple Watch Series 8",
    description: "GPS + Cellular, 45mm, Silver",
    image: "/api/placeholder/300/200",
    category: "Wearables",
    owner: "WatchFan",
    location: "Delhi, IN",
    tradeFor: "Fitbit Sense or cash",
    price: 35000,
    views: 98,
    likes: 60
  },
  {
    id: 103,
    title: "GoPro HERO10 Black",
    description: "5.3K60 Ultra HD, Waterproof",
    image: "/api/placeholder/300/200",
    category: "Cameras",
    owner: "AdventurePro",
    location: "Pune, IN",
    tradeFor: "DJI Osmo or cash",
    price: 40000,
    views: 75,
    likes: 33
  },
  {
    id: 104,
    title: "Sony WH-1000XM4 Headphones",
    description: "Wireless, Noise Cancelling, Black",
    image: "/api/placeholder/300/200",
    category: "Audio",
    owner: "SoundLover",
    location: "Hyderabad, IN",
    tradeFor: "Bose QC45 or cash",
    price: 22000,
    views: 120,
    likes: 44
  },
  {
    id: 105,
    title: "Canon EOS 1500D DSLR",
    description: "18-55mm Lens, 24.1MP, WiFi",
    image: "/api/placeholder/300/200",
    category: "Cameras",
    owner: "PhotoKing",
    location: "Chennai, IN",
    tradeFor: "Nikon D3500 or cash",
    price: 32000,
    views: 88,
    likes: 27
  },
  {
    id: 106,
    title: "Apple iPad Air (5th Gen)",
    description: "M1, 64GB, WiFi, Space Gray",
    image: "/api/placeholder/300/200",
    category: "Tablets",
    owner: "TabMaster",
    location: "Kolkata, IN",
    tradeFor: "Samsung Tab S8 or cash",
    price: 48000,
    views: 65,
    likes: 19
  }
];

const ITEMS_PER_PAGE = 5;

export default function LikedItems() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(likedItems.length / ITEMS_PER_PAGE);
  const startIdx = page * ITEMS_PER_PAGE;
  const itemsToShow = likedItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <section className="py-8 bg-white">
      <div className="container">
        <div className="flex flex-col items-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Liked Items
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Items You May Like
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base text-center">
            Based on your interests and previous likes, here are some items you may want to check out.
          </p>
        </div>

        <div className="flex gap-6 justify-center items-stretch">
          {itemsToShow.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden w-56 flex-shrink-0 flex flex-col"
            >
              <div className="relative">
                <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden">
                  <span className="text-gray-500 text-xs">Image Placeholder</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                  {item.category}
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-gray-600">
                  <span>👁️ {item.views}</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg">
                  ❤️
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">{item.owner[0]}</span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {item.owner}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    📍 {item.location}
                  </span>
                </div>
                <div className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Trade for:</span>
                  <p className="text-xs text-blue-600 mt-1 line-clamp-2">{item.tradeFor}</p>
                </div>
                <div className="mb-2">
                  <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/item/${item.id}`}
                    className="group/btn flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-3 rounded-lg font-medium text-sm hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <span className="group-hover/btn:translate-x-1 transition-transform duration-300">View Details</span>
                  </Link>
                  <button className="group/chat bg-white border-2 border-blue-200 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 transform hover:scale-105">
                    <span className="group-hover/chat:rotate-12 transition-transform duration-300">💬</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border-2 ${page === idx ? 'bg-blue-600 border-blue-600' : 'bg-white border-blue-300'} transition-all`}
              onClick={() => setPage(idx)}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 