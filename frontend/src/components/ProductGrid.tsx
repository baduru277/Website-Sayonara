'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductGridItem {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  condition: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  currentBid?: number;
  startingBid?: number;
  buyNowPrice?: number;
  timeLeft?: string;
  totalBids?: number;
  location: string;
  postedDate: string;
  userRating: number;
  userReviews: number;
  isVerified: boolean;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  type: 'exchange' | 'bidding' | 'resell';
  lookingFor?: string;
  exchangeType?: 'direct' | 'negotiable';
  preferredCategories?: string[];
  itemValue?: number;
  shipping?: string;
  fastShipping?: boolean;
  isPrime?: boolean;
  deliveryDate?: string;
  limitedTimeDeal?: boolean;
}

interface ProductGridProps {
  items: ProductGridItem[];
  onItemClick?: (item: ProductGridItem) => void;
  showComparison?: boolean;
}

export default function ProductGrid({ items, onItemClick, showComparison = false }: ProductGridProps) {
  const [selectedImageIndexes, setSelectedImageIndexes] = useState<{ [key: string]: number }>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatIndianPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const getActionButton = (item: ProductGridItem) => {
    switch (item.type) {
      case 'resell':
        return (
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition-colors">
            Add to cart
          </button>
        );
      case 'bidding':
        return (
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Place Bid
          </button>
        );
      case 'exchange':
        return (
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Propose Exchange
          </button>
        );
      default:
        return null;
    }
  };

  const getPriceDisplay = (item: ProductGridItem) => {
    switch (item.type) {
      case 'resell':
        return (
          <div className="space-y-1">
            {item.discount && item.discount > 0 && (
              <div className="text-red-600 font-bold text-sm">-{item.discount}%</div>
            )}
            <div className="text-lg font-bold text-gray-900">
              {formatIndianPrice(item.price!)}
            </div>
            {item.originalPrice && item.originalPrice > item.price! && (
              <div className="text-gray-500 text-sm line-through">
                M.R.P.: {formatIndianPrice(item.originalPrice)}
              </div>
            )}
          </div>
        );
      case 'bidding':
        return (
          <div className="space-y-1">
            <div className="text-lg font-bold text-gray-900">
              Current: {formatIndianPrice(item.currentBid!)}
            </div>
            <div className="text-gray-600 text-sm">
              Starting: {formatIndianPrice(item.startingBid!)}
            </div>
            <div className="text-blue-600 font-medium text-sm">{item.timeLeft} left</div>
          </div>
        );
      case 'exchange':
        return (
          <div className="space-y-1">
            <div className="text-lg font-bold text-gray-900">
              Value: {formatIndianPrice(item.itemValue!)}
            </div>
            <div className="text-purple-600 font-medium text-sm">{item.exchangeType} exchange</div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleImageClick = (itemId: string, index: number) => {
    setSelectedImageIndexes(prev => ({
      ...prev,
      [itemId]: index
    }));
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {items.map((item) => (
        <div 
          key={item.id}
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onItemClick?.(item)}
        >
          {/* Product Image Section */}
          <div className="relative p-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
              <Image
                src={item.images?.[selectedImageIndexes[item.id] || 0] || item.image}
                alt={item.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Product+Image';
                }}
              />
              
              {/* Discount Badge */}
              {item.discount && item.discount > 0 && (
                <div className="absolute top-2 left-2">
                  <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{item.discount}%
                  </div>
                </div>
              )}
              
              {/* Limited Time Deal Badge */}
              {item.limitedTimeDeal && (
                <div className="absolute top-2 right-2">
                  <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Limited time deal
                  </div>
                </div>
              )}
            </div>
            
            {/* Multiple Images Thumbnails */}
            {item.images && item.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {item.images.slice(0, 3).map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(item.id, index);
                    }}
                    className={`w-8 h-8 rounded border-2 overflow-hidden ${
                      (selectedImageIndexes[item.id] || 0) === index 
                        ? 'border-purple-500' 
                        : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${item.title} view ${index + 1}`}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information Section */}
          <div className="p-4 pt-0">
            {/* Product Title */}
            <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
              {item.title}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {renderStars(item.userRating)}
              </div>
              <span className="text-sm text-gray-600">{item.userRating}</span>
              <span className="text-sm text-gray-500">({item.userReviews})</span>
            </div>
            
            {/* Price Display */}
            <div className="mb-3">
              {getPriceDisplay(item)}
            </div>
            
            {/* Delivery Information */}
            <div className="flex items-center gap-2 mb-3">
              {item.isPrime && (
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-green-600 font-medium">prime</span>
                </div>
              )}
              {item.deliveryDate && (
                <span className="text-xs text-gray-600">
                  Get it by {item.deliveryDate}
                </span>
              )}
            </div>
            
            {/* Action Button */}
            <div className="mt-auto">
              {getActionButton(item)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 