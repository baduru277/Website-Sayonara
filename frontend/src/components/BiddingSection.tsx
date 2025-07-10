'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import apiService from '@/services/api';

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
  postedDate: string;
  userRating: number;
  userReviews: number;
  isVerified: boolean;
  priority: 'high' | 'medium' | 'low';
  auctionEndDate: string;
}

export default function BiddingSection() {
  const [biddingItems, setBiddingItems] = useState<BiddingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bidding items from API
  useEffect(() => {
    const fetchBiddingItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getBiddingItems();
        
        // Transform API response to match our interface
        const transformedItems = response.items?.map((item: {
          id: string;
          title: string;
          description: string;
          images?: string[];
          category: string;
          condition: string;
          currentBid: string;
          startingBid: string;
          buyNowPrice?: string;
          totalBids?: number;
          location?: string;
          createdAt: string;
          auctionEndDate: string;
          user?: {
            rating?: number;
            reviewCount?: number;
            isVerified?: boolean;
          };
        }) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.images?.[0] || '/api/placeholder/300/300',
          category: item.category,
          condition: item.condition,
          currentBid: parseFloat(item.currentBid) || parseFloat(item.startingBid),
          startingBid: parseFloat(item.startingBid),
          buyNowPrice: parseFloat(item.buyNowPrice || '0'),
          timeLeft: calculateTimeLeft(item.auctionEndDate),
          totalBids: item.totalBids || 0,
          location: item.location || 'Unknown',
          postedDate: formatPostedDate(item.createdAt),
          userRating: item.user?.rating || 4.5,
          userReviews: item.user?.reviewCount || 0,
          isVerified: item.user?.isVerified || false,
          priority: calculatePriority(item.auctionEndDate, item.totalBids),
          auctionEndDate: item.auctionEndDate
        })) || [];
        
        setBiddingItems(transformedItems);
      } catch (err) {
        console.error('Failed to fetch bidding items:', err);
        // Fallback to mock data if API fails
        setBiddingItems(getMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchBiddingItems();
  }, []);

  // Helper functions
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

  // Mock data fallback
  const getMockData = (): BiddingItem[] => [
    {
      id: '1',
      title: 'Limited Edition Supreme Box Logo Hoodie',
      description: 'Rare Supreme Box Logo Hoodie from 2018. Size Large, perfect condition.',
      image: '/api/placeholder/300/300',
      category: 'Fashion',
      condition: 'Like New',
      currentBid: 450,
      startingBid: 200,
      buyNowPrice: 800,
      timeLeft: '2h 15m',
      totalBids: 23,
      location: 'New York, NY',
      postedDate: '1 day ago',
      userRating: 4.9,
      userReviews: 156,
      isVerified: true,
      priority: 'high',
      auctionEndDate: '2024-01-15T20:00:00Z'
    },
    {
      id: '2',
      title: 'Apple MacBook Pro M2 Pro 16"',
      description: '2023 MacBook Pro with M2 Pro chip, 16GB RAM, 512GB SSD. Mint condition.',
      image: '/api/placeholder/300/300',
      category: 'Electronics',
      condition: 'Excellent',
      currentBid: 1800,
      startingBid: 1500,
      buyNowPrice: 2500,
      timeLeft: '5h 42m',
      totalBids: 18,
      location: 'San Francisco, CA',
      postedDate: '2 days ago',
      userRating: 4.8,
      userReviews: 203,
      isVerified: true,
      priority: 'high',
      auctionEndDate: '2024-01-15T23:00:00Z'
    },
    {
      id: '3',
      title: 'Vintage Rolex Daytona 116520',
      description: 'Classic Rolex Daytona from 2005. White dial, excellent condition with papers.',
      image: '/api/placeholder/300/300',
      category: 'Luxury',
      condition: 'Excellent',
      currentBid: 8500,
      startingBid: 7000,
      buyNowPrice: 12000,
      timeLeft: '1d 3h',
      totalBids: 45,
      location: 'Beverly Hills, CA',
      postedDate: '3 days ago',
      userRating: 5.0,
      userReviews: 89,
      isVerified: true,
      priority: 'high',
      auctionEndDate: '2024-01-16T15:00:00Z'
    },
    {
      id: '4',
      title: 'Nintendo Switch OLED + Games Bundle',
      description: 'Nintendo Switch OLED with 8 games including Zelda, Mario, and Pokemon.',
      image: '/api/placeholder/300/300',
      category: 'Electronics',
      condition: 'Very Good',
      currentBid: 280,
      startingBid: 200,
      buyNowPrice: 450,
      timeLeft: '8h 30m',
      totalBids: 12,
      location: 'Seattle, WA',
      postedDate: '1 day ago',
      userRating: 4.6,
      userReviews: 67,
      isVerified: false,
      priority: 'medium',
      auctionEndDate: '2024-01-16T02:00:00Z'
    },
    {
      id: '5',
      title: 'Autographed Michael Jordan Jersey',
      description: 'Chicago Bulls #23 jersey signed by Michael Jordan. Includes certificate of authenticity.',
      image: '/api/placeholder/300/300',
      category: 'Collectibles',
      condition: 'Good',
      currentBid: 1200,
      startingBid: 800,
      buyNowPrice: 2000,
      timeLeft: '2d 5h',
      totalBids: 31,
      location: 'Chicago, IL',
      postedDate: '4 days ago',
      userRating: 4.7,
      userReviews: 134,
      isVerified: true,
      priority: 'medium',
      auctionEndDate: '2024-01-17T18:00:00Z'
    },
    {
      id: '6',
      title: 'DJI Mavic 3 Pro Drone',
      description: 'Professional drone with 4K camera and multiple batteries. Perfect for photography.',
      image: '/api/placeholder/300/300',
      category: 'Electronics',
      condition: 'Like New',
      currentBid: 950,
      startingBid: 800,
      buyNowPrice: 1400,
      timeLeft: '12h 15m',
      totalBids: 19,
      location: 'Miami, FL',
      postedDate: '2 days ago',
      userRating: 4.5,
      userReviews: 92,
      isVerified: true,
      priority: 'low',
      auctionEndDate: '2024-01-16T06:00:00Z'
    }
  ];

  // Sort items by ending soon (simplified)
  const sortedItems = [...biddingItems].sort((a, b) => {
    // Sort by time left (simplified)
    const timeA = parseInt(a.timeLeft.split('h')[0]) || 0;
    const timeB = parseInt(b.timeLeft.split('h')[0]) || 0;
    return timeA - timeB;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Priority';
    }
  };

  const formatTimeLeft = (timeLeft: string) => {
    if (timeLeft.includes('d')) {
      return timeLeft;
    }
    const hours = parseInt(timeLeft.split('h')[0]);
    if (hours < 1) {
      return 'Ending Soon!';
    }
    return timeLeft;
  };

  const getTimeColor = (timeLeft: string) => {
    if (timeLeft.includes('Ending Soon!') || timeLeft.includes('h') && parseInt(timeLeft.split('h')[0]) < 3) {
      return 'text-red-600 bg-red-100';
    }
    if (timeLeft.includes('h') && parseInt(timeLeft.split('h')[0]) < 12) {
      return 'text-yellow-600 bg-yellow-100';
    }
    return 'text-green-600 bg-green-100';
  };

  // Show only first 3 items for preview
  const previewItems = sortedItems.slice(0, 3);

  return (
    <section className="py-12 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Live Auctions
            </h2>
            <p className="text-gray-600">
              Bid on exclusive items and win amazing deals. Don&apos;t miss out on these limited-time auctions.
            </p>
          </div>
          <Link 
            href="/bidding"
            className="sayonara-btn px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Auctions
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading live auctions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Auctions</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="sayonara-btn px-6 py-2 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Items Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previewItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  {/* Item Image */}
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {getPriorityText(item.priority)}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {item.isVerified && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getTimeColor(item.timeLeft)}`}>
                        ⏰ {formatTimeLeft(item.timeLeft)}
                      </div>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-gray-500">{item.condition}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{item.category}</span>
                    </div>

                    {/* Bidding Info */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Current Bid:</span>
                        <span className="text-lg font-bold text-orange-600">${item.currentBid.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Starting Bid:</span>
                        <span className="text-sm text-gray-600">${item.startingBid.toLocaleString()}</span>
                      </div>
                      {item.buyNowPrice > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Buy Now:</span>
                          <span className="text-sm font-medium text-green-600">${item.buyNowPrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(item.userRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">
                          {item.userRating} ({item.userReviews})
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{item.totalBids} bids</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{item.location}</span>
                      <div className="flex gap-2">
                        <Link
                          href="/bidding"
                          className="sayonara-btn px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          Place Bid
                        </Link>
                        {item.buyNowPrice > 0 && (
                          <Link
                            href="/bidding"
                            className="sayonara-btn border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                          >
                            Buy Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            <div className="text-center mt-8">
              <Link
                href="/bidding"
                className="sayonara-btn border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                View All Auctions
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
} 