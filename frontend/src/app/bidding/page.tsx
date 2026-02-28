'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, TrendingUp, Award, Flame, CheckCircle } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';

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

        const transformedItems = apiItems.map((item: any) => {
          const rawImage = item.images?.[0] || '';
          const image = rawImage
            ? (rawImage.startsWith('http') ? rawImage : `${BASE_URL}${rawImage}`)
            : '';
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            image,
            images: item.images || [],
            category: item.category,
            condition: item.condition,
            currentBid: parseFloat(item.currentBid || item.startingBid || '0'),
            startingBid: parseFloat(item.startingBid || '0'),
            buyNowPrice: parseFloat(item.buyNowPrice || '0'),
            timeLeft: calculateTimeLeft(item.auctionEndDate),
            totalBids: item.totalBids || 0,
            location: item.location || 'India',
            userRating: item.seller?.rating || 4.5,
            userReviews: item.seller?.totalReviews || 0,
            isVerified: item.seller?.isVerified || false,
            priority: calculatePriority(item.auctionEndDate, item.totalBids || 0),
          };
        });

        setItems(transformedItems);
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
    if (!auctionEndDate) return '7d 0h';
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

  const calculatePriority = (auctionEndDate: string, totalBids: number): 'high' | 'medium' | 'low' => {
    if (!auctionEndDate) return 'low';
    const end = new Date(auctionEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 3 || totalBids > 20) return 'high';
    if (hours < 12 || totalBids > 10) return 'medium';
    return 'low';
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

  const filteredItems = filter === 'all' ? items : items.filter(i => i.priority === filter);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #f0e6fa', borderTop: '4px solid #924DAC', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: '#924DAC', fontWeight: 600, fontSize: 16 }}>Loading auctions...</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔨</div>
          <div style={{ color: '#924DAC', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>No Live Auctions</div>
          <div style={{ color: '#888', fontSize: 15 }}>{error || 'Check back soon for new items!'}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7fa' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bid-card {
          animation: fadeInUp 0.4s ease both;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .bid-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(146,77,172,0.18) !important;
        }
        .bid-card:hover .card-img {
          transform: scale(1.05);
        }
        .bid-btn {
          transition: background 0.2s, transform 0.1s;
        }
        .bid-btn:hover {
          transform: scale(1.03);
        }
        .filter-btn {
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          font-weight: 600;
          border-radius: 20px;
          padding: 8px 20px;
          font-size: 14px;
        }
        .filter-btn:hover { opacity: 0.85; }
      `}</style>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #924DAC 0%, #b06fd4 60%, #7a3a8a 100%)',
        padding: '32px 24px 28px',
        color: '#fff'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <TrendingUp size={28} />
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Live Auctions</h1>
            <span style={{
              background: '#ff4444', color: '#fff', fontSize: 11, fontWeight: 700,
              padding: '3px 8px', borderRadius: 20, letterSpacing: 1,
              animation: 'pulse 1.5s ease infinite'
            }}>● LIVE</span>
          </div>
          <p style={{ margin: 0, opacity: 0.85, fontSize: 15 }}>
            {items.length} active auction{items.length !== 1 ? 's' : ''} — bid before time runs out
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: '🔨 All Auctions', count: items.length },
            { key: 'high', label: '🔥 Hot', count: items.filter(i => i.priority === 'high').length },
            { key: 'medium', label: '⚡ Active', count: items.filter(i => i.priority === 'medium').length },
            { key: 'low', label: '🕐 New', count: items.filter(i => i.priority === 'low').length },
          ].map(f => (
            <button
              key={f.key}
              className="filter-btn"
              onClick={() => setFilter(f.key as any)}
              style={{
                background: filter === f.key ? '#924DAC' : '#fff',
                color: filter === f.key ? '#fff' : '#924DAC',
                border: `2px solid ${filter === f.key ? '#924DAC' : '#e0d0f0'}`,
              }}
            >
              {f.label}
              <span style={{
                marginLeft: 6, background: filter === f.key ? 'rgba(255,255,255,0.25)' : '#f0e6fa',
                color: filter === f.key ? '#fff' : '#924DAC',
                borderRadius: 10, padding: '1px 7px', fontSize: 12
              }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="bid-card"
              style={{
                background: '#fff',
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(146,77,172,0.08)',
                border: '1.5px solid #f0e6fa',
                animationDelay: `${idx * 0.05}s`,
              }}
              onClick={() => router.push(`/bidding/${item.id}`)}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#f5f0fa' }}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                    }}
                  />
                ) : null}
                {/* Fallback — shown if no image or image fails */}
                <div style={{
                  display: item.image ? 'none' : 'flex',
                  width: '100%', height: '100%',
                  alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: 8, color: '#c9a8e0'
                }}>
                  <div style={{ fontSize: 40 }}>📦</div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>No Image</div>
                </div>

                {/* Priority Badge */}
                {item.priority === 'high' && (
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: 'linear-gradient(90deg, #ff6b35, #ff4444)',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                    padding: '4px 10px', borderRadius: 20,
                    display: 'flex', alignItems: 'center', gap: 4
                  }}>
                    <Flame size={12} /> HOT
                  </div>
                )}

                {/* Time Badge */}
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  background: item.timeLeft === 'Ended' ? '#888' : 'rgba(0,0,0,0.72)',
                  color: '#fff', fontSize: 11, fontWeight: 600,
                  padding: '4px 10px', borderRadius: 20,
                  display: 'flex', alignItems: 'center', gap: 4,
                  backdropFilter: 'blur(4px)'
                }}>
                  <Clock size={11} />
                  {item.timeLeft}
                </div>

                {/* Condition Badge */}
                <div style={{
                  position: 'absolute', bottom: 10, left: 10,
                  background: 'rgba(146,77,172,0.85)',
                  color: '#fff', fontSize: 10, fontWeight: 600,
                  padding: '3px 8px', borderRadius: 10,
                  backdropFilter: 'blur(4px)'
                }}>
                  {item.condition}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '14px 16px 16px' }}>
                {/* Category */}
                <div style={{ fontSize: 11, color: '#924DAC', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {item.category}
                </div>

                {/* Title */}
                <h3 style={{
                  margin: '0 0 10px', fontSize: 15, fontWeight: 700,
                  color: '#1a1a2e', lineHeight: 1.35,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {item.title}
                </h3>

                {/* Bid Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Current Bid</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#924DAC' }}>
                      {formatCurrency(item.currentBid)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Bids</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#333' }}>{item.totalBids}</div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 10, borderTop: '1px solid #f0e6fa',
                  fontSize: 12, color: '#888', marginBottom: 14
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#f5a623' }}>★</span>
                    <span>{item.userRating}</span>
                    {item.isVerified && <CheckCircle size={12} style={{ color: '#924DAC', marginLeft: 2 }} />}
                  </div>
                  <div>📍 {item.location}</div>
                </div>

                {/* Bid Button */}
                <button
                  className="bid-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/bidding/${item.id}`);
                  }}
                  style={{
                    width: '100%',
                    background: item.timeLeft === 'Ended'
                      ? '#ccc'
                      : 'linear-gradient(135deg, #924DAC 0%, #b06fd4 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '11px 0',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: item.timeLeft === 'Ended' ? 'not-allowed' : 'pointer',
                    letterSpacing: 0.3,
                  }}
                >
                  {item.timeLeft === 'Ended' ? 'Auction Ended' : '🔨 Place Bid'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No items in this category</div>
          </div>
        )}
      </div>
    </div>
  );
}
