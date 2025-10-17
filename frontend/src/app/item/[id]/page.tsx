import Image from 'next/image';
import Link from 'next/link';
import apiService from '../../../services/api';
import ItemComparison from '../../../components/ItemComparison';
import '../../../components/Header.css';
import { notFound } from 'next/navigation';

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
  itemCondition?: string;
  damageInfo?: string;
  usageHistory?: string;
  originalBox?: string;
}

interface ItemPageProps {
  params: { id: string };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getTimeLeft(endDate: string) {
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
}

export default async function ItemDetailPage({ params }: ItemPageProps) {
  const itemId = params.id;

  // Fetch item data server-side
  const item = await apiService.getItemById(itemId);

  if (!item) notFound();

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
            {item.images && item.images.length > 0 ? (
              <Image
                src={item.images[0] || '/api/placeholder/400/400'}
                alt="main"
                fill
                style={{ borderRadius: 8, objectFit: 'contain' }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div style={{ flex: 2, minWidth: 320 }}>
          {/* Platform Note */}
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

          {/* Product Title */}
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#333' }}>{item.title}</div>

          {/* SKU, Category, Location */}
          <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
            SKU: <b>{item.id.slice(0, 8).toUpperCase()}</b> &nbsp; Category: <b>{item.category}</b>
          </div>
          <div style={{ color: '#388e3c', fontWeight: 600, marginBottom: 4 }}>Availability: In Stock</div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>Location: <b>{item.location}</b></div>

          {/* Pricing Section */}
          <div style={{ margin: '16px 0' }}>
            {item.type === 'resell' && item.price && (
              <div style={{ fontSize: 24, fontWeight: 700, color: '#924DAC' }}>
                {formatPrice(item.price)}
                {item.originalPrice && item.originalPrice > item.price && (
                  <>
                    <span style={{ color: '#888', fontSize: 18, textDecoration: 'line-through', marginLeft: 8 }}>
                      {formatPrice(item.originalPrice)}
                    </span>
                    {item.discount && (
                      <span style={{ color: '#2ecc40', fontWeight: 600, fontSize: 16, marginLeft: 8 }}>{item.discount}% OFF</span>
                    )}
                  </>
                )}
              </div>
            )}

            {item.type === 'bidding' && item.startingBid && (
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#924DAC', marginBottom: 4 }}>
                  Starting Bid: {formatPrice(item.startingBid)}
                </div>
                {item.currentBid && <div style={{ fontSize: 16, color: '#666', marginBottom: 4 }}>Current Bid: {formatPrice(item.currentBid)}</div>}
                {item.auctionEndDate && <div style={{ fontSize: 14, color: '#e74c3c', fontWeight: 600 }}>⏰ {getTimeLeft(item.auctionEndDate)}</div>}
                {item.totalBids && <div style={{ fontSize: 14, color: '#666' }}>{item.totalBids} bids placed</div>}
              </div>
            )}

            {item.type === 'exchange' && item.lookingFor && (
              <div style={{ fontSize: 18, fontWeight: 600, color: '#924DAC' }}>Looking for: {item.lookingFor}</div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs and ItemComparison could be added here similarly */}
      {/* ... */}
    </div>
  );
}
