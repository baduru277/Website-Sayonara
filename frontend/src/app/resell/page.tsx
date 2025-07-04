'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Mock auction data
const auctions = [
  {
    id: 1,
    title: "iPhone 13 Pro - 256GB",
    description: "Excellent condition, comes with original box and accessories. No scratches or dents.",
    image: "/api/placeholder/300/200",
    currentBid: 750,
    startingBid: 500,
    totalBids: 23,
    timeLeft: "2 hours 15 min",
    endTime: "2024-01-15T18:00:00Z",
    seller: {
      name: "TechTrader",
      rating: 4.8,
      trades: 45
    },
    condition: "Excellent",
    location: "New York, NY",
    views: 156,
    watchers: 12
  },
  {
    id: 2,
    title: "MacBook Pro 2021 - M1 Pro",
    description: "16GB RAM, 512GB SSD. Like new condition, barely used for 6 months.",
    image: "/api/placeholder/300/200",
    currentBid: 1200,
    startingBid: 800,
    totalBids: 18,
    timeLeft: "1 day 4 hours",
    endTime: "2024-01-16T12:00:00Z",
    seller: {
      name: "MacUser",
      rating: 4.9,
      trades: 67
    },
    condition: "Like New",
    location: "Los Angeles, CA",
    views: 234,
    watchers: 19
  },
  {
    id: 3,
    title: "Nike Air Jordan 1 Retro High OG",
    description: "Size 10, Chicago colorway. Limited edition, excellent condition.",
    image: "/api/placeholder/300/200",
    currentBid: 450,
    startingBid: 300,
    totalBids: 31,
    timeLeft: "5 hours 30 min",
    endTime: "2024-01-15T21:30:00Z",
    seller: {
      name: "SneakerHead",
      rating: 4.7,
      trades: 23
    },
    condition: "Excellent",
    location: "Chicago, IL",
    views: 189,
    watchers: 15
  }
];

const categories = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Sports",
  "Collectibles",
  "Home & Garden",
  "Books",
  "Music",
  "Tools"
];

export default function ResellPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAuction && bidAmount) {
      console.log(`Bidding $${bidAmount} on ${selectedAuction.title}`);
      setShowBidModal(false);
      setBidAmount('');
      setSelectedAuction(null);
    }
  };

  const openBidModal = (auction: any) => {
    setSelectedAuction(auction);
    setBidAmount((auction.currentBid + 10).toString());
    setShowBidModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Resell & Auction
            </h1>
            <p className="text-gray-600">
              Bid on items or list your own for auction
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input"
                />
              </div>
              
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input"
                >
                  <option value="ending-soon">Ending Soon</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="most-bids">Most Bids</option>
                </select>
              </div>
            </div>
          </div>

          {/* Featured Auctions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Auctions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.slice(0, 3).map((auction) => (
                <div key={auction.id} className="card p-4 hover:shadow-lg transition-all duration-300">
                  <div className="relative mb-4">
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Auction Image</span>
                    </div>
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                      🔥 Hot
                    </div>
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {auction.totalBids} bids
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {auction.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {auction.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current Bid:</span>
                      <span className="font-semibold text-green-600">${auction.currentBid}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Time Left:</span>
                      <span className="font-medium text-red-600">{auction.timeLeft}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Seller:</span>
                      <span className="text-blue-600">{auction.seller.name}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openBidModal(auction)}
                      className="btn btn-primary flex-1"
                    >
                      Place Bid
                    </button>
                    <button className="btn btn-outline px-3">
                      👁️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Auctions */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Auctions</h2>
              <button className="btn btn-primary">
                + Create Auction
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {auctions.map((auction) => (
                <div key={auction.id} className="card p-4 hover:shadow-lg transition-all duration-300">
                  <div className="relative mb-4">
                    <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Auction Image</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {auction.totalBids} bids
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {auction.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current:</span>
                      <span className="font-semibold">${auction.currentBid}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Ends:</span>
                      <span className="text-red-600">{auction.timeLeft}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openBidModal(auction)}
                      className="btn btn-primary text-sm flex-1"
                    >
                      Bid Now
                    </button>
                    <button className="btn btn-outline text-sm px-3">
                      👁️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How Auctions Work
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Place Your Bid</h3>
                <p className="text-gray-600">
                  Bid on items you want. You can increase your bid anytime before the auction ends.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Watch the Clock</h3>
                <p className="text-gray-600">
                  Auctions have time limits. The highest bidder when time runs out wins the item.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay & Collect</h3>
                <p className="text-gray-600">
                  If you win, pay securely through our platform and arrange pickup or shipping.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bid Modal */}
        {showBidModal && selectedAuction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Place Your Bid</h3>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">{selectedAuction.title}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Bid:</span>
                    <span className="font-semibold">${selectedAuction.currentBid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time Left:</span>
                    <span className="text-red-600">{selectedAuction.timeLeft}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBid} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid Amount ($)
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={selectedAuction.currentBid + 1}
                    step="1"
                    className="input"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum bid: ${selectedAuction.currentBid + 1}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Place Bid
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBidModal(false)}
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