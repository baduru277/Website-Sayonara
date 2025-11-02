import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Award, Shield, Heart, Share2, ChevronRight } from 'lucide-react';

interface BiddingItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  condition: string;
  currentBid: number;
  startingBid: number;
  buyNowPrice: number;
  timeLeft: string;
  totalBids: number;
  location: string;
  userRating: number;
  userReviews: number;
  isVerified: boolean;
  priority: 'high' | 'medium' | 'low';
}

const mockItems: BiddingItem[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max - 256GB - Natural Titanium',
    description: 'Brand new iPhone 15 Pro Max, sealed in box. Latest model with A17 Pro chip and titanium design.',
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=600&h=600&fit=crop',
    category: 'Electronics',
    condition: 'New',
    currentBid: 85000,
    startingBid: 75000,
    buyNowPrice: 95000,
    timeLeft: '2h 15m',
    totalBids: 12,
    location: 'Mumbai, India',
    userRating: 4.8,
    userReviews: 156,
    isVerified: true,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    category: 'Electronics',
    condition: 'Like New',
    currentBid: 18000,
    startingBid: 15000,
    buyNowPrice: 25000,
    timeLeft: '5h 30m',
    totalBids: 8,
    location: 'Delhi, India',
    userRating: 4.6,
    userReviews: 89,
    isVerified: true,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Nike Air Jordan 1 Retro High OG',
    description: 'Limited edition Air Jordan 1 in Chicago colorway. Size 10, deadstock condition.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    category: 'Fashion',
    condition: 'New',
    currentBid: 45000,
    startingBid: 35000,
    buyNowPrice: 60000,
    timeLeft: '1d 3h',
    totalBids: 15,
    location: 'Bangalore, India',
    userRating: 4.9,
    userReviews: 234,
    isVerified: true,
    priority: 'high',
  },
];

export default function BiddingPage() {
  const [selectedItem, setSelectedItem] = useState(mockItems[0]);
  const [bidAmount, setBidAmount] = useState('');
  const [liked, setLiked] = useState(false);

  const suggestedItems = mockItems.filter(item => item.id !== selectedItem.id);
  const minBid = selectedItem.currentBid + Math.ceil(selectedItem.currentBid * 0.05);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">LiveBid</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 transition font-medium">
              All Auctions
            </button>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition">
              My Bids
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Auction */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Left: Image & Details */}
          <div className="lg:col-span-2">
            <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300">
              
              {/* Image Container */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Time Badge */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-500/50">
                    <Clock className="w-4 h-4" />
                    {selectedItem.timeLeft}
                  </div>
                  {selectedItem.priority === 'high' && (
                    <div className="px-4 py-2 rounded-full bg-yellow-500 text-black text-sm font-bold shadow-lg">
                      🔥 HOT
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <button 
                    onClick={() => setLiked(!liked)}
                    className={`p-3 rounded-full backdrop-blur-md transition-all ${
                      liked 
                        ? 'bg-red-600/80 text-white shadow-lg shadow-red-500/50' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Priority Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="px-4 py-2 rounded-full bg-purple-600/80 backdrop-blur-md text-white text-xs font-bold">
                    {selectedItem.priority.toUpperCase()} PRIORITY
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-8">
                <h2 className="text-3xl font-black text-white mb-3 leading-tight">
                  {selectedItem.title}
                </h2>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {selectedItem.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-purple-500/20">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-500/50">
                    {selectedItem.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-600/30 text-green-300 border border-green-500/50">
                    {selectedItem.condition}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600/30 text-purple-300 border border-purple-500/50 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {selectedItem.totalBids} Bids
                  </span>
                </div>

                {/* Seller & Location */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                    <div>
                      <p className="text-white font-bold">Verified Seller</p>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <span>★ {selectedItem.userRating}</span>
                        <span className="text-gray-400">({selectedItem.userReviews})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">📍 {selectedItem.location}</p>
                    <p className="text-white font-bold">{selectedItem.condition}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bidding Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              
              {/* Current Bid Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 border border-purple-400/50 shadow-2xl shadow-purple-500/50">
                <p className="text-purple-100 text-sm font-bold mb-2 uppercase tracking-wider">Current Bid</p>
                <div className="text-5xl font-black text-white mb-3">
                  {formatCurrency(selectedItem.currentBid)}
                </div>
                <p className="text-purple-100 text-xs">
                  Starting: {formatCurrency(selectedItem.startingBid)}
                </p>
              </div>

              {/* Bid Input Card */}
              <div className="p-6 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 hover:border-purple-500/60 transition">
                <p className="text-gray-300 text-sm font-bold mb-3 uppercase tracking-wider">Your Bid</p>
                <div className="mb-3">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={formatCurrency(minBid)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Minimum: {formatCurrency(minBid)}
                </p>

                <button className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold mb-3 hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105">
                  🔨 Place Bid
                </button>

                {selectedItem.buyNowPrice > 0 && (
                  <button className="w-full px-6 py-3 rounded-lg border-2 border-green-500 text-green-400 font-bold hover:bg-green-500/10 transition">
                    ⚡ Buy Now: {formatCurrency(selectedItem.buyNowPrice)}
                  </button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="p-4 rounded-lg bg-slate-800/50 border border-green-500/30 space-y-2">
                <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                  <Shield className="w-5 h-5" />
                  Verified Seller
                </div>
                <p className="text-xs text-gray-400">✓ Trusted by community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Other Hot Auctions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              Other Hot Auctions
            </h2>
            <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Clock className="w-3 h-3" /> {item.timeLeft}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white font-bold line-clamp-2 group-hover:text-purple-300 transition mb-3">
                    {item.title}
                  </h3>
                  
                  <div className="mb-3 pb-3 border-b border-gray-700">
                    <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                      {formatCurrency(item.currentBid)}
                    </div>
                    <p className="text-xs text-gray-500">{item.totalBids} bids</p>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-yellow-400">★ {item.userRating}</span>
                    <span className="text-gray-500">{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browse by Category */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Electronics', 'Fashion', 'Collectibles', 'Art'].map((cat) => (
              <button
                key={cat}
                className="p-6 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/50 hover:border-purple-500/100 text-white font-bold hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all hover:shadow-lg hover:shadow-purple-500/50"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
