'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import apiService from '@/services/api';

interface BiddingItem {
  id: string;
  title: string;
  description: string;
  images?: string[];
  category: string;
  condition: string;
  currentBid: number;
  startingBid: number;
  buyNowPrice?: number;
  totalBids: number;
  location: string;
  createdAt: string;
  auctionEndDate: string;
  seller?: {
    name: string;
    rating?: number;
    totalReviews?: number;
    isVerified?: boolean;
  };
}

export default function BiddingSection() {
  const [biddingItems, setBiddingItems] = useState<BiddingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBiddingItems();
  }, []);

  const fetchBiddingItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBiddingItems({ limit: 3 });
      
      const transformedItems = (response.items || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        images: item.images || [],
        category: item.category,
        condition: item.condition,
        currentBid: parseFloat(item.currentBid) || parseFloat(item.startingBid),
        startingBid: parseFloat(item.startingBid),
        buyNowPrice: item.buyNowPrice ? parseFloat(item.buyNowPrice) : undefined,
        totalBids: item.totalBids || 0,
        location: item.location || 'Unknown',
        createdAt: item.createdAt,
        auctionEndDate: item.auctionEndDate,
        seller: item.seller
      }));
      
      setBiddingItems(transformedItems);
    } catch (err: any) {
      console.error('Failed to fetch bidding items:', err);
      setError(err.message || 'Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (auctionEndDate: string) => {
    const end = new Date(auctionEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Ending Soon!';
  };

  const getTimeColor = (timeLeft: string) => {
    if (timeLeft === 'Ending Soon!' || timeLeft === 'Ended') return 'bg-red-100 text-red-600';
    if (timeLeft.includes('h') && !timeLeft.includes('d')) return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
  };

  const getItemImage = (item: BiddingItem) => {
    if (item.images && item.images.length > 0) {
      return item.images[0].startsWith('http') 
        ? item.images[0] 
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${item.images[0]}`;
    }
    return '/placeholder-item.jpg'; // Add a placeholder image to your public folder
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
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
            <p style={{ color: '#924DAC', fontSize: 16 }}>Loading live auctions...</p>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container">
          <div className="text-center py-12">
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#d32f2f', marginBottom: 8 }}>
              Error Loading Auctions
            </h3>
            <p style={{ color: '#666', marginBottom: 16 }}>{error}</p>
            <button onClick={fetchBiddingItems} className="sayonara-btn">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (biddingItems.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="container">
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#924DAC', marginBottom: 16, textAlign: 'center' }}>
            Live Auctions
          </h2>
          <div className="text-center py-12">
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <p style={{ color: '#666', fontSize: 16 }}>No live auctions at the moment</p>
            <p style={{ color: '#999', fontSize: 14, marginTop: 8 }}>Check back soon for new auctions!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#924DAC', marginBottom: 8 }}>
              Live Auctions
            </h2>
            <p style={{ color: '#666', fontSize: 16 }}>
              Bid on exclusive items and win amazing deals
            </p>
          </div>
          <Link href="/bidding" className="sayonara-btn">
            View All Auctions
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {biddingItems.map((item) => {
            const timeLeft = calculateTimeLeft(item.auctionEndDate);
            const timeColorClass = getTimeColor(timeLeft);

            return (
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
                  <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between' }}>
                    <span className={`${timeColorClass} px-3 py-1 rounded-full text-xs font-semibold`}>
                      ⏰ {timeLeft}
                    </span>
                    {item.seller?.isVerified && (
                      <div style={{
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: '#666' }}>Current Bid:</span>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#924DAC' }}>
                        ₹{item.currentBid.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: '#999' }}>Starting: ₹{item.startingBid.toLocaleString()}</span>
                      <span style={{ fontSize: 12, color: '#999' }}>{item.totalBids} bids</span>
                    </div>
                  </div>

                  <Link href={`/items/${item.id}`} className="sayonara-btn" style={{ width: '100%', textAlign: 'center', display: 'block', padding: '10px 20px' }}>
                    Place Bid
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/bidding" className="sayonara-btn" style={{ padding: '12px 32px', fontSize: 16 }}>
            View All {biddingItems.length > 3 ? `(${biddingItems.length}+)` : ''} Auctions
          </Link>
        </div>
      </div>
    </section>
  );
}
