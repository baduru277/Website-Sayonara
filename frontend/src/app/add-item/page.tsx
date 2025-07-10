'use client';

import { useState } from 'react';
import "../../components/Header.css";

const subCategories = {
  'Phones and accessories': ['Smartphones', 'Smartwatches', 'Tablets', 'Accessories GSM', 'Cases and covers'],
  'Computers': ['Laptops', 'Laptop components', 'Desktop Computers', 'Computer components', 'Printers and scanners'],
  'TVs and accessories': ['TVs', 'Projectors', 'Headphones', 'Audio for home', 'Home cinema'],
  'Consoles and slot machines': ['Consoles PlayStation 5', 'Consoles Xbox Series X/S', 'Consoles PlayStation 4', 'Consoles Xbox One', 'Consoles Nintendo Switch'],
};

export default function AddItemPage() {
  const [step, setStep] = useState(1);
  // Step 1 state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    availability: '',
    length: '',
    width: '',
    height: '',
    price: '',
  });
  // Step 2 state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // Step 3 state
  const [images, setImages] = useState<File[]>([]);
  const [condition, setCondition] = useState('New');
  // Step 4 state
  const [actionType, setActionType] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [exchangeFor, setExchangeFor] = useState('');
  const [resellAmount, setResellAmount] = useState('');

  // Step 1 handlers
  const maxTitle = 60;
  const maxDesc = 1200;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Step 2 handlers
  const handleCategorySelect = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };
  const handleRemoveCategory = (cat: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== cat));
  };

  // Step 3 handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 10 - images.length);
      setImages(prev => [...prev, ...files]);
    }
  };
  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Stepper UI
  const stepper = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 32, gap: 48 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ background: step === 1 ? '#924DAC' : '#eee', color: step === 1 ? '#fff' : '#924DAC', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 22 }}>
          <span>①</span>
        </div>
        <div style={{ fontWeight: 600, color: step === 1 ? '#924DAC' : '#888', marginTop: 6 }}>Description</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ background: step === 2 ? '#924DAC' : '#eee', color: step === 2 ? '#fff' : '#924DAC', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 22 }}>
          <span>②</span>
        </div>
        <div style={{ fontWeight: 600, color: step === 2 ? '#924DAC' : '#888', marginTop: 6 }}>Categories</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ background: step === 3 ? '#924DAC' : '#eee', color: step === 3 ? '#fff' : '#924DAC', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 22 }}>
          <span>③</span>
        </div>
        <div style={{ fontWeight: 600, color: step === 3 ? '#924DAC' : '#888', marginTop: 6 }}>Photos</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ background: step === 4 ? '#924DAC' : '#eee', color: step === 4 ? '#fff' : '#924DAC', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 22 }}>
          <span>④</span>
        </div>
        <div style={{ fontWeight: 600, color: step === 4 ? '#924DAC' : '#888', marginTop: 6 }}>Action</div>
      </div>
    </div>
  );

  // Step 1: Description
  const step1 = (
    <form style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }} onSubmit={e => { e.preventDefault(); if (formData.title && formData.description) setStep(2); }}>
      {/* Left column */}
      <div style={{ flex: 2, minWidth: 260 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>Fill in the basic information about your item</div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Product name</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={maxTitle}
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ccc', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }}
            placeholder="e.g. GIGABYTE GeForce RTX 3050"
            required
          />
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{formData.title.length}/{maxTitle}</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={maxDesc}
            rows={4}
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ccc', borderRadius: 6, fontSize: 16, background: '#f7f7fa', resize: 'vertical' }}
            placeholder="Describe your item..."
            required
          />
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{formData.description.length}/{maxDesc}</div>
        </div>
      </div>
      {/* Right column */}
      <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Number of units available</label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ccc', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }}
            placeholder="Availability"
          />
        </div>
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Dimensions (optional)</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleChange}
              style={{ width: 60, padding: '8px 6px', border: '1.5px solid #ccc', borderRadius: 6, fontSize: 15, background: '#f7f7fa' }}
              placeholder="L"
            />
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleChange}
              style={{ width: 60, padding: '8px 6px', border: '1.5px solid #ccc', borderRadius: 6, fontSize: 15, background: '#f7f7fa' }}
              placeholder="W"
            />
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              style={{ width: 60, padding: '8px 6px', border: '1.5px solid #ccc', borderRadius: 6, fontSize: 15, background: '#f7f7fa' }}
              placeholder="H"
            />
          </div>
        </div>
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Initial price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ccc', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }}
            placeholder="Product price"
          />
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 18, marginTop: 36 }}>
        <button type="submit" className="sayonara-btn" style={{ minWidth: 120 }} disabled={!formData.title || !formData.description}>Next</button>
      </div>
    </form>
  );

  // Step 2: Categories
  const allSubcats = Object.entries(subCategories);
  const step2 = (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>Select the category your goods belong to (max. 3)</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 18 }}>
        {allSubcats.map(([group, cats]) => (
          <div key={group} style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>{group}</div>
            {cats.map(cat => (
              <label key={cat} style={{ display: 'block', marginBottom: 4, cursor: 'pointer', fontWeight: 400 }}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategorySelect(cat)}
                  disabled={!selectedCategories.includes(cat) && selectedCategories.length >= 3}
                  style={{ marginRight: 6 }}
                />
                {cat}
              </label>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 18 }}>
        <span style={{ fontWeight: 500 }}>Selected categories:</span>
        {selectedCategories.length === 0 && <span style={{ color: '#888', marginLeft: 8 }}>None</span>}
        {selectedCategories.map(cat => (
          <span key={cat} style={{ display: 'inline-block', background: '#f0e6fa', color: '#924DAC', borderRadius: 16, padding: '4px 12px', margin: '0 6px', fontWeight: 500 }}>
            {cat} <span style={{ cursor: 'pointer', marginLeft: 4 }} onClick={() => handleRemoveCategory(cat)}>&times;</span>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 32 }}>
        <button className="sayonara-btn" style={{ minWidth: 120 }} onClick={() => setStep(1)}>Back</button>
        <button className="sayonara-btn" style={{ minWidth: 120 }} disabled={selectedCategories.length === 0} onClick={() => setStep(3)}>Next</button>
      </div>
    </div>
  );

  // Step 3: Photos
  const step3 = (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>Add product photos (max 10)</div>
      <div style={{ border: '2px dashed #ccc', borderRadius: 12, padding: 24, marginBottom: 18, minHeight: 120, background: '#faf9fd' }}>
        <label style={{ display: 'inline-block', cursor: 'pointer', color: '#924DAC', fontWeight: 600, border: '2px solid #924DAC', borderRadius: 8, padding: '10px 18px', marginBottom: 12 }}>
          Upload a photo
          <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} disabled={images.length >= 10} />
        </label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          {images.map((img, idx) => (
            <div key={idx} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', background: '#fff', border: '1.5px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={URL.createObjectURL(img)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: 2, right: 6, color: '#924DAC', fontWeight: 700, cursor: 'pointer', fontSize: 18 }} onClick={() => handleRemoveImage(idx)}>&times;</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <span style={{ fontWeight: 500, marginRight: 12 }}>Condition:</span>
        {['New', 'Used', 'Refurbished'].map(opt => (
          <label key={opt} style={{ marginRight: 18, fontWeight: 500, color: condition === opt ? '#924DAC' : '#444', cursor: 'pointer' }}>
            <input type="radio" name="condition" value={opt} checked={condition === opt} onChange={e => setCondition(e.target.value)} style={{ marginRight: 6 }} />
            {opt}
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 36 }}>
        <button className="sayonara-btn" style={{ minWidth: 120 }} onClick={() => setStep(2)}>Back</button>
        <button className="sayonara-btn" style={{ minWidth: 120 }} disabled={images.length === 0} onClick={() => setStep(4)}>Next</button>
        <button className="sayonara-btn" style={{ minWidth: 120, background: '#fff', color: '#924DAC', border: '2px solid #924DAC' }} onClick={() => setStep(1)}>Draft</button>
      </div>
    </div>
  );

  // Step 4: Action
  const step4 = (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>What do you want to do?</div>
      <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
        <label style={{ fontWeight: 500, cursor: 'pointer' }}>
          <input type="radio" name="actionType" value="bid" checked={actionType === 'bid'} onChange={() => { setActionType('bid'); setBidAmount(''); setExchangeFor(''); setResellAmount(''); }} style={{ marginRight: 8 }} />
          Bid
        </label>
        <label style={{ fontWeight: 500, cursor: 'pointer' }}>
          <input type="radio" name="actionType" value="exchange" checked={actionType === 'exchange'} onChange={() => { setActionType('exchange'); setBidAmount(''); setExchangeFor(''); setResellAmount(''); }} style={{ marginRight: 8 }} />
          Exchange
        </label>
        <label style={{ fontWeight: 500, cursor: 'pointer' }}>
          <input type="radio" name="actionType" value="resell" checked={actionType === 'resell'} onChange={() => { setActionType('resell'); setBidAmount(''); setExchangeFor(''); setResellAmount(''); }} style={{ marginRight: 8 }} />
          Resell
        </label>
      </div>
      {actionType === 'bid' && (
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>How much are you looking for?</label>
          <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} style={{ width: 240, padding: '10px 12px', border: '1.5px solid #ccc', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }} placeholder="Expected bid amount" />
        </div>
      )}
      {actionType === 'exchange' && (
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>What are you looking for in exchange?</label>
          <input type="text" value={exchangeFor} onChange={e => setExchangeFor(e.target.value)} style={{ width: 240, padding: '10px 12px', border: '1.5px solid #ccc', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }} placeholder="Desired item" />
        </div>
      )}
      {actionType === 'resell' && (
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Resell amount</label>
          <input type="number" value={resellAmount} onChange={e => setResellAmount(e.target.value)} style={{ width: 240, padding: '10px 12px', border: '1.5px solid #ccc', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }} placeholder="Resell price" />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 36 }}>
        <button className="sayonara-btn" style={{ minWidth: 120 }} onClick={() => setStep(3)}>Back</button>
        <button className="sayonara-btn" style={{ minWidth: 120 }} disabled={
          (actionType === 'bid' && !bidAmount) ||
          (actionType === 'exchange' && !exchangeFor) ||
          (actionType === 'resell' && !resellAmount) ||
          !actionType
        } onClick={() => setStep(5)}>Publish</button>
        <button className="sayonara-btn" style={{ minWidth: 120, background: '#fff', color: '#924DAC', border: '2px solid #924DAC' }} onClick={() => setStep(1)}>Draft</button>
      </div>
    </div>
  );

  // Step 5: Success
  const step5 = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ background: '#eafbe7', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <span style={{ color: '#2ecc40', fontSize: 48 }}>✔</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 22, color: '#222', marginBottom: 8 }}>Your Product is successfully Uploaded</div>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7fa', padding: '32px 0' }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', maxWidth: 900, width: '100%', padding: 36 }}>
        {stepper}
        {step === 1 && step1}
        {step === 2 && step2}
        {step === 3 && step3}
        {step === 4 && step4}
        {step === 5 && step5}
      </div>
    </div>
  );
} 