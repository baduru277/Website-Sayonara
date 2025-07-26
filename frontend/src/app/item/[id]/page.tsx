'use client';

import { useState } from 'react';
import Image from 'next/image';
import '../../../components/Header.css';

const mockProduct = {
  title: '2020 Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM, 256GB SSD Storage) - Space Gray',
  rating: 4.7,
  reviews: 21671,
  sku: 'A246471',
  brand: 'Apple',
  availability: 'In Stock',
  category: 'Electronics Devices',
  price: 145999,
  oldPrice: 189999,
  discount: 21,
  images: [
    '/macbook1.jpg', '/macbook2.jpg', '/macbook3.jpg', '/macbook4.jpg', '/macbook5.jpg'
  ],
  colorOptions: ['#fff', '#888'],
  sizeOptions: ['14-inch Liquid Retina XDR display'],
  memoryOptions: ['16GB unified memory'],
  storageOptions: ['1TV SSD Storage'],
  condition: 'New',
  description: 'The most powerful MacBook Pro ever is here. With the blazing fast M1 Pro or M1 Max chip — the first Apple silicon designed for pros — you get groundbreaking performance and amazing battery life. ...',
  specification: 'Feature\n- Fast Visual Warranty\n- Free shipping\n- ...',
  review: 'Great product! Highly recommended.'
};

