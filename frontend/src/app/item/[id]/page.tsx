// src/app/item/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../../components/Header.css';
import apiService from '../../../services/api';
import ItemComparison from '../../../components/ItemComparison';

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
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  warrantyStatus?: string;
  usageHistory?: string;
  originalBox?: string;
  damageInfo?: string;
}

interface PageProps {
  params: { id: string };
}

export default function ItemDetailPage({ params }: PageProps) {
  const itemId = params.id;
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImg, setMainImg] = useState(0);
  const [tab, setTab] = useState('description');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Fetch item
    const fetchItem = async () => {
      try {
        setLoading(true);
        const itemData = await apiService.getItemById(itemId);
        setItem(itemData);
      } catch (err) {
        console.error(err);
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleChatWithSeller = () => {
    if (!isLoggedIn) return window.location.href = '/login';
    window.location.href = `/messages?seller=${item?.user?.email}`;
  };

  const handleBidNow = () => {
    if (!isLoggedIn) return window.location.href = '/login';
    window.location.href = `/bidding?item=${itemId}`;
  };

  const handleBarter = () => {
    if (!isLoggedIn) return window.location.href = '/login';
    window.location.href = `/exchange?item=${itemId}`;
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) return window.location.href = '/login';
    alert('Buy now functionality coming soon!');
  };

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

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Loading item details...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div>{error || 'Item not found'}</div>
        <Link href="/browse">← Back to Browse</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        {/* Image Gallery */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ position: 'relative', height: 400, background: '#fff', borderRadius: 12 }}>
            {item.images && item.images.length ? (
              <Image src={item.images[mainImg]} alt="main" fill style={{ objectFit: 'contain' }} />
            ) : <div>No image available</div>}
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {item.images.map((img, idx) => (
              <div key={idx} onClick={() => setMainImg(idx)} style={{ width: 56, height: 56, border: mainImg === idx ? '2px solid #924DAC' : '1px solid #ccc', cursor: 'pointer' }}>
                <Image src={img} alt={`thumb-${idx}`} fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Info & Actions */}
        <div style={{ flex: 2, minWidth: 320 }}>
          <h2>{item.title}</h2>
          <div>Category: {item.category}</div>
          <div>Condition: {item.condition}</div>
          <div>Location: {item.location}</div>

          {/* Pricing */}
          {item.type === 'resell' && item.price && <div>Price: {formatPrice(item.price)}</div>}
          {item.type === 'bidding' && item.startingBid && (
            <div>
              <div>Starting Bid: {formatPrice(item.startingBid)}</div>
              {item.currentBid && <div>Current Bid: {formatPrice(item.currentBid)}</div>}
              {item.auctionEndDate && <div>⏰ {getTimeLeft(item.auctionEndDate)}</div>}
            </div>
          )}
          {item.type === 'exchange' && item.lookingFor && <div>Looking for: {item.lookingFor}</div>}

          {/* Actions */}
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button onClick={handleChatWithSeller}>Chat with Seller</button>
            {item.type === 'bidding' && <button onClick={handleBidNow}>Bid Now</button>}
            {item.type === 'exchange' && <button onClick={handleBarter}>Barter</button>}
            {item.type === 'resell' && item.buyNowPrice && <button onClick={handleBuyNow}>Buy Now</button>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', gap: 32 }}>
          {['description', 'specification', 'reviews'].map((t) => (
            <span
              key={t}
              style={{ cursor: 'pointer', fontWeight: tab === t ? 600 : 400, color: tab === t ? '#924DAC' : '#888' }}
              onClick={() => setTab(t)}
            >
              {t.toUpperCase()}
            </span>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          {tab === 'description' && <p>{item.description}</p>}
          {tab === 'specification' && (
            <div>
              <div>Category: {item.category}</div>
              <div>Condition: {item.condition}</div>
              <div>Location: {item.location}</div>
              {item.warrantyStatus && <div>Warranty: {item.warrantyStatus}</div>}
              {item.usageHistory && <div>Usage: {item.usageHistory}</div>}
              {item.originalBox && <div>Original Box: {item.originalBox}</div>}
              {item.shipping && <div>Shipping: {item.shipping}</div>}
            </div>
          )}
          {tab === 'reviews' && <div>No reviews yet</div>}
        </div>
      </div>

      {/* Item Comparison */}
      <div style={{ marginTop: 32 }}>
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
            fastShipping: item.fastShipping
          }}
          recommendations={[]} // Add real recommendations if available
          onItemSelect={(selected) => window.location.href = `/item/${selected.id}`}
        />
      </div>
    </div>
  );
}
