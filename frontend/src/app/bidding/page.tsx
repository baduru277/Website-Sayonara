'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, TrendingUp, Award, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const router = useRouter();
  const [items, setItems] = useState<BiddingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<BiddingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading auctions...</div>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">{error || 'No auctions available'}</div>
      </div>
    );
  }

  const minBid = selectedItem ? selectedItem.currentBid + Math.ceil(selectedItem.currentBid * 0.05) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">LiveBid</h1>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 text-purple-300 hover:text-white transition-colors">
              All Auctions
            </button>
            <button className="px-4 py-2 text-purple-300 hover:text-white transition-colors">
              My Bids
            </button>
          </div>
        </div>
      </div>

      {/* Carousel - Tiles Only */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Award className="w-8 h-8 text-yellow-400" />
            Live Auctions
          </h2>
        </div>

        {/* Previous Button */}
        <div className="relative">
          <button
            onClick={() => {
              const container = document.getElementById('carousel-container');
              if (container) {
                container.scrollBy({ left: -200, behavior: 'smooth' });
              }
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Carousel Container */}
          <div
            id="carousel-container"
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/bidding/${item.id}`)}
                className="flex-shrink-0 w-44 group/card cursor-pointer rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/20 transition-all duration-300 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop';
                    }}
                  />
                  
                  {/* Time Badge */}
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timeLeft}
                  </div>

                  {/* Hot Badge */}
                  {item.priority === 'high' && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      🔥 HOT
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-3 space-y-2">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover/card:text-purple-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Price */}
                  <div className="text-green-400 font-bold text-lg">
                    {formatCurrency(item.currentBid)}
                  </div>

                  {/* Bids Count */}
                  <div className="text-purple-300 text-xs">
                    {item.totalBids} bids
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-purple-500/20">
                    <span>★ {item.userRating}</span>
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              const container = document.getElementById('carousel-container');
              if (container) {
                container.scrollBy({ left: 200, behavior: 'smooth' });
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-full shadow-lg transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
