'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import apiService from '@/services/api';
import ProductGrid from '@/components/ProductGrid';
import { Clock, TrendingUp, Award, Shield } from 'lucide-react';

interface BiddingItem {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  condition: string;
  currentBid: number;
  startingBid: number;
  buyNowPrice: number;
  timeLeft: string;
  totalBids: number;
  location: string;
  postedDate: string;
  userRating: number;
  userReviews: number;
  isVerified: boolean;
  priority: 'high' | 'medium' | 'low';
  auctionEndDate: string;
  bidHistory: Array<{
    amount: number;
    user: string;
    time: string;
  }>;
}

const mockBiddingItems: BiddingItem[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max - 256GB - Natural Titanium',
    description: 'Brand new iPhone 15 Pro Max, sealed in box. Latest model with A17 Pro chip and titanium design.',
    image: 'https://via.placeholder.com/320x320/924DAC/FFFFFF?text=iPhone+15+Pro+Max',
    images: ['https://via.placeholder.com/320x320/924DAC/FFFFFF?text=iPhone+15+Pro+Max'],
    category: 'Electronics',
    condition: 'New',
    currentBid: 85000,
    startingBid: 75000,
    buyNowPrice: 95000,
    timeLeft: '2h 15m',
    totalBids: 12,
    location: 'Mumbai, India',
    postedDate: '2 days ago',
    userRating: 4.8,
    userReviews: 156,
    isVerified: true,
    priority: 'high',
    auctionEndDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    bidHistory: [
      { amount: 85000, user: 'TechBidder2024', time: '5 minutes ago' },
      { amount: 82000, user: 'MobileLover', time: '12 minutes ago' },
      { amount: 80000, user: 'AppleFan', time: '25 minutes ago' },
    ]
  },
  {
    id: '2',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life. Perfect condition with original box.',
    image: 'https://via.placeholder.com/320x320/924DAC/FFFFFF?text=Sony+WH-1000XM5',
    images: ['https://via.placeholder.com/320x320/924DAC/FFFFFF?text=Sony+WH-1000XM5'],
    category: 'Electronics',
    condition: 'Like New',
    currentBid: 18000,
    startingBid: 15000,
    buyNowPrice: 25000,
    timeLeft: '5h 30m',
    totalBids: 8,
    location: 'Delhi, India',
    postedDate: '1 day ago',
    userRating: 4.6,
    userReviews: 89,
    isVerified: true,
    priority: 'medium',
    auctionEndDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    bidHistory: [
      { amount: 18000, user: 'AudioEnthusiast', time: '10 minutes ago' },
      { amount: 17500, user: 'MusicLover', time: '30 minutes ago' },
    ]
  },
  {
    id: '3',
    title: 'Nike Air Jordan 1 Retro High OG - Chicago',
    description: 'Limited edition Air Jordan 1 in Chicago colorway. Size 10, deadstock condition.',
    image: 'https://via.placeholder.com/320x320/924DAC/FFFFFF?text=Air+Jordan+1+Chicago',
    images: ['https://via.placeholder.com/320x320/924DAC/FFFFFF?text=Air+Jordan+1+Chicago'],
    category: 'Fashion',
    condition: 'New',
    currentBid: 45000,
    startingBid: 35000,
    buyNowPrice: 60000,
    timeLeft: '1d 3h',
    totalBids: 15,
    location: 'Bangalore, India',
    postedDate: '3 days ago',
    userRating: 4.9,
    userReviews: 234,
    isVerified: true,
    priority: 'high',
    auctionEndDate: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
    bidHistory: [
      { amount: 45000, user: 'SneakerHead', time: '2 minutes ago' },
      { amount: 44000, user: 'JordanCollector', time: '15 minutes ago' },
    ]
  }
];

