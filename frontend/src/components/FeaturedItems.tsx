"use client";

import { useState } from 'react';

const featuredItems = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    description: "Excellent condition, 256GB, Space Gray",
    image: "/api/placeholder/300/200",
    category: "Electronics",
    owner: "TechTrader",
    location: "New York, NY",
    tradeFor: "MacBook Air or iPad Pro",
    price: 85000,
    views: 127,
    likes: 23
  },
  {
    id: 2,
    title: "Nike Air Jordan 1",
    description: "Retro High OG, Size 10, Like new",
    image: "/api/placeholder/300/200",
    category: "Fashion",
    owner: "SneakerHead",
    location: "Los Angeles, CA",
    tradeFor: "Yeezy 350 or cash",
    price: 15000,
    views: 89,
    likes: 45
  },
  {
    id: 3,
    title: "Guitar - Fender Stratocaster",
    description: "American Standard, Sunburst finish",
    image: "/api/placeholder/300/200",
    category: "Music",
    owner: "MusicLover",
    location: "Austin, TX",
    tradeFor: "Drum set or keyboard",
    price: 50000,
    views: 156,
    likes: 67
  },
  {
    id: 4,
    title: "Gaming PC Setup",
    description: "RTX 3080, Ryzen 7, 32GB RAM",
    image: "/api/placeholder/300/200",
    category: "Electronics",
    owner: "GamerPro",
    location: "Seattle, WA",
    tradeFor: "PS5 + games or cash",
    price: 120000,
    views: 234,
    likes: 89
  },
  {
    id: 5,
    title: "Vintage Camera Collection",
    description: "Leica M3, Canon AE-1, lenses included",
    image: "/api/placeholder/300/200",
    category: "Collectibles",
    owner: "PhotoBuff",
    location: "San Francisco, CA",
    tradeFor: "Vintage watches or art",
    price: 25000,
    views: 78,
    likes: 34
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
    <section className="py-10 bg-white">
      <div className="container">
        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Trending Items
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Featured Items
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg text-center">
            Discover amazing items available for trade. From electronics to fashion, find what you&apos;re looking for or list your own items.
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
                <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-xs font-bold">{item.owner[0]}</span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {item.owner}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    📍 {item.location}
                  </span>
                </div>
                <div className="mb-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Trade for:</span>
                  <p className="text-xs text-purple-600 mt-1 line-clamp-2">{item.tradeFor}</p>
                </div>
                <div className="mb-2">
                  <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/item/${item.id}`}
                    className="group/btn flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 px-3 rounded-lg font-medium text-sm hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <span className="group-hover/btn:translate-x-1 transition-transform duration-300">View Details</span>
                  </Link>
                  <button className="group/chat bg-white border-2 border-purple-200 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300 transform hover:scale-105">
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