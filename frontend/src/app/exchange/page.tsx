'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ExchangeItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  condition: string;
  lookingFor: string;
  location: string;
  postedDate: string;
  userRating: number;
  userReviews: number;
  isVerified: boolean;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

const exchangeItems: ExchangeItem[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro - 128GB - Space Black',
    description: 'Excellent condition iPhone 14 Pro, barely used. Comes with original box and accessories.',
    image: '/api/placeholder/300/300',
    category: 'Electronics',
    condition: 'Like New',
    lookingFor: 'MacBook Air, iPad Pro, or Gaming Laptop',
    location: 'New York, NY',
    postedDate: '2 hours ago',
    userRating: 4.8,
    userReviews: 127,
    isVerified: true,
    priority: 'high',
    tags: ['Smartphone', 'Apple', 'Premium']
  },
  {
    id: '2',
    title: 'Nike Air Jordan 1 Retro High OG',
    description: 'Classic Air Jordan 1s in Chicago colorway. Size 10, worn only a few times.',
    image: '/api/placeholder/300/300',
    category: 'Fashion',
    condition: 'Very Good',
    lookingFor: 'Yeezy 350, Air Force 1, or Designer Sneakers',
    location: 'Los Angeles, CA',
    postedDate: '5 hours ago',
    userRating: 4.6,
    userReviews: 89,
    isVerified: true,
    priority: 'high',
    tags: ['Sneakers', 'Nike', 'Limited Edition']
  },
  {
    id: '3',
    title: 'PlayStation 5 Console + 2 Controllers',
    description: 'PS5 with DualSense controllers. Includes God of War Ragnarök and Spider-Man 2.',
    image: '/api/placeholder/300/300',
    category: 'Electronics',
    condition: 'Good',
    lookingFor: 'Xbox Series X, Gaming PC, or High-end Camera',
    location: 'Chicago, IL',
    postedDate: '1 day ago',
    userRating: 4.9,
    userReviews: 203,
    isVerified: true,
    priority: 'medium',
    tags: ['Gaming', 'Sony', 'Console']
  },
  {
    id: '4',
    title: 'Canon EOS R6 Mark II Camera',
    description: 'Professional mirrorless camera with 24-105mm f/4L lens. Perfect for photography enthusiasts.',
    image: '/api/placeholder/300/300',
    category: 'Electronics',
    condition: 'Excellent',
    lookingFor: 'MacBook Pro, DJI Drone, or Professional Audio Equipment',
    location: 'Miami, FL',
    postedDate: '3 days ago',
    userRating: 4.7,
    userReviews: 156,
    isVerified: true,
    priority: 'medium',
    tags: ['Camera', 'Professional', 'Canon']
  },
  {
    id: '5',
    title: 'Vintage Rolex Submariner 16610',
    description: 'Classic Rolex Submariner from 2000. Excellent condition with original papers.',
    image: '/api/placeholder/300/300',
    category: 'Luxury',
    condition: 'Excellent',
    lookingFor: 'Patek Philippe, Audemars Piguet, or Luxury Car',
    location: 'Beverly Hills, CA',
    postedDate: '1 week ago',
    userRating: 5.0,
    userReviews: 45,
    isVerified: true,
    priority: 'high',
    tags: ['Luxury', 'Watch', 'Vintage']
  },
  {
    id: '6',
    title: 'Gibson Les Paul Standard Electric Guitar',
    description: 'Beautiful Gibson Les Paul in Heritage Cherry Sunburst. Includes hard case.',
    image: '/api/placeholder/300/300',
    category: 'Music',
    condition: 'Very Good',
    lookingFor: 'Fender Stratocaster, Marshall Amp, or Studio Equipment',
    location: 'Nashville, TN',
    postedDate: '2 weeks ago',
    userRating: 4.5,
    userReviews: 78,
    isVerified: false,
    priority: 'low',
    tags: ['Guitar', 'Gibson', 'Electric']
  },
  {
    id: '7',
    title: 'MacBook Pro M2 13" - 512GB',
    description: '2023 MacBook Pro with M2 chip, 8GB RAM, 512GB SSD. Perfect for work and creative projects.',
    image: '/api/placeholder/300/300',
    category: 'Electronics',
    condition: 'Like New',
    lookingFor: 'iPad Pro, iPhone 15 Pro, or Apple Watch Ultra',
    location: 'San Francisco, CA',
    postedDate: '4 hours ago',
    userRating: 4.9,
    userReviews: 234,
    isVerified: true,
    priority: 'high',
    tags: ['Laptop', 'Apple', 'Professional']
  },
  {
    id: '8',
    title: 'Supreme Box Logo Hoodie FW18',
    description: 'Rare Supreme Box Logo Hoodie from Fall/Winter 2018. Size Large, deadstock condition.',
    image: '/api/placeholder/300/300',
    category: 'Fashion',
    condition: 'New',
    lookingFor: 'Off-White, Bape, or Supreme accessories',
    location: 'Brooklyn, NY',
    postedDate: '6 hours ago',
    userRating: 4.7,
    userReviews: 156,
    isVerified: true,
    priority: 'high',
    tags: ['Streetwear', 'Supreme', 'Limited']
  }
];

export default function ExchangePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState('priority');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = ['All', 'Electronics', 'Fashion', 'Luxury', 'Music', 'Sports', 'Home & Garden'];
  const priorities = ['All', 'high', 'medium', 'low'];
  const conditions = ['All', 'New', 'Like New', 'Excellent', 'Very Good', 'Good'];
  const allTags = Array.from(new Set(exchangeItems.flatMap(item => item.tags)));

  const filteredItems = exchangeItems.filter(item => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const priorityMatch = selectedPriority === 'All' || item.priority === selectedPriority;
    const conditionMatch = selectedCondition === 'All' || item.condition === selectedCondition;
    const searchMatch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lookingFor.toLowerCase().includes(searchQuery.toLowerCase());
    const tagMatch = selectedTags.length === 0 || 
      selectedTags.some(tag => item.tags.includes(tag));
    
    return categoryMatch && priorityMatch && conditionMatch && searchMatch && tagMatch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'rating') {
      return b.userRating - a.userRating;
    }
    if (sortBy === 'recent') {
      return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exchange Items</h1>
              <p className="text-gray-600 mt-1">Trade your items directly with other users</p>
            </div>
            <Link
              href="/add-item?type=exchange"
              className="btn bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              List Item for Exchange
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority === 'All' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              {/* Tags Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="space-y-2">
                  {allTags.map(tag => (
                    <label key={tag} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedPriority('All');
                  setSelectedCondition('All');
                  setSearchQuery('');
                  setSelectedTags([]);
                }}
                className="w-full btn border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort and Results */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {sortedItems.length} items found
                  </span>
                  {selectedTags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Tags:</span>
                      {selectedTags.map(tag => (
                        <span key={tag} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="priority">Priority</option>
                    <option value="rating">Rating</option>
                    <option value="recent">Most Recent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    <div className="absolute top-3 right-3">
                      {item.isVerified && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
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

                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Looking for:</p>
                      <p className="text-sm text-purple-600 font-medium line-clamp-1">
                        {item.lookingFor}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
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
                      <Link
                        href={`/exchange/${item.id}`}
                        className="btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        Make Offer
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {sortedItems.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedPriority('All');
                    setSelectedCondition('All');
                    setSearchQuery('');
                    setSelectedTags([]);
                  }}
                  className="btn bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 