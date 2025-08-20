'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ComparisonItem {
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
}

interface ItemComparisonProps {
  currentItem: ComparisonItem;
  recommendations: ComparisonItem[];
  onItemSelect?: (item: ComparisonItem) => void;
}

export default function ItemComparison({ currentItem, recommendations, onItemSelect }: ItemComparisonProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getActionButton = (item: ComparisonItem) => {
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

  const getPriceDisplay = (item: ComparisonItem) => {
    switch (item.type) {
      case 'resell':
        return (
          <div className="text-sm">
            <span className="font-bold text-lg">{formatPrice(item.price!)}</span>
            {item.originalPrice && item.originalPrice > item.price! && (
              <span className="text-gray-500 line-through ml-2">{formatPrice(item.originalPrice)}</span>
            )}
          </div>
        );
      case 'bidding':
        return (
          <div className="text-sm">
            <div className="font-bold text-lg">Current: {formatPrice(item.currentBid!)}</div>
            <div className="text-gray-600">Starting: {formatPrice(item.startingBid!)}</div>
            <div className="text-blue-600 font-medium">{item.timeLeft} left</div>
          </div>
        );
      case 'exchange':
        return (
          <div className="text-sm">
            <div className="font-bold text-lg">Value: {formatPrice(item.itemValue!)}</div>
            <div className="text-purple-600 font-medium">{item.exchangeType} exchange</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Compare with similar items</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* This Item */}
        <div className="lg:col-span-1">
          <h4 className="text-lg font-medium text-gray-900 mb-4">This Item</h4>
          <div className="border border-gray-200 rounded-lg p-4">
            {/* Image Display */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
              <Image
                src={currentItem.images?.[selectedImageIndex] || currentItem.image}
                alt={currentItem.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Item+Image';
                }}
              />
            </div>
            
            {/* Multiple Images */}
            {currentItem.images && currentItem.images.length > 1 && (
              <div className="flex gap-2 mb-4">
                {currentItem.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-12 h-12 rounded border-2 overflow-hidden ${
                      selectedImageIndex === index ? 'border-purple-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${currentItem.title} view ${index + 1}`}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Item Details */}
            <div className="space-y-3">
              <h5 className="font-medium text-gray-900 text-sm leading-tight">
                {currentItem.title}
              </h5>
              
              <div className="text-xs text-gray-600">
                {currentItem.description}
              </div>
              
              {/* Price/Value Display */}
              {getPriceDisplay(currentItem)}
              
              {/* Condition & Rating */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{currentItem.condition}</span>
                <span>★ {currentItem.userRating} ({currentItem.userReviews})</span>
              </div>
              
              {/* Action Button */}
              {getActionButton(currentItem)}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-3">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((item) => (
              <div 
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-purple-300 transition-colors"
                onClick={() => onItemSelect?.(item)}
              >
                {/* Image Display */}
                <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Item+Image';
                    }}
                  />
                </div>
                
                {/* Item Details */}
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900 text-sm leading-tight">
                    {item.title}
                  </h5>
                  
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {item.description}
                  </div>
                  
                  {/* Price/Value Display */}
                  <div className="text-xs">
                    {getPriceDisplay(item)}
                  </div>
                  
                  {/* Condition & Rating */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.condition}</span>
                    <span>★ {item.userRating}</span>
                  </div>
                  
                  {/* Action Button */}
                  <div className="pt-2">
                    {getActionButton(item)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 