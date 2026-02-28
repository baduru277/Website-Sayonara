'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';
import { validateImageFile } from '@/utils/imageResize';
import "../../components/Header.css";

const subCategories = {
  'Phones and accessories': ['Smartphones', 'Smartwatches', 'Tablets', 'Accessories GSM', 'Cases and covers', 'Chargers', 'Earphones', 'Power banks'],
  'Computers': ['Laptops', 'Laptop components', 'Desktop Computers', 'Computer components', 'Printers and scanners', 'Monitors', 'Keyboards', 'Mice', 'Storage devices'],
  'TVs and accessories': ['TVs', 'Smart TVs', 'Projectors', 'Headphones', 'Soundbars', 'Home cinema', 'Remote controls', 'Wall mounts'],
  'Consoles and slot machines': ['Consoles PlayStation 5', 'Consoles Xbox Series X/S', 'Consoles PlayStation 4', 'Consoles Xbox One', 'Consoles Nintendo Switch', 'Game controllers', 'Gaming accessories'],
  'Cameras and Photography': ['DSLR Cameras', 'Mirrorless Cameras', 'Camcorders', 'Camera lenses', 'Tripods', 'Memory cards', 'Camera accessories'],
  'Networking': ['Wi-Fi Routers', 'Modems', 'Network switches', 'Range extenders', 'Cables'],
  'Wearable Tech': ['Fitness trackers', 'Smart bands', 'VR headsets', 'AR devices'],
  'Smart Home': ['Smart bulbs', 'Smart plugs', 'Smart thermostats', 'Security cameras', 'Smart speakers'],
  'Audio Equipment': ['Speakers', 'Home audio systems', 'Turntables', 'Microphones', 'Studio equipment'],
  'Office Equipment': ['Projectors', 'Fax machines', 'Paper shredders', 'Label printers'],
  'Gaming': ['Gaming PCs', 'Gaming laptops', 'Gaming monitors', 'Gaming chairs', 'Gaming desks', 'Gamepads'],
  'Software': ['Operating systems', 'Antivirus', 'Office suites', 'Design software', 'Developer tools'],
  'Men Clothing': ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Jackets', 'Suits', 'Ethnic wear'],
  'Women Clothing': ['Tops', 'Dresses', 'Jeans', 'Sarees', 'Kurtis', 'Skirts', 'Leggings', 'Jackets'],
  'Kids Clothing': ['T-Shirts', 'Frocks', 'Shorts', 'Jeans', 'School uniforms', 'Party wear'],
  'Watches and Accessories': ['Wrist Watches', 'Smartwatches', 'Bracelets', 'Watch straps'],
  'Bags and Wallets': ['Backpacks', 'Handbags', 'Sling bags', 'Wallets', 'Clutches'],
  'Eyewear and Headwear': ['Sunglasses', 'Eyeglasses', 'Hats', 'Caps', 'Scarves'],
  'Belts and Other Accessories': ['Leather belts', 'Suspenders', 'Keychains', 'Fashion pins'],
  'Jewelry': ['Gold jewelry', 'Silver jewelry', 'Diamond jewelry', 'Imitation jewelry', 'Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Anklets'],
  'Footwear': ['Casual shoes', 'Formal shoes', 'Sports shoes', 'Sandals', 'Slippers', 'Heels', 'Boots', 'Flip-flops'],
  'Fruits and Vegetables': ['Fresh fruits', 'Fresh vegetables', 'Organic produce'],
  'Snacks and Bakery': ['Chips', 'Cookies', 'Cakes', 'Biscuits', 'Namkeen'],
  'Dairy and Eggs': ['Milk', 'Cheese', 'Butter', 'Yogurt', 'Eggs', 'Paneer'],
  'Meat and Seafood': ['Chicken', 'Mutton', 'Fish', 'Shrimp', 'Frozen meat'],
  'Frozen and Ready-to-eat': ['Frozen snacks', 'Ready meals', 'Instant noodles', 'Frozen paratha'],
  'Beverages': ['Tea', 'Coffee', 'Juices', 'Soft drinks', 'Energy drinks', 'Bottled water'],
  'Staples': ['Rice', 'Wheat', 'Pulses', 'Cooking oil', 'Spices', 'Salt', 'Sugar', 'Flour'],
  'Dry Fruits and Nuts': ['Almonds', 'Cashews', 'Raisins', 'Pistachios', 'Dates', 'Walnuts'],
  'Skincare': ['Face wash', 'Moisturizers', 'Sunscreens', 'Serums', 'Cleansers', 'Toners'],
  'Haircare': ['Shampoos', 'Conditioners', 'Hair oils', 'Hair masks', 'Hair colors'],
  'Makeup': ['Lipsticks', 'Foundations', 'Mascaras', 'Eyeliners', 'Blushes', 'Nail polish'],
  'Bath & Body': ['Body wash', 'Soaps', 'Body lotions', 'Scrubs', 'Hand creams'],
  'Mens Grooming': ['Shaving creams', 'Razors', 'Beard oils', 'Aftershave', 'Face wash for men'],
  'Medicines': ['Prescription drugs', 'Over-the-counter medicines', 'Pain relievers', 'Allergy medications'],
  'Supplements': ['Vitamins', 'Protein powders', 'Herbal supplements', 'Omega-3'],
  'Medical Devices': ['Thermometers', 'Oximeters', 'Blood pressure monitors', 'Diabetic care'],
  'Health Essentials': ['Sanitizers', 'Face masks', 'Disinfectants', 'First aid kits'],
  'Kitchen Appliances': ['Microwaves', 'Mixers', 'Grinders', 'Electric kettles', 'Toasters', 'Blenders'],
  'Cookware': ['Non-stick pans', 'Cookers', 'Tawas', 'Utensil sets', 'Pressure cookers'],
  'Dining': ['Dinner sets', 'Cutlery', 'Bowls', 'Plates', 'Glassware'],
  'Home Decor': ['Wall art', 'Lamps', 'Photo frames', 'Vases', 'Decorative items'],
  'Furniture': ['Beds', 'Sofas', 'Tables', 'Chairs', 'Wardrobes'],
  'Storage and Organization': ['Containers', 'Shelves', 'Racks', 'Boxes'],
  'Cleaning Supplies': ['Detergents', 'Floor cleaners', 'Mops', 'Scrubs', 'Brooms'],
  'Others': ['Miscellaneous', 'Uncategorized items', 'Gadgets', 'Tech gifts', 'Used/refurbished items']
};

