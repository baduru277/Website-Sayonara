'use client';

import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Award, Shield, Heart, Share2, ChevronRight, ChevronLeft } from 'lucide-react';
import apiService from '@/services/api';

interface BiddingItem {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  category: string;
  condition: string;
  currentBid: number;
  startingBid: number;
  buyNowPrice?: number;
  timeLeft: string;
  totalBids: number;
  location: string;
  userRating: number;
  userReviews: number;
  isVerified: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function BiddingPage() {
  const [items, setItems] = useState<BiddingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<BiddingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchBiddingItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getBiddingItems();
        const apiItems = Array.isArray(response) ? response : (response?.items || []);
        
        if (!apiItems || apiItems.length === 0) {
          setError('No bidding items available');
          setLoading(false);
          return;
        }

        const transformedItems = apiItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
          images: item.images || [],
          category: item.category,
          condition: item.condition,
          currentBid: parseFloat(item.currentBid || item.startingBid || '0'),
          startingBid: parseFloat(item.startingBid || '0'),
          buyNowPrice: parseFloat(item.buyNowPrice || '0'),
          timeLeft: calculateTimeLeft(item.auctionEndDate),
          totalBids: item.totalBids || 0,
          location: item.location || 'India',
          userRating: item.user?.rating || 4.5,
          userReviews: item.user?.reviewCount || 0,
          isVerified: item.user?.isVerified || false,
          priority: calculatePriority(item.auctionEndDate, item.totalBids || 0),
        }));

        setItems(transformedItems);
        setSelectedItem(transformedItems[0]);
      } catch (err) {
        console.error('Failed to fetch bidding items:', err);
        setError('Failed to load bidding items');
      } finally {
        setLoading(false);
      }
    };

    fetchBiddingItems();
  }, []);

  const calculateTimeLeft = (auctionEndDate: string) => {
    const end = new Date(auctionEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h`;
    return 'Ending Soon!';
  };

  const calculatePriority = (auctionEndDate: string, totalBids: number) => {
    const end = new Date(auctionEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 3 || totalBids > 20) return 'high';
    if (hours < 12 || totalBids > 10) return 'medium';
    return 'low';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading auctions...</p>
        </div>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 text-lg">{error || 'No auctions available'}</p>
        </div>
      </div>
    );
  }

  const minBid = selectedItem ? selectedItem.currentBid + Math.ceil(selectedItem.currentBid * 0.05) : 0;

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
            <button className="px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 transition font-medium text-sm">
              All Auctions
            </button>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition text-sm">
              My Bids
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Carousel - Tiles Only */}
        <div>
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Live Auctions
          </h2>

          <div className="relative group">
            {/* Previous Button */}
            <button className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-purple-600 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-purple-700 shadow-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Carousel Container */}
            <div className="overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-3 min-w-max px-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`flex-shrink-0 w-44 group/card cursor-pointer rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 transition-all duration-300 ${
                      selectedItem?.id === item.id
                        ? 'border-purple-500 shadow-lg shadow-purple-500/50'
                        : 'border-purple-500/20 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-32 overflow-hidden bg-gray-700">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      
                      {/* Time Badge */}
                      <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold bg-red-600 text-white flex items-center gap-1 shadow-md">
                        <Clock className="w-3 h-3" /> {item.timeLeft}
                      </div>

                      {/* Hot Badge */}
                      {item.priority === 'high' && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold bg-yellow-500 text-black shadow-md">
                          🔥 HOT
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="p-3">
                      <h3 className="text-white font-bold text-xs line-clamp-2 mb-2 text-left">{item.title}</h3>
                      
                      {/* Price */}
                      <div className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-1 text-left">
                        {formatCurrency(item.currentBid)}
                      </div>
                      
                      {/* Bids Count */}
                      <p className="text-xs text-gray-400 mb-2 text-left">{item.totalBids} bids</p>
                      
                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700">
                        <span className="text-yellow-400">★ {item.userRating}</span>
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-purple-600 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-purple-700 shadow-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Item Details */}
        {selectedItem && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left: Product Image */}
              <div className="md:col-span-1">
                <div className="relative rounded-lg overflow-hidden bg-gray-700 h-64">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop';
                    }}
                  />
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => setLiked(!liked)}
                    className={`flex-1 py-2 rounded-lg transition-all font-bold text-sm ${
                      liked 
                        ? 'bg-red-600 text-white' 
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 inline mr-1 ${liked ? 'fill-current' : ''}`} />
                    {liked ? 'Liked' : 'Like'}
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition font-bold text-sm">
                    <Share2 className="w-4 h-4 inline mr-1" />
                    Share
                  </button>
                </div>
              </div>

              {/* Middle: Product Details */}
              <div className="md:col-span-1">
                <h2 className="text-2xl font-black text-white mb-3">{selectedItem.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{selectedItem.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-blue-600/30 text-blue-300">{selectedItem.category}</span>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-green-600/30 text-green-300">{selectedItem.condition}</span>
                </div>

                {/* Location & Rating */}
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">📍 {selectedItem.location}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold">★ {selectedItem.userRating}</span>
                    <span className="text-gray-500 text-xs">({selectedItem.userReviews} reviews)</span>
                    {selectedItem.isVerified && (
                      <Shield className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>

                {/* Seller Info */}
                <div className="p-3 rounded-lg bg-slate-900/50 border border-green-500/30">
                  <p className="text-green-400 text-xs font-bold">✓ Verified Seller</p>
                  <p className="text-gray-400 text-xs">Trusted by community</p>
                </div>
              </div>

              {/* Right: Bidding Panel */}
              <div className="md:col-span-1">
                <div className="space-y-3">
                  {/* Current Bid */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 border border-purple-400/50 shadow-lg shadow-purple-500/50">
                    <p className="text-purple-100 text-xs font-bold mb-1 uppercase">Current Bid</p>
                    <div className="text-3xl font-black text-white">{formatCurrency(selectedItem.currentBid)}</div>
                    <p className="text-purple-100 text-xs mt-1">Start: {formatCurrency(selectedItem.startingBid)}</p>
                  </div>

                  {/* Bid Input */}
                  <div className="p-4 rounded-lg bg-slate-800 border border-purple-500/30">
                    <p className="text-gray-300 text-xs font-bold mb-2 uppercase">Your Bid</p>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={formatCurrency(minBid)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-500/30 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 mb-2"
                    />
                    <p className="text-xs text-gray-400 mb-3">Min: {formatCurrency(minBid)}</p>

                    <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition mb-2">
                      🔨 Place Bid
                    </button>

                    {selectedItem.buyNowPrice ? (
                      <button className="w-full px-4 py-2 rounded-lg border border-green-500 text-green-400 font-bold text-sm hover:bg-green-500/10 transition">
                        ⚡ Buy Now: {formatCurrency(selectedItem.buyNowPrice)}
                      </button>
                    ) : null}
                  </div>

                  {/* Auction Ends */}
                  <div className="p-3 rounded-lg bg-slate-800 border border-red-500/30 text-center">
                    <p className="text-red-400 font-bold text-sm">Ends in {selectedItem.timeLeft}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
