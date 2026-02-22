'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';

interface ExchangeItem {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
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
  exchangeType: 'direct' | 'negotiable';
  preferredCategories: string[];
  itemValue: number;
  shipping: string;
  fastShipping: boolean;
}

const mockExchangeItems: ExchangeItem[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro - 128GB - Space Black',
    description: 'Excellent condition iPhone 14 Pro, barely used. Comes with original box and accessories.',
    image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=iPhone+14+Pro',
    images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=iPhone+14+Pro'],
    category: 'Electronics',
    condition: 'Like New',
    lookingFor: 'MacBook Air, iPad Pro, or Gaming Laptop',
    location: 'New York, NY',
    postedDate: '2 hours ago',
    userRating: 4.8,
    userReviews: 127,
    isVerified: true,
    priority: 'high',
    tags: ['Smartphone', 'Apple', 'Premium'],
    exchangeType: 'negotiable',
    preferredCategories: ['Electronics', 'Computers', 'Gaming'],
    itemValue: 899.99,
    shipping: 'Free',
    fastShipping: true
  },
  {
    id: '2',
    title: 'Nike Air Jordan 1 Retro High OG',
    description: 'Classic Air Jordan 1s in Chicago colorway. Size 10, worn only a few times.',
    image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Air+Jordan+1',
    images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Air+Jordan+1'],
    category: 'Fashion',
    condition: 'Very Good',
    lookingFor: 'Yeezy 350, Air Force 1, or Designer Sneakers',
    location: 'Los Angeles, CA',
    postedDate: '5 hours ago',
    userRating: 4.6,
    userReviews: 89,
    isVerified: true,
    priority: 'high',
    tags: ['Sneakers', 'Nike', 'Limited Edition'],
    exchangeType: 'direct',
    preferredCategories: ['Fashion', 'Sneakers', 'Designer'],
    itemValue: 350.00,
    shipping: 'Free',
    fastShipping: true
  },
  {
    id: '3',
    title: 'PlayStation 5 Console + 2 Controllers',
    description: 'PS5 with DualSense controllers. Includes God of War Ragnarök and Spider-Man 2.',
    image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=PS5+Console',
    images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=PS5+Console'],
    category: 'Electronics',
    condition: 'Good',
    lookingFor: 'Xbox Series X, Gaming PC, or High-end Camera',
    location: 'Chicago, IL',
    postedDate: '1 day ago',
    userRating: 4.9,
    userReviews: 203,
    isVerified: true,
    priority: 'medium',
    tags: ['Gaming', 'Sony', 'Console'],
    exchangeType: 'negotiable',
    preferredCategories: ['Electronics', 'Gaming', 'Computers'],
    itemValue: 599.99,
    shipping: '$15.99',
    fastShipping: true
  },
  {
    id: '4',
    title: 'Canon EOS R6 Mark II Camera',
    description: 'Professional mirrorless camera with 24-105mm f/4L lens. Perfect for photography enthusiasts.',
    image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Canon+EOS+R6',
    images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Canon+EOS+R6'],
    category: 'Electronics',
    condition: 'Excellent',
    lookingFor: 'MacBook Pro, DJI Drone, or Professional Audio Equipment',
    location: 'Miami, FL',
    postedDate: '3 days ago',
    userRating: 4.7,
    userReviews: 156,
    isVerified: true,
    priority: 'medium',
    tags: ['Camera', 'Professional', 'Canon'],
    exchangeType: 'negotiable',
    preferredCategories: ['Electronics', 'Computers', 'Audio'],
    itemValue: 2499.99,
    shipping: 'Free',
    fastShipping: true
  },
  {
    id: '5',
    title: 'Apple MacBook Pro M2 - 14-inch',
    description: '2023 MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Perfect condition with AppleCare+.',
    image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=MacBook+Pro+M2',
    images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=MacBook+Pro+M2'],
    category: 'Electronics',
    condition: 'Like New',
    lookingFor: 'iPhone 15 Pro Max, iPad Pro 12.9", or Gaming PC Setup',
    location: 'San Francisco, CA',
    postedDate: '1 day ago',
    userRating: 4.9,
    userReviews: 89,
    isVerified: true,
    priority: 'high',
    tags: ['Laptop', 'Apple', 'M2 Chip', 'Premium'],
    exchangeType: 'direct',
    preferredCategories: ['Electronics', 'Mobile', 'Gaming'],
    itemValue: 1999.99,
    shipping: 'Free',
    fastShipping: true
  }
];

const priorityColors: Record<string, string> = {
  high: '#e7ffe7',
  medium: '#fff7e6',
  low: '#f3eaff',
};

const priorityTextColors: Record<string, string> = {
  high: '#2d7a2d',
  medium: '#d46b08',
  low: '#924DAC',
};

