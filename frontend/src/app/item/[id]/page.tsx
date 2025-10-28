'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Seller {
  id: string;
  name: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  isPrime: boolean;
  location?: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  type: 'exchange' | 'bidding' | 'resell';
  images: string[];
  tags: string[];
  location: string;
  views: number;
  createdAt: string;
  seller?: Seller;
  lookingFor?: string;
  startingBid?: number;
  currentBid?: number;
  buyNowPrice?: number;
  auctionEndDate?: string;
  totalBids?: number;
  price?: number;
  originalPrice?: number;
  discount?: number;
  stock?: number;
  shipping?: string;
  isPrime?: boolean;
  fastShipping?: boolean;
  warrantyStatus?: string;
  damageInfo?: string;
  usageHistory?: string;
  originalBox?: string;
}

export default function ItemDetailClient({ item }: { item: Item }) {
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const router = useRouter();

  const handleChatClick = () => {
    if (item.seller?.id) {
      router.push(`/messages?sellerId=${item.seller.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getItemPrice = () => {
    if (item.type === 'bidding') return `Starting: ₹${item.startingBid?.toLocaleString()}`;
    if (item.type === 'exchange') return 'Exchange Item';
    return `₹${item.price?.toLocaleString()}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'none',
              border: 'none',
              color: '#924DAC',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline',
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          
          {/* Left: Images */}
          <div>
            {/* Main Image */}
            <div
              style={{
                background: '#f9f9f9',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                aspectRatio: '1',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image
                src={item.images[mainImageIdx] || 'https://via.placeholder.com/500x500'}
                alt={item.title}
                fill
                style={{ objectFit: 'contain', padding: '16px' }}
              />
            </div>

            {/* Thumbnails */}
            {item.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImageIdx(idx)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '6px',
                      border: mainImageIdx === idx ? '2px solid #924DAC' : '1px solid #ddd',
                      cursor: 'pointer',
                      padding: '4px',
                      background: '#fff',
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <Image src={img} alt={`View ${idx}`} fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center & Right: Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Product Info */}
            <div style={{ background: '#fff', borderRadius: '8px', padding: '24px' }}>
              {/* Title */}
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#222', marginBottom: '16px' }}>
                {item.title}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                <span style={{ color: '#FFC107' }}>{'★'.repeat(Math.round(item.seller?.rating || 0)).padEnd(5, '☆')}</span>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  {item.seller?.rating} ({item.seller?.totalReviews} reviews)
                </span>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#222' }}>Description</h3>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>{item.description}</p>
              </div>

              {/* Key Details */}
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '16px', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#222' }}>Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#666' }}>Condition:</span>
                    <div style={{ fontWeight: '600', color: '#222' }}>{item.condition}</div>
                  </div>
                  <div>
                    <span style={{ color: '#666' }}>Category:</span>
                    <div style={{ fontWeight: '600', color: '#222' }}>{item.category}</div>
                  </div>
                  <div>
                    <span style={{ color: '#666' }}>Location:</span>
                    <div style={{ fontWeight: '600', color: '#222' }}>📍 {item.location}</div>
                  </div>
                  <div>
                    <span style={{ color: '#666' }}>Posted:</span>
                    <div style={{ fontWeight: '600', color: '#222' }}>{formatDate(item.createdAt)}</div>
                  </div>
                  <div>
                    <span style={{ color: '#666' }}>Views:</span>
                    <div style={{ fontWeight: '600', color: '#222' }}>{item.views}</div>
                  </div>
                  {item.stock !== undefined && (
                    <div>
                      <span style={{ color: '#666' }}>Stock:</span>
                      <div style={{ fontWeight: '600', color: item.stock > 0 ? '#28a745' : '#dc3545' }}>
                        {item.stock > 0 ? `${item.stock} available` : 'Out of Stock'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              {(item.warrantyStatus || item.damageInfo || item.usageHistory || item.originalBox) && (
                <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '16px', marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#222' }}>Additional Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                    {item.warrantyStatus && (
                      <div>
                        <span style={{ color: '#666' }}>Warranty:</span>
                        <div style={{ fontWeight: '600', color: '#222' }}>{item.warrantyStatus}</div>
                      </div>
                    )}
                    {item.usageHistory && (
                      <div>
                        <span style={{ color: '#666' }}>Usage:</span>
                        <div style={{ fontWeight: '600', color: '#222' }}>{item.usageHistory}</div>
                      </div>
                    )}
                    {item.originalBox && (
                      <div>
                        <span style={{ color: '#666' }}>Box/Accessories:</span>
                        <div style={{ fontWeight: '600', color: '#222' }}>{item.originalBox}</div>
                      </div>
                    )}
                    {item.damageInfo && (
                      <div>
                        <span style={{ color: '#666' }}>Damage Info:</span>
                        <div style={{ fontWeight: '600', color: '#222' }}>{item.damageInfo}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: '#e8e8e8',
                        color: '#666',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Action Card */}
            <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', position: 'sticky', top: '80px' }}>
              {/* Price */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Price</div>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#222' }}>
                  {getItemPrice()}
                </div>
                {item.discount && (
                  <div style={{ color: '#28a745', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>
                    {item.discount}% off
                  </div>
                )}
              </div>

              {/* Seller Info */}
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Sold by</div>
                <div style={{ fontWeight: '600', color: '#222', marginBottom: '4px' }}>
                  {item.seller?.name || 'Unknown Seller'}
                </div>
                {item.seller?.isVerified && (
                  <div style={{ color: '#28a745', fontSize: '12px', fontWeight: '600' }}>
                    ✓ Verified Seller
                  </div>
                )}
              </div>

              {/* Verification */}
              <div style={{ background: '#f0f8ff', borderRadius: '6px', padding: '12px', marginBottom: '16px', fontSize: '12px' }}>
                <div style={{ fontWeight: '600', color: '#0066cc', marginBottom: '4px' }}>🔍 Verify Before Purchase</div>
                <div style={{ color: '#666' }}>
                  Always chat with the seller to confirm product details and condition.
                </div>
              </div>

              {/* Chat Button */}
              <button
                onClick={handleChatClick}
                style={{
                  width: '100%',
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#218838')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#28a745')}
              >
                💬 Chat with Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
