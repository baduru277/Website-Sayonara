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
  const [carouselScroll, setCarouselScroll] = useState(0);

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
            <button className="px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 transition font-medium">
              All Auctions
            </button>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition">
              My Bids
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Auction */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Left: Image */}
          <div className="lg:col-span-2">
            <div className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20">
              <div className="relative h-96 overflow-hidden">
                <img
                  src={selectedItem?.image}
                  alt={selectedItem?.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Clock className="w-3 h-3" />
                    {selectedItem?.timeLeft}
                  </div>
                  {selectedItem?.priority === 'high' && (
                    <div className="px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold">🔥 HOT</div>
                  )}
                </div>

                <div className="absolute top-4 left-4 flex gap-2">
                  <button 
                    onClick={() => setLiked(!liked)}
                    className={`p-2 rounded-full backdrop-blur-md transition-all ${
                      liked 
                        ? 'bg-red-600/80 text-white shadow-lg shadow-red-500/50' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <h2 className="text-xl font-black text-white mb-2 line-clamp-2">{selectedItem?.title}</h2>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">{selectedItem?.description}</p>

                <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-purple-500/20">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-blue-600/30 text-blue-300">{selectedItem?.category}</span>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-green-600/30 text-green-300">{selectedItem?.condition}</span>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-purple-600/30 text-purple-300">{selectedItem?.totalBids} Bids</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-400">★ {selectedItem?.userRating}</span>
                  <span className="text-gray-400">📍 {selectedItem?.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bidding Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Current Bid */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 border border-purple-400/50 shadow-2xl shadow-purple-500/50">
                <p className="text-purple-100 text-xs font-bold mb-1 uppercase">Current Bid</p>
                <div className="text-3xl font-black text-white">{formatCurrency(selectedItem?.currentBid || 0)}</div>
                <p className="text-purple-100 text-xs mt-1">Start: {formatCurrency(selectedItem?.startingBid || 0)}</p>
              </div>

              {/* Bid Input */}
              <div className="p-5 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-purple-500/30">
                <p className="text-gray-300 text-xs font-bold mb-2 uppercase">Your Bid</p>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={formatCurrency(minBid)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-purple-500/30 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-gray-400 mt-2">Min: {formatCurrency(minBid)}</p>

                <button className="w-full mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition">
                  🔨 Place Bid
                </button>

                {selectedItem?.buyNowPrice ? (
                  <button className="w-full mt-2 px-4 py-2 rounded-lg border border-green-500 text-green-400 font-bold text-sm hover:bg-green-500/10 transition">
                    ⚡ Buy Now: {formatCurrency(selectedItem.buyNowPrice)}
                  </button>
                ) : null}
              </div>

              {/* Seller Info */}
              <div className="p-4 rounded-lg bg-slate-800/50 border border-green-500/30">
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-1">
                  <Shield className="w-4 h-4" />
                  Verified Seller
                </div>
                <p className="text-xs text-gray-400">✓ Trusted by community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel - Other Auctions */}
        <div>
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Other Hot Auctions
          </h2>

          <div className="relative group">
            {/* Previous Button */}
            <button className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-purple-600 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-purple-700">
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Carousel */}
            <div className="overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-4 min-w-max">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="flex-shrink-0 w-48 group/card cursor-pointer rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105"
                  >
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold bg-red-600 text-white flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.timeLeft}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="text-white font-bold text-xs line-clamp-2 mb-2">{item.title}</h3>
                      
                      <div className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-1">
                        {formatCurrency(item.currentBid)}
                      </div>
                      <p className="text-xs text-gray-500">{item.totalBids} bids</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 mt-2 pt-2 border-t border-gray-700">
                        <span className="text-yellow-400">★ {item.userRating}</span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-purple-600 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-purple-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
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
