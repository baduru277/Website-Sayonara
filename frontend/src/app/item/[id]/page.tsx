'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ItemComparison from '../../../components/ItemComparison';

interface ItemClientProps {
  item: any; // Use the same Item type from page.tsx or export it
}

export default function ItemDetailClient({ item }: ItemClientProps) {
  const [mainImg, setMainImg] = useState(0);
  const [tab, setTab] = useState('description');

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  const getTimeLeft = (endDate: string) => {
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
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              padding: 18,
              marginBottom: 18,
              position: 'relative',
              height: 400,
            }}
          >
            {item.images?.length ? (
              <Image src={item.images[mainImg]} alt="main" fill style={{ borderRadius: 8, objectFit: 'contain' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                No image available
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {item.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {item.images.map((img: string, idx: number) => (
                <div
                  key={img}
                  style={{
                    position: 'relative',
                    width: 56,
                    height: 56,
                    borderRadius: 6,
                    border: mainImg === idx ? '2px solid #924DAC' : '1.5px solid #000',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => setMainImg(idx)}
                >
                  <Image src={img} alt={`thumb${idx}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ flex: 2, minWidth: 320 }}>
          <div
            style={{
              background: '#f7f7fa',
              borderLeft: '4px solid #924DAC',
              borderRadius: 8,
              padding: '10px 18px',
              color: '#555',
              marginBottom: 18,
              fontSize: 15,
            }}
          >
            {platformNote}
          </div>

          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#333' }}>{item.title}</div>

          {/* Pricing / Bidding / Exchange */}
          {/* ...Reuse your previous JSX with formatPrice() and getTimeLeft()... */}

          {/* Tabs */}
          <div style={{ maxWidth: 900, marginTop: 32 }}>
            <div style={{ display: 'flex', gap: 32, borderBottom: '2px solid #eee', marginBottom: 18 }}>
              {['description', 'specification', 'reviews'].map((t) => (
                <span
                  key={t}
                  style={{
                    fontWeight: 600,
                    color: tab === t ? '#924DAC' : '#888',
                    borderBottom: tab === t ? '3px solid #924DAC' : 'none',
                    paddingBottom: 8,
                    cursor: 'pointer',
                  }}
                  onClick={() => setTab(t)}
                >
                  {t.toUpperCase()}
                </span>
              ))}
            </div>
            <div>
              {tab === 'description' && <p>{item.description}</p>}
              {tab === 'specification' && (
                <div>
                  <strong>Category:</strong> {item.category}
                  <br />
                  <strong>Condition:</strong> {item.condition}
                </div>
              )}
              {tab === 'reviews' && <div>No reviews yet.</div>}
            </div>
          </div>

          {/* Item Comparison */}
          <div className="mt-8">
            <ItemComparison
              currentItem={{
                id: item.id,
                title: item.title,
                description: item.description,
                image: item.images[0] || '',
                images: item.images,
                category: item.category,
                condition: item.condition,
                price: item.price,
                originalPrice: item.originalPrice,
                discount: item.discount,
                currentBid: item.currentBid,
                startingBid: item.startingBid,
                buyNowPrice: item.buyNowPrice,
                timeLeft: item.auctionEndDate ? getTimeLeft(item.auctionEndDate) : undefined,
                totalBids: item.totalBids,
                location: item.location,
                postedDate: new Date(item.createdAt).toLocaleDateString(),
                userRating: 4.8,
                userReviews: 127,
                isVerified: true,
                priority: 'high',
                tags: item.tags,
                type: item.type,
                lookingFor: item.lookingFor,
                shipping: item.shipping,
                fastShipping: item.fastShipping,
              }}
              recommendations={[]} // Add your recommendations here
              onItemSelect={(selectedItem) => {
                window.location.href = `/item/${selectedItem.id}`;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
