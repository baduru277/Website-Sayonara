'use client';

import { useState } from 'react';
import Image from 'next/image';

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
  // Exchange fields
  lookingFor?: string;
  // Bidding fields
  startingBid?: number;
  currentBid?: number;
  buyNowPrice?: number;
  auctionEndDate?: string;
  totalBids?: number;
  // Resell fields
  price?: number;
  originalPrice?: number;
  discount?: number;
  stock?: number;
  shipping?: string;
  isPrime?: boolean;
  fastShipping?: boolean;
  // Additional fields
  warrantyStatus?: string;
  damageInfo?: string;
  usageHistory?: string;
  originalBox?: string;
}

interface Props {
  item: Item;
}

export default function ItemDetailClient({ item }: Props) {
  const [mainImg, setMainImg] = useState(0);
  const [tab, setTab] = useState('description');

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTimeLeft = (endDate?: string) => {
    if (!endDate) return 'N/A';
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Auction ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const platformNote =
    'Note: This platform allows you to bid, exchange, or resell used products. Connect with other users to find great deals, swap items, or get the best price for your pre-owned goods.';

  return (
    <div style={{ background: '#fafafd', minHeight: 'calc(100vh - 120px)', padding: '32px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Image Gallery */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 18, marginBottom: 18, position: 'relative', height: 400 }}>
            {item.images && item.images.length > 0 ? (
              <Image
                src={item.images[mainImg] || '/placeholder.svg'}
                alt="Product image"
                fill
                style={{ borderRadius: 8, objectFit: 'contain' }}
                priority
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                No image available
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {item.images && item.images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {item.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImg(idx)}
                  style={{
                    position: 'relative',
                    width: 56,
                    height: 56,
                    borderRadius: 6,
                    border: mainImg === idx ? '2px solid #924DAC' : '1.5px solid #ccc',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ flex: 2, minWidth: 320 }}>
          <div style={{ background: '#f7f7fa', borderLeft: '4px solid #924DAC', borderRadius: 8, padding: '10px 18px', color: '#555', marginBottom: 18, fontSize: 15 }}>
            {platformNote}
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#333' }}>
            {item.title}
          </h1>

          <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
            SKU: <b>{item.id.slice(0, 8).toUpperCase()}</b> | Category: <b>{item.category}</b>
          </div>
          <div style={{ color: '#388e3c', fontWeight: 600, marginBottom: 4 }}>
            Availability: In Stock
          </div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 16 }}>
            Location: <b>{item.location}</b>
          </div>

          {/* Pricing */}
          <div style={{ margin: '16px 0 24px' }}>
            {item.type === 'resell' && item.price && (
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#924DAC' }}>
                  {formatPrice(item.price)}
                </div>
                {item.originalPrice && item.originalPrice > item.price && (
                  <div>
                    <span style={{ color: '#888', fontSize: 16, textDecoration: 'line-through', marginRight: 8 }}>
                      {formatPrice(item.originalPrice)}
                    </span>
                    {item.discount && (
                      <span style={{ color: '#2ecc40', fontWeight: 600, fontSize: 14 }}>
                        {item.discount}% OFF
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {item.type === 'bidding' && item.startingBid && (
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#924DAC', marginBottom: 8 }}>
                  Starting Bid: {formatPrice(item.startingBid)}
                </div>
                {item.currentBid && (
                  <div style={{ fontSize: 16, color: '#666', marginBottom: 4 }}>
                    Current Bid: {formatPrice(item.currentBid)}
                  </div>
                )}
                {item.auctionEndDate && (
                  <div style={{ fontSize: 14, color: '#e74c3c', fontWeight: 600, marginBottom: 4 }}>
                    Time Left: {getTimeLeft(item.auctionEndDate)}
                  </div>
                )}
                {item.totalBids && (
                  <div style={{ fontSize: 14, color: '#666' }}>
                    {item.totalBids} bids placed
                  </div>
                )}
              </div>
            )}

            {item.type === 'exchange' && item.lookingFor && (
              <div style={{ fontSize: 16, fontWeight: 600, color: '#924DAC' }}>
                Looking for: {item.lookingFor}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 16, marginBottom: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: '#333' }}>Item Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: 14 }}>
              <div>
                <span style={{ color: '#666' }}>Condition:</span>
                <span style={{ fontWeight: 600, marginLeft: 8 }}>{item.condition}</span>
              </div>
              {item.warrantyStatus && (
                <div>
                  <span style={{ color: '#666' }}>Warranty:</span>
                  <span style={{ fontWeight: 600, marginLeft: 8 }}>{item.warrantyStatus}</span>
                </div>
              )}
              {item.usageHistory && (
                <div>
                  <span style={{ color: '#666' }}>Usage:</span>
                  <span style={{ fontWeight: 600, marginLeft: 8 }}>{item.usageHistory}</span>
                </div>
              )}
              {item.originalBox && (
                <div>
                  <span style={{ color: '#666' }}>Box/Accessories:</span>
                  <span style={{ fontWeight: 600, marginLeft: 8 }}>{item.originalBox}</span>
                </div>
              )}
              {item.shipping && (
                <div>
                  <span style={{ color: '#666' }}>Shipping:</span>
                  <span style={{ fontWeight: 600, marginLeft: 8 }}>{item.shipping}</span>
                </div>
              )}
            </div>
          </div>

          {item.damageInfo && (
            <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 8, padding: 12, marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 4, color: '#856404' }}>Damage Information:</div>
              <div style={{ fontSize: 14, color: '#856404' }}>{item.damageInfo}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <button
              style={{
                minWidth: 140,
                padding: '10px 16px',
                background: '#924DAC',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Chat with Seller
            </button>

            {item.type === 'bidding' && (
              <button
                style={{
                  minWidth: 140,
                  padding: '10px 16px',
                  background: '#f39c12',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Bid Now
              </button>
            )}

            {item.type === 'exchange' && (
              <button
                style={{
                  minWidth: 140,
                  padding: '10px 16px',
                  background: '#3498db',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Barter
              </button>
            )}

            {item.type === 'resell' && item.price && (
              <button
                style={{
                  minWidth: 140,
                  padding: '10px 16px',
                  background: '#2ecc40',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Buy Now
              </button>
            )}
          </div>

          {/* Seller Information */}
          {item.seller && (
            <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 16, marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 12, color: '#333' }}>Seller Information</div>
              <div style={{ fontSize: 14, color: '#666' }}>
                <div style={{ marginBottom: 4 }}>
                  Name: <b>{item.seller.name}</b>
                </div>
                <div style={{ marginBottom: 4 }}>
                  Rating: <b>{item.seller.rating.toFixed(1)}/5 ({item.seller.totalReviews} reviews)</b>
                </div>
                {item.seller.location && (
                  <div style={{ marginBottom: 4 }}>
                    Location: <b>{item.seller.location}</b>
                  </div>
                )}
                {item.seller.isVerified && (
                  <div style={{ color: '#388e3c', fontWeight: 600 }}>
                    Verified Seller
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div style={{ maxWidth: 1200, margin: '32px auto 0' }}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24 }}>
          <div style={{ display: 'flex', gap: 32, borderBottom: '2px solid #eee', marginBottom: 18 }}>
            {['description', 'specification', 'reviews'].map(t => (
              <span
                key={t}
                onClick={() => setTab(t)}
                style={{
                  fontWeight: 600,
                  color: tab === t ? '#924DAC' : '#888',
                  borderBottom: tab === t ? '3px solid #924DAC' : 'none',
                  paddingBottom: 8,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div style={{ color: '#444', fontSize: 15, minHeight: 80, lineHeight: 1.6 }}>
            {tab === 'description' && (
              <div>
                <p>{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <strong>Tags:</strong>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            background: '#f0f0f0',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            color: '#666',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'specification' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                <div>
                  <strong>Category:</strong> {item.category}
                </div>
                <div>
                  <strong>Condition:</strong> {item.condition}
                </div>
                <div>
                  <strong>Type:</strong> {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </div>
                <div>
                  <strong>Location:</strong> {item.location}
                </div>
                {item.warrantyStatus && (
                  <div>
                    <strong>Warranty:</strong> {item.warrantyStatus}
                  </div>
                )}
                {item.usageHistory && (
                  <div>
                    <strong>Usage:</strong> {item.usageHistory}
                  </div>
                )}
                {item.originalBox && (
                  <div>
                    <strong>Box/Accessories:</strong> {item.originalBox}
                  </div>
                )}
                {item.shipping && (
                  <div>
                    <strong>Shipping:</strong> {item.shipping}
                  </div>
                )}
              </div>
            )}

            {tab === 'reviews' && (
              <div style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
                <div style={{ fontSize: 16, marginBottom: 8 }}>No reviews yet</div>
                <div>Be the first to review this item!</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