export default function BiddingPage() {
  const [biddingItems, setBiddingItems] = useState<BiddingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<BiddingItem | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    const fetchBiddingItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getBiddingItems();
        const items = Array.isArray(response) ? response : (response?.items || []);
        
        if (!items || items.length === 0) {
          setBiddingItems(mockBiddingItems);
          setSelectedItem(mockBiddingItems[0]);
          return;
        }
        
        let transformedItems = items?.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.images?.[0] || 'https://via.placeholder.com/320x320/cccccc/666666?text=No+Image',
          images: Array.isArray(item.images) && item.images.length > 0 
            ? item.images 
            : ['https://via.placeholder.com/320x320/cccccc/666666?text=No+Image'],
          category: item.category,
          condition: item.condition,
          currentBid: parseFloat(item.currentBid || item.startingBid || '10'),
          startingBid: parseFloat(item.startingBid || '10'),
          buyNowPrice: parseFloat(item.buyNowPrice || '0'),
          timeLeft: item.auctionEndDate ? calculateTimeLeft(item.auctionEndDate) : '7 days',
          totalBids: item.totalBids || 0,
          location: 'India',
          postedDate: formatPostedDate(item.createdAt),
          userRating: item.user?.rating || 4.5,
          userReviews: item.user?.reviewCount || 0,
          isVerified: item.user?.isVerified || false,
          priority: item.auctionEndDate ? calculatePriority(item.auctionEndDate, item.totalBids || 0) : 'medium',
          auctionEndDate: item.auctionEndDate || '',
          bidHistory: item.bids?.map((bid: any) => ({
            amount: parseFloat(bid.amount),
            user: bid.bidder?.username || 'Anonymous',
            time: formatBidTime(bid.createdAt)
          })) || []
        })) || [];
        
        setBiddingItems(transformedItems);
        if (transformedItems.length > 0) {
          setSelectedItem(transformedItems[0]);
        }
      } catch (err) {
        console.error('Failed to fetch bidding items:', err);
        setBiddingItems(mockBiddingItems);
        setSelectedItem(mockBiddingItems[0]);
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

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const formatBidTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getSuggestedItems = (currentItem: BiddingItem) => {
    return biddingItems.filter(item => item.id !== currentItem.id).slice(0, 3);
  };

  const categories = ['All', ...new Set(biddingItems.map(item => item.category))];
  const filteredItems = filterCategory === 'All' 
    ? biddingItems 
    : biddingItems.filter(item => item.category === filterCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading exclusive auctions...</p>
        </div>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">No auctions available</h3>
          <p className="text-gray-400">Check back soon for amazing deals</p>
        </div>
      </div>
    );
  }

  const suggestedItems = getSuggestedItems(selectedItem);
  const bidIncrement = Math.ceil(selectedItem.currentBid * 0.05);
  const suggestedBid = selectedItem.currentBid + bidIncrement;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Award className="w-8 h-8" /> Live Auctions
              </h1>
              <p className="text-purple-100 mt-1">Bid on exclusive items and win amazing deals</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{biddingItems.length}</p>
              <p className="text-purple-100 text-sm">Active Auctions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Main Item - Featured Auction */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-2xl border border-purple-500/30 p-6 overflow-hidden">
              
              {/* Image Section */}
              <div className="relative mb-6">
                <div className="relative w-full h-96 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x400/924DAC/FFFFFF?text=Item+Image';
                    }}
                  />
                  
                  {/* Time Badge */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white flex items-center gap-1 shadow-lg`}>
                      <Clock className="w-4 h-4" /> {selectedItem.timeLeft}
                    </div>
                    {selectedItem.priority === 'high' && (
                      <div className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500 text-gray-900 shadow-lg">
                        🔥 HOT
                      </div>
                    )}
                  </div>
                  
                  {/* Priority Indicator */}
                  <div className="absolute bottom-4 left-4">
                    <div className={`${getPriorityBadge(selectedItem.priority)} px-3 py-1 rounded-full text-xs font-bold text-white`}>
                      {selectedItem.priority.toUpperCase()} PRIORITY
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{selectedItem.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/50">
                    {selectedItem.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/50">
                    {selectedItem.condition}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/50 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {selectedItem.totalBids} bids
                  </span>
                </div>

                {/* Location & Rating */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4 pb-4 border-b border-gray-700">
                  <span>📍 {selectedItem.location}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">★ {selectedItem.userRating}</span>
                    <span className="text-gray-500">({selectedItem.userReviews})</span>
                    {selectedItem.isVerified && (
                      <Shield className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Bid History */}
              {selectedItem.bidHistory.length > 0 && (
                <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-3">Recent Bids</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedItem.bidHistory.slice(0, 4).map((bid, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{bid.user}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-400">{formatIndianCurrency(bid.amount)}</span>
                          <span className="text-gray-500 text-xs">{bid.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bidding Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-2xl p-6 sticky top-4">
              
              {/* Current Bid */}
              <div className="mb-6 pb-6 border-b border-white/20">
                <p className="text-purple-100 text-sm mb-1">Current Bid</p>
                <div className="text-4xl font-bold text-white">
                  {formatIndianCurrency(selectedItem.currentBid)}
                </div>
                <p className="text-purple-100 text-xs mt-2">
                  Starting: {formatIndianCurrency(selectedItem.startingBid)}
                </p>
              </div>

              {/* Bid Input */}
              <div className="mb-6">
                <p className="text-white text-sm font-semibold mb-2">Your Bid</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Min: ${formatIndianCurrency(suggestedBid)}`}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:border-white/60"
                  />
                </div>
                <p className="text-xs text-purple-100 mt-2">
                  Suggested: {formatIndianCurrency(suggestedBid)}
                </p>
              </div>

              {/* Action Buttons */}
              <button className="w-full bg-white text-purple-600 px-4 py-3 rounded-lg font-bold mb-3 hover:bg-gray-100 transition-colors shadow-lg">
                🔨 Place Bid
              </button>

              {selectedItem.buyNowPrice > 0 && (
                <button className="w-full border-2 border-white text-white px-4 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
                  ⚡ Buy Now: {formatIndianCurrency(selectedItem.buyNowPrice)}
                </button>
              )}

              {/* Seller Info */}
              <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
                <p className="text-white text-sm font-semibold mb-2">Seller</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Verified Seller</p>
                    <p className="text-purple-100 text-xs">Trusted by community</p>
                  </div>
                  {selectedItem.isVerified && (
                    <Shield className="w-6 h-6 text-green-300" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Auctions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" /> Other Hot Auctions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-purple-500/50 transition-all border border-purple-500/20 hover:border-purple-500/60 group"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Item';
                    }}
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold bg-red-500 text-white flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.timeLeft}
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h4>
                  
                  <div className="mb-3">
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                      {formatIndianCurrency(item.currentBid)}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">({item.totalBids} bids)</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="text-yellow-400">★ {item.userRating}</span>
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Browse by Category</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <ProductGrid
            items={filteredItems.map(item => ({
              ...item,
              type: 'bidding' as const,
              isPrime: item.priority === 'high',
              tags: [],
            }))}
          />
        </div>
      </div>
    </div>
  );
}
