"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const likedItems = [
  {
    id: 101,
    title: "Samsung Galaxy S22 Ultra",
    description: "Phantom Black, 256GB, 12GB RAM",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1517263904808-5dc0d6e1ad21?auto=format&fit=crop&w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1517263904808-5dc0d6e1ad21?auto=format&fit=crop&w=400&q=80",
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
          <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-2">
            Items You May Like
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base text-center">
            Based on your interests and previous likes, here are some items you may want to check out.
          </p>
        </div>

        <div className="flex gap-8 overflow-x-auto flex-nowrap pb-2 hide-scrollbar">
          {itemsToShow.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 w-72 h-[420px] transition-transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="grid-image-wrapper mb-4" style={{ height: '160px', borderRadius: '12px' }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-xl border border-gray-100 shadow-sm"
                />
              </div>
              <div className="w-full flex flex-col items-center flex-1 justify-between">
                <span className="text-xs text-gray-400 mb-1">{item.category}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 text-center">{item.description}</p>
                <span className="text-purple-600 font-semibold text-base mb-2">Trade for: {item.tradeFor}</span>
                <span className="text-lg font-bold text-gray-900 mb-2">₹{item.price.toLocaleString()}</span>
                <div className="flex items-center gap-2 mb-2">
                  <button className="text-gray-400 hover:text-red-500 transition-colors text-xl">❤️</button>
                  <span className="text-sm text-gray-500">{item.likes}</span>
                </div>
                <Link
                  href={`/item/${item.id}`}
                  className="mt-auto w-full border-2 border-purple-500 text-purple-700 font-semibold rounded-full py-3 text-center hover:bg-purple-600 hover:text-white transition-all duration-200 text-lg shadow-md focus:outline-none"
                >
                  View Details
                </Link>
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

/* Add this to your global CSS or Tailwind config for hide-scrollbar:
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/ 