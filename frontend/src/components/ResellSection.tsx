'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ResellItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  condition: string;
  price: number;
  originalPrice: number;
  discount: number;
  shipping: string;
  location: string;
  postedDate: string;
  userRating: number;
  userReviews: number;
  isVerified: boolean;
  priority: 'high' | 'medium' | 'low';
  stock: number;
  isPrime: boolean;
  fastShipping: boolean;
}

const resellItems: ResellItem[] = [
  {
    id: '1',
    title: 'Sony WH-1000XM4 Wireless Noise Canceling Headphones',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Up to 30-hour battery life.',
    image: '/api/placeholder/300/300',
    category: 'Electronics',
    condition: 'Like New',
    price: 249.99,
    originalPrice: 349.99,
    discount: 29,
    shipping: 'Free',
    location: 'New York, NY',
    postedDate: '2 hours ago',
    userRating: 4.8,
    userReviews: 1247,
    isVerified: true,
    priority: 'high',
    stock: 5,
    isPrime: true,
    fastShipping: true
  },
  {
    id: '2',
    title: 'Nike Air Force 1 \'07 Low-Top Sneakers',
    description: 'Classic white Air Force 1s in excellent condition. Size 10, barely worn.',
    image: '/api/placeholder/300/300',
    category: 'Fashion',
    condition: 'Very Good',
    price: 89.99,
    originalPrice: 110.00,
    discount: 18,
    shipping: '$5.99',
    location: 'Los Angeles, CA',
    postedDate: '5 hours ago',
    userRating: 4.6,
    userReviews: 892,
    isVerified: true,
    priority: 'high',
    stock: 2,
    isPrime: false,
    fastShipping: true
  },
  {
    id: '3',
    title: 'Apple iPad Air (5th Generation) 64GB',
    description: 'M1 chip, 10.9-inch Liquid Retina display, Wi-Fi, Space Gray. Perfect condition with original box.',
    image: '/api/placeholder/300/300',
    category: 'Electronics',
    condition: 'Excellent',
    price: 449.99,
    originalPrice: 599.00,
    discount: 25,
    shipping: 'Free',
    location: 'San Francisco, CA',
    postedDate: '1 day ago',
    userRating: 4.9,
    userReviews: 567,
    isVerified: true,
    priority: 'high',
    stock: 1,
    isPrime: true,
    fastShipping: true
  },
  {
    id: '4',
    title: 'The Legend of Zelda: Tears of the Kingdom (Nintendo Switch)',
    description: 'Brand new, sealed copy of the latest Zelda game for Nintendo Switch.',
    image: '/api/placeholder/300/300',
    category: 'Gaming',
    condition: 'New',
    price: 54.99,
    originalPrice: 59.99,
    discount: 8,
    shipping: 'Free',
    location: 'Seattle, WA',
    postedDate: '3 days ago',
    userRating: 4.7,
    userReviews: 234,
    isVerified: false,
    priority: 'medium',
    stock: 8,
    isPrime: true,
    fastShipping: false
  },
  {
    id: '5',
    title: 'Le Creuset Dutch Oven 5.5 Quart',
    description: 'Classic round Dutch oven in Marseille blue. Excellent condition, perfect for cooking.',
    image: '/api/placeholder/300/300',
    category: 'Home & Kitchen',
    condition: 'Very Good',
    price: 199.99,
    originalPrice: 350.00,
    discount: 43,
    shipping: '$12.99',
    location: 'Chicago, IL',
    postedDate: '1 week ago',
    userRating: 4.8,
    userReviews: 156,
    isVerified: true,
    priority: 'medium',
    stock: 1,
    isPrime: false,
    fastShipping: true
  },
  {
    id: '6',
    title: 'Adidas Ultraboost 22 Running Shoes',
    description: 'Premium running shoes with Boost midsole technology. Size 9, excellent condition.',
    image: '/api/placeholder/300/300',
    category: 'Sports',
    condition: 'Good',
    price: 79.99,
    originalPrice: 190.00,
    discount: 58,
    shipping: 'Free',
    location: 'Miami, FL',
    postedDate: '2 weeks ago',
    userRating: 4.5,
    userReviews: 78,
    isVerified: false,
    priority: 'low',
    stock: 3,
    isPrime: false,
    fastShipping: false
  }
];

export default function ResellSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('best-deals');
  const [priceRange, setPriceRange] = useState('all');

  const categories = ['All', 'Electronics', 'Fashion', 'Gaming', 'Home & Kitchen', 'Sports', 'Books', 'Music'];
  const priorities = ['All', 'high', 'medium', 'low'];

  const filteredItems = resellItems.filter(item => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const priorityMatch = selectedPriority === 'All' || item.priority === selectedPriority;
    
    let priceMatch = true;
    if (priceRange === 'under-50') priceMatch = item.price < 50;
    else if (priceRange === '50-100') priceMatch = item.price >= 50 && item.price <= 100;
    else if (priceRange === '100-200') priceMatch = item.price > 100 && item.price <= 200;
    else if (priceRange === 'over-200') priceMatch = item.price > 200;
    
    return categoryMatch && priorityMatch && priceMatch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'best-deals') {
      return b.discount - a.discount;
    }
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      return b.userRating - a.userRating;
    }
    return 0;
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

  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Direct Purchase
            </h2>
            <p className="text-gray-600">
              Buy items directly from verified sellers. Fast shipping and secure payments guaranteed.
            </p>
          </div>
          <Link 
            href="/resell"
            className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Shop All Items
          </Link>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority === 'All' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="under-50">Under $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100-200">$100 - $200</option>
                  <option value="over-200">Over $200</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="best-deals">Best Deals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {sortedItems.length} items available
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
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
                <div className="absolute top-3 right-3 flex gap-1">
                  {item.isPrime && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                  )}
                  {item.isVerified && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {item.discount > 0 && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      -{item.discount}%
                    </span>
                  </div>
                )}
                {item.stock <= 3 && item.stock > 0 && (
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Only {item.stock} left
                    </span>
                  </div>
                )}
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

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-lg text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{item.shipping === 'Free' ? '🚚 Free shipping' : `🚚 ${item.shipping} shipping`}</span>
                    {item.fastShipping && <span>⚡ Fast delivery</span>}
                  </div>
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
                  <span className="text-xs text-gray-500">{item.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.postedDate}</span>
                  <div className="flex gap-2">
                    <Link
                      href={`/resell/${item.id}`}
                      className="btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Buy Now
                    </Link>
                    <Link
                      href={`/resell/${item.id}?addToCart=true`}
                      className="btn border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    >
                      Add to Cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <Link
            href="/resell"
            className="btn border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
          >
            Shop All Items
          </Link>
        </div>
      </div>
    </section>
  );
} 