export default function AddItemPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const router = useRouter();

  const FREE_LIMIT = 3;

  // On mount: check item count & subscription — show modal if free plan & >= 3 items
  useEffect(() => {
    const checkLimit = async () => {
      try {
        const data = await apiService.getDashboard();
        const count = data?.stats?.totalItems ?? 0;
        const sub = data?.user?.subscriptions?.[0];
        const active = sub?.status === 'active' && sub?.expiryDate && new Date(sub.expiryDate) > new Date();
        setItemCount(count);
        setIsSubscribed(!!active);
        if (!active && count >= FREE_LIMIT) {
          setShowUpgradeModal(true);
        }
      } catch (err) {
        console.error('Failed to check item limit:', err);
      }
    };
    checkLimit();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    warrantyStatus: '',
    itemCondition: '',
    damageInfo: '',
    usageHistory: '',
    originalBox: '',
    price: '',
  });
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [condition, setCondition] = useState('New');
  
  const [actionType, setActionType] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [exchangeFor, setExchangeFor] = useState('');
  const [resellAmount, setResellAmount] = useState('');

  const maxTitle = 60;
  const maxDesc = 1200;
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  // FIX: Use URL.createObjectURL for reliable instant previews
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 10 - images.length);
      
      const validFiles = files.filter(file => {
        if (!validateImageFile(file)) {
          alert(`Invalid file: ${file.name}. Please upload a valid image file (JPEG, PNG, WebP, GIF) under 5MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      try {
        const previews = validFiles.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...previews]);
      } catch (error) {
        console.error('Error processing images:', error);
        alert('Error processing images. Please try again.');
      }
    }
  };
  
  // FIX: Revoke object URL on remove to free memory
  const handleRemoveImage = (idx: number) => {
    URL.revokeObjectURL(imagePreviews[idx]);
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitItem = async () => {
    if (!actionType) return;
    
    console.log('🔍 DEBUG: Starting handleSubmitItem');
    console.log('🔍 actionType:', actionType);
    console.log('🔍 API_URL from env:', process.env.NEXT_PUBLIC_API_URL);
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create an item');
        router.push('/');
        return;
      }

      // STEP 1: Upload images separately using existing apiService (multipart)
      // This keeps item creation as JSON so backend express.json() works correctly
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        try {
          console.log('📸 Uploading', images.length, 'image(s)...');
          const uploadResult = await apiService.uploadMultipleImages(images);
          uploadedImageUrls = uploadResult?.urls || uploadResult?.images || [];
          console.log('✅ Images uploaded:', uploadedImageUrls);
        } catch (imgErr) {
          console.warn('⚠️ Image upload failed, continuing without images:', imgErr);
        }
      }

      // STEP 2: Create item as JSON — matches backend's express.json() parser
      const itemData = {
        title: formData.title,
        description: formData.description,
        category: selectedCategories[0] || 'Other',
        condition: condition,
        type: actionType,
        stock: 1,
        images: uploadedImageUrls,
        tags: selectedCategories,
        location: 'Andhra Pradesh',
        ...(formData.warrantyStatus && { warrantyStatus: formData.warrantyStatus }),
        ...(formData.itemCondition && { itemCondition: formData.itemCondition }),
        ...(formData.damageInfo && { damageInfo: formData.damageInfo }),
        ...(formData.usageHistory && { usageHistory: formData.usageHistory }),
        ...(formData.originalBox && { originalBox: formData.originalBox }),
        ...(actionType === 'resell' && { price: parseFloat(resellAmount) || 0 }),
        ...(actionType === 'exchange' && { lookingFor: exchangeFor }),
        ...(actionType === 'bidding' && {
          startingBid: parseFloat(bidAmount) || 0,
          auctionEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log('📦 Request payload:', itemData);

      const fullUrl = `${apiUrl}/items`;
      console.log('🚀 Making fetch request to:', fullUrl);

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', {
        'content-type': response.headers.get('content-type'),
        'content-length': response.headers.get('content-length')
      });

      const responseText = await response.text();
      console.log('📥 Raw response (first 500 chars):', responseText.substring(0, 500));

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('✅ Response parsed as JSON:', responseData);
      } catch (parseError) {
        console.error('❌ Failed to parse as JSON');
        console.error('Parse error:', parseError);
        throw new Error(`Server returned HTML/non-JSON. First 200 chars: ${responseText.substring(0, 200)}`);
      }

      if (!response.ok) {
        const errorMessage = responseData?.error || responseData?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      console.log('✅ Item created successfully:', responseData);

      if (responseData.item || responseData.message) {
        setStep(5);
        setTimeout(() => {
          switch (actionType) {
            case 'bidding':
              router.push('/bidding');
              break;
            case 'exchange':
              router.push('/exchange');
              break;
            case 'resell':
              router.push('/resell');
              break;
            default:
              router.push('/');
          }
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error creating item:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create item. Please try again.';
      alert(`Error: ${errorMsg}\n\nCheck browser console (F12) for debugging details.`);
    } finally {
      setLoading(false);
    }
  };

  const stepper = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 32, gap: 48 }}>
      {[1, 2, 3, 4].map((num) => (
        <div key={num} style={{ textAlign: 'center' }}>
          <div style={{ background: step === num ? '#924DAC' : '#eee', color: step === num ? '#fff' : '#924DAC', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 22 }}>
            <span>{String(num).padStart(1, '0')}</span>
          </div>
          <div style={{ fontWeight: 600, color: step === num ? '#924DAC' : '#888', marginTop: 6 }}>
            {num === 1 ? 'Description' : num === 2 ? 'Categories' : num === 3 ? 'Photos' : 'Action'}
          </div>
        </div>
      ))}
    </div>
  );

  const step1 = (
    <form style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }} onSubmit={e => { e.preventDefault(); if (formData.title && formData.description) setStep(2); }}>
      <div style={{ flex: 2, minWidth: 260 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>Fill in the basic information about your item</div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Product name</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} maxLength={maxTitle} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }} placeholder="e.g. GIGABYTE GeForce RTX 3050" required />
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{formData.title.length}/{maxTitle}</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} maxLength={maxDesc} rows={4} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa', resize: 'vertical' }} placeholder="Describe your item..." required />
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{formData.description.length}/{maxDesc}</div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Warranty Status</label>
          <select name="warrantyStatus" value={formData.warrantyStatus} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }}>
            <option value="">Select warranty status</option>
            <option value="Under Warranty">Under Warranty</option>
            <option value="Out of Warranty">Out of Warranty</option>
            <option value="No Warranty">No Warranty</option>
            <option value="Extended Warranty">Extended Warranty</option>
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Item Condition</label>
          <select name="itemCondition" value={formData.itemCondition} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }}>
            <option value="">Select condition</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="For Parts">For Parts</option>
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Damage Information</label>
          <textarea name="damageInfo" value={formData.damageInfo} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa', resize: 'vertical' }} placeholder="Describe any damages..." />
        </div>
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Usage History</label>
          <select name="usageHistory" value={formData.usageHistory} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }}>
            <option value="">Select usage history</option>
            <option value="Brand New">Brand New (Never Used)</option>
            <option value="Lightly Used">Lightly Used (1-6 months)</option>
            <option value="Moderately Used">Moderately Used (6-12 months)</option>
            <option value="Heavily Used">Heavily Used (1+ years)</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Original Box/Accessories</label>
          <select name="originalBox" value={formData.originalBox} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }}>
            <option value="">Select box/accessories status</option>
            <option value="Complete">Complete (Box + All Accessories)</option>
            <option value="Partial">Partial (Some Accessories Missing)</option>
            <option value="No Box">No Original Box</option>
            <option value="No Accessories">No Accessories</option>
            <option value="N/A">Not Applicable</option>
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Initial price</label>
          <input type="text" name="price" value={formData.price} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }} placeholder="Product price" />
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 18, marginTop: 36 }}>
        <button type="submit" className="sayonara-btn" style={{ minWidth: 120 }} disabled={!formData.title || !formData.description}>Next</button>
      </div>
    </form>
  );

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
                <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategorySelect(cat)} disabled={!selectedCategories.includes(cat) && selectedCategories.length >= 3} style={{ marginRight: 6 }} />
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

  const step3 = (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>Add product photos (max 10)</div>
      <div style={{ border: '2px dashed #ccc', borderRadius: 12, padding: 24, marginBottom: 18, minHeight: 120, background: '#faf9fd' }}>
        <label style={{ display: 'inline-block', cursor: 'pointer', color: '#924DAC', fontWeight: 600, border: '2px solid #924DAC', borderRadius: 8, padding: '10px 18px', marginBottom: 12 }}>
          Upload a photo
          <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} disabled={images.length >= 10} />
        </label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          {imagePreviews.map((img, idx) => (
            <div key={idx} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', background: '#fff', border: '1.5px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

  const step4 = (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>What do you want to do?</div>
      <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
        <label style={{ fontWeight: 500, cursor: 'pointer' }}>
          <input type="radio" name="actionType" value="bidding" checked={actionType === 'bidding'} onChange={() => { setActionType('bidding'); setBidAmount(''); setExchangeFor(''); setResellAmount(''); }} style={{ marginRight: 8 }} />
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
      {actionType === 'bidding' && (
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>How much are you looking for?</label>
          <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} style={{ width: 240, padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }} placeholder="Expected bid amount" />
        </div>
      )}
      {actionType === 'exchange' && (
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>What are you looking for in exchange?</label>
          <input type="text" value={exchangeFor} onChange={e => setExchangeFor(e.target.value)} style={{ width: 240, padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }} placeholder="Desired item" />
        </div>
      )}
      {actionType === 'resell' && (
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Resell amount</label>
          <input type="number" value={resellAmount} onChange={e => setResellAmount(e.target.value)} style={{ width: 240, padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }} placeholder="Resell price" />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 36 }}>
        <button className="sayonara-btn" style={{ minWidth: 120 }} onClick={() => setStep(3)}>Back</button>
        <button className="sayonara-btn" style={{ minWidth: 120 }} disabled={(actionType === 'bidding' && !bidAmount) || (actionType === 'exchange' && !exchangeFor) || (actionType === 'resell' && !resellAmount) || !actionType || loading} onClick={handleSubmitItem}>
          {loading ? 'Publishing...' : 'Publish'}
        </button>
        <button className="sayonara-btn" style={{ minWidth: 120, background: '#fff', color: '#924DAC', border: '2px solid #924DAC' }} onClick={() => setStep(1)}>Draft</button>
      </div>
    </div>
  );

  const step5 = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ background: '#eafbe7', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <span style={{ color: '#2ecc40', fontSize: 48 }}>✔</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 22, color: '#222', marginBottom: 8 }}>Your Product is successfully Uploaded</div>
      <div style={{ color: '#666', fontSize: 16, marginBottom: 16 }}>
        Redirecting to {actionType === 'bidding' ? 'Bidding' : actionType === 'exchange' ? 'Exchange' : 'Resell'} page...
      </div>
    </div>
  );

  // Upgrade modal — shown when free user hits 3-item limit
  const upgradeModal = showUpgradeModal && (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: 40, maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🔒</div>
        <h2 style={{ fontWeight: 700, fontSize: 22, color: '#222', marginBottom: 10 }}>Free Plan Limit Reached</h2>
        <p style={{ color: '#555', fontSize: 15, marginBottom: 6 }}>
          You've used all <strong>3 free listings</strong> on your current plan.
        </p>
        <p style={{ color: '#555', fontSize: 15, marginBottom: 24 }}>
          Upgrade to unlimited listings for just <strong style={{ color: '#924DAC' }}>₹99/year</strong> — special promotion for this year only!
        </p>
        <a
          href="https://sayonaraa.com/payment"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', background: 'linear-gradient(90deg, #924DAC, #b06fd4)', color: '#fff', fontWeight: 700, borderRadius: 10, padding: '14px 0', fontSize: 16, textDecoration: 'none', marginBottom: 12 }}
        >
          Subscribe Now — ₹99/year →
        </a>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: '#888', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
        >
          Go back
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', background: '#f7f7fa', padding: '32px 0' }}>
      {upgradeModal}

      {/* Promotional notification banner */}
      <div style={{ background: 'linear-gradient(90deg, #924DAC 0%, #b06fd4 100%)', color: '#fff', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24, borderRadius: 12, maxWidth: 900, margin: '0 auto 24px auto', boxShadow: '0 2px 12px rgba(146,77,172,0.18)' }}>
        <span style={{ fontSize: 20 }}>🎁</span>
        <span style={{ fontWeight: 500, fontSize: 15 }}>
          Free plan is limited to <strong>3 items</strong>. Unlock unlimited listings for just <strong>₹99/year</strong> — special promotion for this year only!
        </span>
        <a href="https://sayonaraa.com/payment" target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: '#924DAC', fontWeight: 700, borderRadius: 20, padding: '7px 20px', fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}>
          Subscribe Now →
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', maxWidth: 900, width: '100%', padding: 36 }}>
          {stepper}
          {step === 1 && step1}
          {step === 2 && step2}
          {step === 3 && step3}
          {step === 4 && step4}
          {step === 5 && step5}
        </div>
      </div>
    </div>
  );
}