const conditionColors: Record<string, string> = {
  'Like New': '#e7f3ff',
  'Excellent': '#eafff3',
  'Very Good': '#f3eaff',
  'Good': '#fff3ea',
  'Fair': '#fff0f0',
};

export default function ExchangePage() {
  const router = useRouter();
  const [exchangeItems, setExchangeItems] = useState<ExchangeItem[]>(mockExchangeItems);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExchangeItem | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchExchangeItems = async () => {
      try {
        setLoading(true);
        const response = await apiService.getExchangeItems();
        const items = Array.isArray(response) ? response : (response?.items || []);
        if (items.length > 0) {
          setExchangeItems(items);
        }
      } catch (error) {
        console.error('Failed to fetch exchange items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeItems();
  }, []);

  const categories = ['all', ...Array.from(new Set(exchangeItems.map(i => i.category)))];

  const filteredItems = filter === 'all'
    ? exchangeItems
    : exchangeItems.filter(i => i.category === filter);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#924DAC', fontSize: 18 }}>Loading exchange items...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #924DAC 0%, #d97ef6 100%)',
        padding: '40px 32px',
        color: '#fff',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>🔄 Exchange Items</h1>
        <p style={{ fontSize: 16, opacity: 0.9 }}>Trade your items with other users across India</p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                border: 'none',
                background: filter === cat ? '#924DAC' : '#fff',
                color: filter === cat ? '#fff' : '#666',
                fontWeight: filter === cat ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(146,77,172,0.08)',
                transition: 'all 0.2s',
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 12px rgba(146,77,172,0.08)',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                border: selectedItem?.id === item.id ? '2px solid #924DAC' : '2px solid transparent',
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(146,77,172,0.15)';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(146,77,172,0.08)';
              }}
              onClick={() => setSelectedItem(item)}
            >
              {/* Image */}
              <div style={{ position: 'relative', width: '100%', height: 200, background: '#f3eaff' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/300x200/924DAC/FFFFFF?text=No+Image';
                  }}
                />
                {/* Priority Badge */}
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: priorityColors[item.priority],
                  color: priorityTextColors[item.priority],
                  fontSize: 11, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 20,
                }}>
                  {item.priority.toUpperCase()} PRIORITY
                </div>
                {/* Verified Badge */}
                {item.isVerified && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: '#924DAC', color: '#fff',
                    fontSize: 11, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 20,
                  }}>
                    ✓ Verified
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#222', marginBottom: 6, lineHeight: 1.4 }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: 13, color: '#888', marginBottom: 12, lineHeight: 1.5 }}>
                  {item.description.length > 80 ? item.description.slice(0, 80) + '...' : item.description}
                </p>

                {/* Condition + Category */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{
                    background: conditionColors[item.condition] || '#f3eaff',
                    color: '#924DAC', fontSize: 11, fontWeight: 600,
                    padding: '3px 10px', borderRadius: 20,
                  }}>
                    {item.condition}
                  </span>
                  <span style={{
                    background: '#f0f0f0', color: '#555',
                    fontSize: 11, fontWeight: 600,
                    padding: '3px 10px', borderRadius: 20,
                  }}>
                    {item.category}
                  </span>
                  <span style={{
                    background: item.exchangeType === 'direct' ? '#e7f3ff' : '#fff3ea',
                    color: item.exchangeType === 'direct' ? '#1a6bb5' : '#d46b08',
                    fontSize: 11, fontWeight: 600,
                    padding: '3px 10px', borderRadius: 20,
                  }}>
                    {item.exchangeType}
                  </span>
                </div>

                {/* Looking For */}
                <div style={{
                  background: '#f9f5ff', borderRadius: 8, padding: '10px 12px', marginBottom: 12,
                }}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>Looking for</div>
                  <div style={{ fontSize: 13, color: '#924DAC', fontWeight: 600 }}>
                    {item.lookingFor.length > 60 ? item.lookingFor.slice(0, 60) + '...' : item.lookingFor}
                  </div>
                </div>

                {/* Value + Location */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>Item Value</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#924DAC' }}>
                      ₹{item.itemValue.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#aaa' }}>📍 Location</div>
                    <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>{item.location}</div>
                  </div>
                </div>

                {/* Rating + Posted */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#aaa', marginBottom: 16 }}>
                  <span>⭐ {item.userRating} ({item.userReviews} reviews)</span>
                  <span>{item.postedDate}</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    router.push(`/exchange/${item.id}`);
                  }}
                  style={{
                    width: '100%',
                    background: '#924DAC',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = '#7a3a8a')}
                  onMouseOut={e => (e.currentTarget.style.background = '#924DAC')}
                >
                  🔄 Propose Exchange
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontSize: 16 }}>
            No exchange items found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
