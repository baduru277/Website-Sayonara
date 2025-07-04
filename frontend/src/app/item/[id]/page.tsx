'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

// Mock data - in real app this would come from API
const itemData = {
  id: 1,
  title: "iPhone 13 Pro",
  description: "Excellent condition iPhone 13 Pro, 256GB, Space Gray. Purchased in January 2023, comes with original box and charger. No scratches or dents, battery health at 95%. Looking to trade for something of similar value.",
  images: [
    "/api/placeholder/600/400",
    "/api/placeholder/600/400",
    "/api/placeholder/600/400"
  ],
  category: "Electronics",
  condition: "Excellent",
  owner: {
    name: "TechTrader",
    avatar: "/api/placeholder/50/50",
    rating: 4.8,
    trades: 45,
    memberSince: "2022"
  },
  location: "New York, NY",
  tradeFor: "MacBook Air (M1 or newer), iPad Pro, or cash offers around $800",
  postedDate: "2 days ago",
  views: 127,
  likes: 23
};

export default function ItemDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showTradeModal, setShowTradeModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Main Image Placeholder</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {itemData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-200 rounded-lg flex items-center justify-center ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <span className="text-gray-500 text-xs">Img {index + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Item Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                    {itemData.category}
                  </span>
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                    {itemData.condition}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {itemData.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>📍 {itemData.location}</span>
                  <span>👁️ {itemData.views} views</span>
                  <span>❤️ {itemData.likes} likes</span>
                  <span>Posted {itemData.postedDate}</span>
                </div>
              </div>

              {/* Owner Info */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">{itemData.owner.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{itemData.owner.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>⭐ {itemData.owner.rating}</span>
                      <span>•</span>
                      <span>{itemData.owner.trades} trades</span>
                      <span>•</span>
                      <span>Member since {itemData.owner.memberSince}</span>
                    </div>
                  </div>
                  <button className="btn btn-outline text-sm">
                    View Profile
                  </button>
                </div>
              </div>

              {/* Trade Preferences */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Trade for:</h3>
                <p className="text-gray-700">{itemData.tradeFor}</p>
              </div>

              {/* Description */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{itemData.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTradeModal(true)}
                  className="btn btn-primary flex-1 text-lg py-3"
                >
                  💬 Propose Trade
                </button>
                <button className="btn btn-outline text-lg py-3">
                  ❤️ Save
                </button>
                <button className="btn btn-outline text-lg py-3">
                  📤 Share
                </button>
              </div>
            </div>
          </div>

          {/* Similar Items */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="card p-4 hover:shadow-lg transition-all duration-300">
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-500">Similar Item {item}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Similar Item Title</h3>
                  <p className="text-sm text-gray-600 mb-2">Brief description...</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">📍 Location</span>
                    <button className="btn btn-primary text-sm px-3 py-1">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Modal */}
        {showTradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Propose a Trade</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are you offering?
                  </label>
                  <textarea
                    rows={3}
                    className="input"
                    placeholder="Describe what you want to trade..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    rows={3}
                    className="input"
                    placeholder="Add a message to the owner..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Send Trade Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTradeModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 