'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';

interface ResellItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  image: string;
  category: string;
  condition: string;
  location: string;
  views: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  tags: string[];
  createdAt: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    totalReviews: number;
    isVerified: boolean;
  };
}

export default function ResellPage() {
  const [items, setItems] = useState<ResellItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await apiService.getItems({ type: 'resell', limit: 50 });
        const apiItems = response.items || [];

        const transformed = apiItems.map((item: any) => {
          const rawImage = item.images?.[0] || '';
          const image = rawImage
            ? (rawImage.startsWith('http') ? rawImage : `${BASE_URL}${rawImage}`)
            : '';
          const allImages = (item.images || []).map((img: string) =>
            img.startsWith('http') ? img : `${BASE_URL}${img}`
          );
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            image,
            images: allImages,
            category: item.category,
            condition: item.condition,
            location: item.location || 'India',
            views: item.views || 0,
            price: parseFloat(item.price || '0'),
            originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined,
            discount: item.discount || undefined,
            tags: item.tags || [],
            createdAt: item.createdAt,
            seller: {
              id: item.seller?.id || '',
              name: item.seller?.name || 'Unknown',
              rating: item.seller?.rating || 4.5,
              totalReviews: item.seller?.totalReviews || 0,
              isVerified: item.seller?.isVerified || false,
            },
          };
        });

        setItems(transformed);
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category)))];
  const filteredItems = filter === 'all' ? items : items.filter(i => i.category === filter);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #f0e6fa', borderTop: '4px solid #924DAC', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: '#924DAC', fontWeight: 600 }}>Loading items...</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7fa' }}>
      <style>{`
        .rs-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .rs-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(146,77,172,0.18) !important; }
        .rs-card:hover .rs-img { transform: scale(1.05); }
        .rs-btn { transition: background 0.2s; }
        .rs-btn:hover { background: #7a3a8a !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #924DAC 0%, #a855c8 60%, #7a3a8a 100%)',
        padding: '32px 24px', color: '#fff'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>🛒 Resell Items</h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: 15 }}>
            {items.length} item{items.length !== 1 ? 's' : ''} available for purchase
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
                padding: '8px 18px', borderRadius: 20,
                border: `2px solid ${filter === cat ? '#924DAC' : '#e0d0f0'}`,
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rs-card"
              style={{
                background: '#fff', borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(146,77,172,0.08)',
                border: '1.5px solid #f0e6fa',
              }}
              onClick={() => router.push(`/resell/${item.id}`)}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#f5f0fa' }}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rs-img"
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

                {/* Discount Badge */}
                {item.discount && (
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: '#e74c3c', color: '#fff',
                    fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                  }}>
                    {item.discount}% OFF
                  </div>
                )}

                {/* Condition Badge */}
                <div style={{
                  position: 'absolute', bottom: 10, left: 10,
                  background: 'rgba(146,77,172,0.85)', color: '#fff',
                  fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 10,
                }}>
                  {item.condition}
                </div>

                {item.seller.isVerified && (
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
                  margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.35,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {item.title}
                </h3>

                {/* Price */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#924DAC' }}>
                    {formatPrice(item.price)}
                  </div>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div style={{ fontSize: 13, color: '#aaa', textDecoration: 'line-through' }}>
                      {formatPrice(item.originalPrice)}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888',
                  paddingTop: 10, borderTop: '1px solid #f0e6fa', marginBottom: 14
                }}>
                  <span>⭐ {item.seller.rating}</span>
                  <span>📍 {item.location}</span>
                </div>

                <button
                  className="rs-btn"
                  onClick={(e) => { e.stopPropagation(); router.push(`/resell/${item.id}`); }}
                  style={{
                    width: '100%', background: '#924DAC', color: '#fff',
                    border: 'none', borderRadius: 8, padding: '11px 0',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  🛒 View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No items found</div>
          </div>
        )}
      </div>
    </div>
  );
}
