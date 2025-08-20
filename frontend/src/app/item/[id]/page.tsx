'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
  // Additional fields from the form
  warrantyStatus?: string;
  itemCondition?: string;
  damageInfo?: string;
  usageHistory?: string;
  originalBox?: string;
}

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = params.id as string;
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImg, setMainImg] = useState(0);
  const [tab, setTab] = useState('description');
  const [qty, setQty] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Fetch item data
    const fetchItem = async () => {
      try {
        setLoading(true);
        const itemData = await apiService.getItemById(itemId);
        setItem(itemData);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  const handleChatWithSeller = () => {
    if (!isLoggedIn) {
      // Show login modal or redirect to login
      window.location.href = '/login';
      return;
    }
    // Navigate to messages page with seller
    window.location.href = `/messages?seller=${item?.user?.email}`;
  };

  const handleBidNow = () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    // Navigate to bidding page
    window.location.href = `/bidding?item=${itemId}`;
  };

  const handleBarter = () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    // Navigate to exchange page
    window.location.href = `/exchange?item=${itemId}`;
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    // Handle buy now logic
    alert('Buy now functionality coming soon!');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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
      <div style={{ background: '#fafafd', minHeight: 'calc(100vh - 120px)', padding: '32px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: 18, color: '#666' }}>Loading item details...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={{ background: '#fafafd', minHeight: 'calc(100vh - 120px)', padding: '32px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#666', marginBottom: 16 }}>{error || 'Item not found'}</div>
          <Link href="/browse" style={{ color: '#924DAC', textDecoration: 'none' }}>← Back to Browse</Link>
        </div>
      </div>
    );
  }

  const platformNote = 'Note: This platform allows you to bid, exchange, or resell used products. Connect with other users to find great deals, swap items, or get the best price for your pre-owned goods.';

  return (
    <div style={{ background: '#fafafd', minHeight: 'calc(100vh - 120px)', padding: '32px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Image Gallery */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 18, marginBottom: 18, position: 'relative', height: 400 }}>
            {item.images && item.images.length > 0 ? (
              <Image 
                src={item.images[mainImg] || '/api/placeholder/400/400'} 
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
          
          {/* Thumbnail Carousel */}
          {item.images && item.images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {item.images.map((img, idx) => (
                <div 
                  key={img} 
                  style={{ 
                    position: 'relative', 
                    width: 56, 
                    height: 56, 
                    borderRadius: 6, 
                    border: mainImg === idx ? '2px solid #924DAC' : '1.5px solid #000', 
                    cursor: 'pointer', 
                    overflow: 'hidden' 
                  }} 
                  onClick={() => setMainImg(idx)}
                >
                  <Image src={img} alt={`thumb${idx}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div style={{ flex: 2, minWidth: 320 }}>
          {/* Platform Note */}
          <div style={{ background: '#f7f7fa', borderLeft: '4px solid #924DAC', borderRadius: 8, padding: '10px 18px', color: '#555', marginBottom: 18, fontSize: 15 }}>
            {platformNote}
          </div>

          {/* Product Title */}
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#333' }}>
            {item.title}
          </div>

          {/* SKU, Brand, Availability */}
          <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>
            SKU: <b>{item.id.slice(0, 8).toUpperCase()}</b> &nbsp; 
            Category: <b>{item.category}</b>
          </div>
          <div style={{ color: '#388e3c', fontWeight: 600, marginBottom: 4 }}>
            Availability: In Stock
          </div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>
            Location: <b>{item.location}</b>
          </div>

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
                      <span style={{ color: '#2ecc40', fontWeight: 600, fontSize: 16, marginLeft: 8 }}>
                        {item.discount}% OFF
                      </span>
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
                {item.currentBid && (
                  <div style={{ fontSize: 16, color: '#666', marginBottom: 4 }}>
                    Current Bid: {formatPrice(item.currentBid)}
                  </div>
                )}
                {item.auctionEndDate && (
                  <div style={{ fontSize: 14, color: '#e74c3c', fontWeight: 600 }}>
                    ⏰ {getTimeLeft(item.auctionEndDate)}
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
              <div style={{ fontSize: 18, fontWeight: 600, color: '#924DAC' }}>
                Looking for: {item.lookingFor}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 16, marginBottom: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#333' }}>Item Details</div>
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

          {/* Damage Information */}
          {item.damageInfo && (
            <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 8, padding: 12, marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 4, color: '#856404' }}>Damage Information:</div>
              <div style={{ fontSize: 14, color: '#856404' }}>{item.damageInfo}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <button 
              onClick={handleChatWithSeller}
              className="sayonara-btn" 
              style={{ minWidth: 140, background: '#924DAC', color: '#fff' }}
            >
              💬 Chat with Seller
            </button>
            
            {item.type === 'bidding' && (
              <button 
                onClick={handleBidNow}
                className="sayonara-btn" 
                style={{ minWidth: 140 }}
              >
                🎯 Bid Now
              </button>
            )}
            
            {item.type === 'exchange' && (
              <button 
                onClick={handleBarter}
                className="sayonara-btn" 
                style={{ minWidth: 140 }}
              >
                🔄 Barter
              </button>
            )}
            
            {item.type === 'resell' && item.buyNowPrice && (
              <button 
                onClick={handleBuyNow}
                className="sayonara-btn" 
                style={{ minWidth: 140, background: '#2ecc40', color: '#fff' }}
              >
                💳 Buy Now
              </button>
            )}
          </div>

          {/* Seller Information */}
          {item.user && (
            <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 16, marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#333' }}>Seller Information</div>
              <div style={{ fontSize: 14, color: '#666' }}>
                <div>Name: {item.user.firstName} {item.user.lastName}</div>
                <div>Member since: {new Date(item.createdAt).toLocaleDateString()}</div>
                <div>Location: {item.location}</div>
              </div>
            </div>
          )}

          {/* Additional Actions */}
          <div style={{ color: '#888', fontSize: 15, marginBottom: 18 }}>
            <span style={{ marginRight: 18, cursor: 'pointer' }}>♡ Add to Wishlist</span>
            <span style={{ marginRight: 18, cursor: 'pointer' }}>⇄ Add to Compare</span>
            <span style={{ cursor: 'pointer' }}>Share product: <span style={{ fontSize: 18 }}>🔗</span></span>
          </div>

          {/* Guarantee Bar */}
          <div style={{ background: '#f7f7fa', borderRadius: 8, padding: '10px 18px', fontWeight: 600, color: '#388e3c', marginBottom: 18, fontSize: 15 }}>
            100% Guarantee Safe Checkout
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div style={{ maxWidth: 900, margin: '32px auto 0', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24 }}>
        <div style={{ display: 'flex', gap: 32, borderBottom: '2px solid #eee', marginBottom: 18 }}>
          <span 
            style={{ 
              fontWeight: 600, 
              color: tab === 'description' ? '#924DAC' : '#888', 
              borderBottom: tab === 'description' ? '3px solid #924DAC' : 'none', 
              paddingBottom: 8, 
              cursor: 'pointer' 
            }} 
            onClick={() => setTab('description')}
          >
            DESCRIPTION
          </span>
          <span 
            style={{ 
              fontWeight: 600, 
              color: tab === 'specification' ? '#924DAC' : '#888', 
              borderBottom: tab === 'specification' ? '3px solid #924DAC' : 'none', 
              paddingBottom: 8, 
              cursor: 'pointer' 
            }} 
            onClick={() => setTab('specification')}
          >
            SPECIFICATION
          </span>
          <span 
            style={{ 
              fontWeight: 600, 
              color: tab === 'reviews' ? '#924DAC' : '#888', 
              borderBottom: tab === 'reviews' ? '3px solid #924DAC' : 'none', 
              paddingBottom: 8, 
              cursor: 'pointer' 
            }} 
            onClick={() => setTab('reviews')}
          >
            REVIEWS
          </span>
        </div>
        
        <div style={{ color: '#444', fontSize: 16, minHeight: 80 }}>
          {tab === 'description' && (
            <div>
              <p style={{ lineHeight: 1.6, marginBottom: 16 }}>{item.description}</p>
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
                          color: '#666'
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
            <div>
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
                    <strong>Warranty Status:</strong> {item.warrantyStatus}
                  </div>
                )}
                {item.usageHistory && (
                  <div>
                    <strong>Usage History:</strong> {item.usageHistory}
                  </div>
                )}
                {item.originalBox && (
                  <div>
                    <strong>Original Box/Accessories:</strong> {item.originalBox}
                  </div>
                )}
                {item.shipping && (
                  <div>
                    <strong>Shipping:</strong> {item.shipping}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {tab === 'reviews' && (
            <div style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>No reviews yet</div>
              <div>Be the first to review this item!</div>
            </div>
          )}
        </div>
      </div>

      {/* Item Comparison Section */}
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
            exchangeType: 'negotiable',
            preferredCategories: ['Electronics', 'Computers'],
            itemValue: item.price || 0,
            shipping: item.shipping,
            fastShipping: item.fastShipping
          }}
          recommendations={[
            {
              id: 'rec1',
              title: 'Similar Item 1',
              description: 'This is a similar item that you might be interested in.',
              image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Similar+1',
              images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Similar+1'],
              category: 'Electronics',
              condition: 'Like New',
              price: 899.99,
              originalPrice: 1099.99,
              discount: 18,
              location: 'New York, NY',
              postedDate: '2 days ago',
              userRating: 4.7,
              userReviews: 89,
              isVerified: true,
              priority: 'high',
              tags: ['Electronics', 'Premium'],
              type: 'resell',
              shipping: 'Free',
              fastShipping: true
            },
            {
              id: 'rec2',
              title: 'Similar Item 2',
              description: 'Another great option with similar features.',
              image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Similar+2',
              images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Similar+2'],
              category: 'Electronics',
              condition: 'Excellent',
              currentBid: 750,
              startingBid: 600,
              buyNowPrice: 950,
              timeLeft: '1d 3h',
              totalBids: 12,
              location: 'Los Angeles, CA',
              postedDate: '1 day ago',
              userRating: 4.9,
              userReviews: 156,
              isVerified: true,
              priority: 'high',
              tags: ['Electronics', 'Bidding'],
              type: 'bidding'
            },
            {
              id: 'rec3',
              title: 'Similar Item 3',
              description: 'Perfect for exchange if you have something to trade.',
              image: 'https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Similar+3',
              images: ['https://via.placeholder.com/300x300/924DAC/FFFFFF?text=Similar+3'],
              category: 'Electronics',
              condition: 'Good',
              location: 'Chicago, IL',
              postedDate: '3 days ago',
              userRating: 4.6,
              userReviews: 78,
              isVerified: true,
              priority: 'medium',
              tags: ['Electronics', 'Exchange'],
              type: 'exchange',
              lookingFor: 'Similar electronics or gaming items',
              exchangeType: 'negotiable',
              preferredCategories: ['Electronics', 'Gaming'],
              itemValue: 650,
              shipping: 'Free',
              fastShipping: true
            }
          ]}
          onItemSelect={(selectedItem) => {
            // Navigate to the selected item's detail page
            window.location.href = `/item/${selectedItem.id}`;
          }}
        />
      </div>
    </div>
  );
} 