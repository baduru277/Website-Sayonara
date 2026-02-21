'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import apiService from '@/services/api';

interface ExchangeItem {
  id: string;
  title: string;
  description: string;
  images?: string[];
  category: string;
  condition: string;
  lookingFor: string;
  location: string;
  createdAt: string;
  seller?: {
    name: string;
    rating?: number;
    totalReviews?: number;
    isVerified?: boolean;
  };
}

export default function ExchangeSection() {
  const [exchangeItems, setExchangeItems] = useState<ExchangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExchangeItems();
  }, []);

  const fetchExchangeItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getExchangeItems({ limit: 3 });
      
      const transformedItems = (response.items || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        images: item.images || [],
        category: item.category,
        condition: item.condition,
        lookingFor: item.lookingFor,
        location: item.location || 'Unknown',
        createdAt: item.createdAt,
        seller: item.seller
      }));
      
      setExchangeItems(transformedItems);
    } catch (err: any) {
      console.error('Failed to fetch exchange items:', err);
      setError(err.message || 'Failed to load exchange items');
    } finally {
      setLoading(false);
    }
  };

  const getItemImage = (item: ExchangeItem) => {
    if (item.images && item.images.length > 0) {
      return item.images[0].startsWith('http') 
        ? item.images[0] 
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${item.images[0]}`;
    }
    return '/placeholder-item.jpg';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <section className="py-12" style={{ background: '#f9f9f9' }}>
        <div className="container">
          <div className="text-center py-12">
            <div style={{
              width: 48,
              height: 48,
              border: '4px solid #f3eaff',
              borderTop: '4px solid #924DAC',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ color: '#924DAC', fontSize: 16 }}>Loading exchange items...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12" style={{ background: '#f9f9f9' }}>
        <div className="container">
          <div className="text-center py-12">
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#d32f2f', marginBottom: 8 }}>
              Error Loading Items
            </h3>
            <p style={{ color: '#666', marginBottom: 16 }}>{error}</p>
            <button onClick={fetchExchangeItems} className="sayonara-btn">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (exchangeItems.length === 0) {
    return (
      <section className="py-12" style={{ background: '#f9f9f9' }}>
        <div className="container">
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#924DAC', marginBottom: 16, textAlign: 'center' }}>
            Exchange Items
          </h2>
          <div className="text-center py-12">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔄</div>
            <p style={{ color: '#666', fontSize: 16 }}>No exchange items available</p>
            <p style={{ color: '#999', fontSize: 14, marginTop: 8 }}>Be the first to list an item for exchange!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12" style={{ background: '#f9f9f9' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#924DAC', marginBottom: 8 }}>
              Exchange Items
            </h2>
            <p style={{ color: '#666', fontSize: 16 }}>
              Trade your items directly with other users. No money involved, just fair exchanges.
            </p>
          </div>
          <Link href="/exchange" className="sayonara-btn">
            View All Exchanges
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {exchangeItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 12px rgba(146,77,172,0.08)',
                overflow: 'hidden',
                border: '1px solid #f3eaff',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(146,77,172,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(146,77,172,0.08)';
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 200 }}>
                <Image
                  src={getItemImage(item)}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                {item.seller?.isVerified && (
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 24,
                    height: 24,
                    background: '#2196f3',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#fff', fontSize: 14 }}>✓</span>
                  </div>
                )}
              </div>

              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#222', marginBottom: 8, height: 48, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: 14, color: '#666', marginBottom: 12, height: 40, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', gap: 8, marginBottom: 16, fontSize: 12, color: '#999' }}>
                  <span>{item.condition}</span>
                  <span>•</span>
                  <span>{item.category}</span>
                </div>

                <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Looking for:</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#924DAC', height: 40, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {item.lookingFor}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, fontSize: 12, color: '#999' }}>
                  <span>{item.location}</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                <Link href={`/items/${item.id}`} className="sayonara-btn" style={{ width: '100%', textAlign: 'center', display: 'block', padding: '10px 20px' }}>
                  Make Offer
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/exchange" className="sayonara-btn" style={{ padding: '12px 32px', fontSize: 16 }}>
            View All {exchangeItems.length > 3 ? `(${exchangeItems.length}+)` : ''} Exchange Items
          </Link>
        </div>
      </div>
    </section>
  );
}
