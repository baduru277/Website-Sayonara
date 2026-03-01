'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';

interface ExchangeItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  condition: string;
  lookingFor: string;
  location: string;
  userRating: number;
  userReviews: number;
  isVerified: boolean;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

export default function ExchangePage() {
  const router = useRouter();
  const [items, setItems] = useState<ExchangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await apiService.getExchangeItems();
        const apiItems = Array.isArray(response) ? response : (response?.items || []);

        const transformed = apiItems.map((item: any) => {
          const rawImage = item.images?.[0] || '';
          const image = rawImage
            ? (rawImage.startsWith('http') ? rawImage : `${BASE_URL}${rawImage}`)
            : '';
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            image,
            category: item.category,
            condition: item.condition,
            lookingFor: item.lookingFor || 'Open to offers',
            location: item.location || 'India',
            userRating: item.seller?.rating || 4.5,
            userReviews: item.seller?.totalReviews || 0,
            isVerified: item.seller?.isVerified || false,
            priority: 'medium' as const,
            tags: item.tags || [],
          };
        });

        setItems(transformed);
      } catch (error) {
        console.error('Failed to fetch exchange items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category)))];
  const filteredItems = filter === 'all' ? items : items.filter(i => i.category === filter);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #f0e6fa', borderTop: '4px solid #924DAC', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: '#924DAC', fontWeight: 600 }}>Loading exchange items...</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7fa' }}>
      <style>{`
        .ex-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .ex-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(146,77,172,0.18) !important; }
        .ex-card:hover .ex-img { transform: scale(1.05); }
        .ex-btn { transition: background 0.2s; }
        .ex-btn:hover { background: #7a3a8a !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #924DAC 0%, #b06fd4 60%, #7a3a8a 100%)',
        padding: '32px 24px', color: '#fff'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>🔄 Exchange Items</h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: 15 }}>
            {items.length} item{items.length !== 1 ? 's' : ''} available for exchange
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '8px 18px', borderRadius: 20, border: `2px solid ${filter === cat ? '#924DAC' : '#e0d0f0'}`,
                background: filter === cat ? '#924DAC' : '#fff',
                color: filter === cat ? '#fff' : '#924DAC',
                fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="ex-card"
              style={{
                background: '#fff', borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(146,77,172,0.08)',
                border: '1.5px solid #f0e6fa',
              }}
              onClick={() => router.push(`/exchange/${item.id}`)}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#f5f0fa' }}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="ex-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div style={{
                  display: item.image ? 'none' : 'flex',
                  width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,
                  alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: 8, color: '#c9a8e0', background: '#f5f0fa'
                }}>
                  <div style={{ fontSize: 40 }}>📦</div>
                  <div style={{ fontSize: 12 }}>No Image</div>
                </div>

                {/* Condition Badge */}
                <div style={{
                  position: 'absolute', bottom: 10, left: 10,
                  background: 'rgba(146,77,172,0.85)', color: '#fff',
                  fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 10,
                }}>
                  {item.condition}
                </div>

                {/* Verified Badge */}
                {item.isVerified && (
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    background: '#2ecc71', color: '#fff',
                    fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                  }}>
                    ✓ Verified
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ fontSize: 11, color: '#924DAC', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {item.category}
                </div>
                <h3 style={{
                  margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.35,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {item.title}
                </h3>

                {/* Looking For */}
                <div style={{ background: '#f9f5ff', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>Looking for</div>
                  <div style={{ fontSize: 13, color: '#924DAC', fontWeight: 600 }}>
                    {item.lookingFor.length > 50 ? item.lookingFor.slice(0, 50) + '...' : item.lookingFor}
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888',
                  paddingTop: 10, borderTop: '1px solid #f0e6fa', marginBottom: 14
                }}>
                  <span>⭐ {item.userRating}</span>
                  <span>📍 {item.location}</span>
                </div>

                <button
                  className="ex-btn"
                  onClick={(e) => { e.stopPropagation(); router.push(`/exchange/${item.id}`); }}
                  style={{
                    width: '100%', background: '#924DAC', color: '#fff',
                    border: 'none', borderRadius: 8, padding: '11px 0',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  🔄 Propose Exchange
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No exchange items found</div>
          </div>
        )}
      </div>
    </div>
  );
}