export default function ItemDetailPage() {
  const [mainImg, setMainImg] = useState(0);
  const [tab, setTab] = useState('description');
  const [color, setColor] = useState(mockProduct.colorOptions[0]);
  const [size, setSize] = useState(mockProduct.sizeOptions[0]);
  const [memory, setMemory] = useState(mockProduct.memoryOptions[0]);
  const [storage, setStorage] = useState(mockProduct.storageOptions[0]);
  const [condition, setCondition] = useState('New');
  const [qty, setQty] = useState(1);

  const platformNote = 'Note: This platform allows you to bid, exchange, or resell used products. Connect with other users to find great deals, swap items, or get the best price for your pre-owned goods. No traditional e-commerce checkout—just community-driven trading and reselling.';

  return (
    <div style={{ background: '#fafafd', minHeight: 'calc(100vh - 120px)', padding: '32px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Image Gallery */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 18, marginBottom: 18, position: 'relative', height: 320 }}>
            <Image src={mockProduct.images[mainImg]} alt="main" fill style={{ borderRadius: 8, objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {mockProduct.images.map((img, idx) => (
              <div key={img} style={{ position: 'relative', width: 56, height: 56, borderRadius: 6, border: mainImg === idx ? '2px solid #924DAC' : '1.5px solid #eee', cursor: 'pointer', overflow: 'hidden' }} onClick={() => setMainImg(idx)}>
                <Image src={img} alt={"thumb"+idx} fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
        {/* Product Info & Actions */}
        <div style={{ flex: 2, minWidth: 320 }}>
          {/* Platform Note */}
          <div style={{ background: '#f7f7fa', borderLeft: '4px solid #924DAC', borderRadius: 8, padding: '10px 18px', color: '#555', marginBottom: 18, fontSize: 15 }}>
            {platformNote}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{mockProduct.title}</div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: '#f59e42', fontWeight: 700, fontSize: 18 }}>★ {mockProduct.rating}</span>
            <span style={{ color: '#888', marginLeft: 8 }}>({mockProduct.reviews} User feedback)</span>
          </div>
          <div style={{ color: '#666', fontSize: 15, marginBottom: 4 }}>Sku: <b>{mockProduct.sku}</b> &nbsp; Brand: <b>{mockProduct.brand}</b></div>
          <div style={{ color: '#388e3c', fontWeight: 600, marginBottom: 4 }}>Availability: {mockProduct.availability}</div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>Category: <b>{mockProduct.category}</b></div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#924DAC', margin: '12px 0' }}>
            ₹{mockProduct.price.toLocaleString()} <span style={{ color: '#888', fontSize: 18, textDecoration: 'line-through', marginLeft: 8 }}>₹{mockProduct.oldPrice.toLocaleString()}</span> <span style={{ color: '#2ecc40', fontWeight: 600, fontSize: 16, marginLeft: 8 }}>{mockProduct.discount}% OFF</span>
          </div>
          {/* Options */}
          <div style={{ display: 'flex', gap: 18, marginBottom: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 500, fontSize: 15 }}>Color</div>
              {mockProduct.colorOptions.map(opt => (
                <span key={opt} style={{ display: 'inline-block', width: 22, height: 22, borderRadius: '50%', background: opt, border: color === opt ? '2px solid #924DAC' : '1.5px solid #ccc', marginRight: 8, cursor: 'pointer' }} onClick={() => setColor(opt)} />
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 15 }}>Size</div>
              <select value={size} onChange={e => setSize(e.target.value)} style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid #ccc', fontSize: 15 }}>
                {mockProduct.sizeOptions.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 15 }}>Memory</div>
              <select value={memory} onChange={e => setMemory(e.target.value)} style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid #ccc', fontSize: 15 }}>
                {mockProduct.memoryOptions.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 15 }}>Storage</div>
              <select value={storage} onChange={e => setStorage(e.target.value)} style={{ padding: '4px 10px', borderRadius: 6, border: '1.5px solid #ccc', fontSize: 15 }}>
                {mockProduct.storageOptions.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          {/* Condition */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 500, marginRight: 12 }}>Condition:</span>
            {['New', 'Used', 'Refurbished'].map(opt => (
              <label key={opt} style={{ marginRight: 18, fontWeight: 500, color: condition === opt ? '#924DAC' : '#444', cursor: 'pointer' }}>
                <input type="radio" name="condition" value={opt} checked={condition === opt} onChange={e => setCondition(e.target.value)} style={{ marginRight: 6 }} />
                {opt}
              </label>
            ))}
          </div>
          {/* Quantity */}
          <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 500 }}>Qty</span>
            <button type="button" className="sayonara-btn" style={{ minWidth: 32, padding: '2px 10px' }} onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
            <span style={{ fontWeight: 600, fontSize: 16 }}>{qty}</span>
            <button type="button" className="sayonara-btn" style={{ minWidth: 32, padding: '2px 10px' }} onClick={() => setQty(q => q + 1)}>+</button>
          </div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <button className="sayonara-btn" style={{ minWidth: 140, background: '#924DAC', color: '#fff' }}>Chat with Seller</button>
            <button className="sayonara-btn" style={{ minWidth: 140 }}>Bid Now</button>
            <button className="sayonara-btn" style={{ minWidth: 140 }}>Barter</button>
          </div>
          {/* Wishlist/Compare/Share */}
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
      {/* Tabs */}
      <div style={{ maxWidth: 900, margin: '32px auto 0', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24 }}>
        <div style={{ display: 'flex', gap: 32, borderBottom: '2px solid #eee', marginBottom: 18 }}>
          <span style={{ fontWeight: 600, color: tab === 'description' ? '#924DAC' : '#888', borderBottom: tab === 'description' ? '3px solid #924DAC' : 'none', paddingBottom: 8, cursor: 'pointer' }} onClick={() => setTab('description')}>DESCRIPTION</span>
          <span style={{ fontWeight: 600, color: tab === 'specification' ? '#924DAC' : '#888', borderBottom: tab === 'specification' ? '3px solid #924DAC' : 'none', paddingBottom: 8, cursor: 'pointer' }} onClick={() => setTab('specification')}>SPECIFICATION</span>
          <span style={{ fontWeight: 600, color: tab === 'review' ? '#924DAC' : '#888', borderBottom: tab === 'review' ? '3px solid #924DAC' : 'none', paddingBottom: 8, cursor: 'pointer' }} onClick={() => setTab('review')}>REVIEW</span>
        </div>
        <div style={{ color: '#444', fontSize: 16, minHeight: 80 }}>
          {tab === 'description' && <div>{mockProduct.description}</div>}
          {tab === 'specification' && <div style={{ whiteSpace: 'pre-line' }}>{mockProduct.specification}</div>}
          {tab === 'review' && <div>{mockProduct.review}</div>}
        </div>
      </div>
    </div>
  );
} 