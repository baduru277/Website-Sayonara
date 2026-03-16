'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiService from '@/services/api';
import { validateImageFile } from '@/utils/imageResize';
import "../../components/Header.css";

const subCategories: Record<string, string[]> = {
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
  'Beverages': ['Tea', 'Coffee', 'Juices', 'Soft drinks', 'Energy drinks', 'Bottled water'],
  'Staples': ['Rice', 'Wheat', 'Pulses', 'Cooking oil', 'Spices', 'Salt', 'Sugar', 'Flour'],
  'Skincare': ['Face wash', 'Moisturizers', 'Sunscreens', 'Serums', 'Cleansers', 'Toners'],
  'Haircare': ['Shampoos', 'Conditioners', 'Hair oils', 'Hair masks', 'Hair colors'],
  'Makeup': ['Lipsticks', 'Foundations', 'Mascaras', 'Eyeliners', 'Blushes', 'Nail polish'],
  'Supplements': ['Vitamins', 'Protein powders', 'Herbal supplements', 'Omega-3'],
  'Medical Devices': ['Thermometers', 'Oximeters', 'Blood pressure monitors', 'Diabetic care'],
  'Kitchen Appliances': ['Microwaves', 'Mixers', 'Grinders', 'Electric kettles', 'Toasters', 'Blenders'],
  'Cookware': ['Non-stick pans', 'Cookers', 'Tawas', 'Utensil sets', 'Pressure cookers'],
  'Home Decor': ['Wall art', 'Lamps', 'Photo frames', 'Vases', 'Decorative items'],
  'Furniture': ['Beds', 'Sofas', 'Tables', 'Chairs', 'Wardrobes'],
  'Cleaning Supplies': ['Detergents', 'Floor cleaners', 'Mops', 'Scrubs', 'Brooms'],
  'Others': ['Miscellaneous', 'Uncategorized items', 'Gadgets', 'Tech gifts', 'Used/refurbished items']
};

const categoryKeywords: Record<string, string[]> = {
  'Smartphones': ['phone', 'iphone', 'samsung', 'oneplus', 'redmi', 'realme', 'oppo', 'vivo', 'nokia', 'motorola', 'pixel', 'android', 'mobile'],
  'Laptops': ['laptop', 'notebook', 'macbook', 'lenovo', 'dell', 'hp', 'asus', 'acer', 'thinkpad'],
  'TVs': ['tv', 'television', 'led', 'oled', 'smart tv', 'lcd'],
  'DSLR Cameras': ['camera', 'dslr', 'canon', 'nikon', 'sony camera', 'mirrorless'],
  'Earphones': ['earphone', 'earbuds', 'headphone', 'airpods', 'bluetooth earphone', 'headset', 'noise cancell'],
  'Speakers': ['speaker', 'jbl', 'bose', 'soundbar', 'bluetooth speaker'],
  'Tablets': ['tablet', 'ipad', 'tab', 'samsung tab'],
  'Smartwatches': ['smartwatch', 'watch', 'fitbit', 'apple watch', 'galaxy watch'],
  'Gamepads': ['gamepad', 'controller', 'joystick', 'ps5', 'xbox', 'playstation'],
  'Printers and scanners': ['printer', 'scanner', 'epson'],
  'Wi-Fi Routers': ['router', 'wifi', 'wi-fi', 'netgear', 'tp-link'],
  'Keyboards': ['keyboard', 'mechanical keyboard'],
  'Monitors': ['monitor', 'display', 'screen'],
  'Storage devices': ['ssd', 'hard disk', 'hdd', 'pendrive', 'usb drive', 'memory card'],
  'Sports shoes': ['nike', 'adidas', 'sneakers', 'sports shoes', 'running shoes'],
  'Sarees': ['saree', 'sari'],
  'Kurtis': ['kurti', 'kurta'],
  'Jeans': ['jeans', 'denim'],
  'Jackets': ['jacket', 'hoodie', 'sweatshirt'],
  'Gold jewelry': ['gold', 'gold chain', 'gold ring'],
  'Necklaces': ['necklace', 'chain', 'pendant'],
  'Backpacks': ['backpack', 'bag', 'school bag'],
  'Sofas': ['sofa', 'couch'],
  'Beds': ['bed', 'mattress', 'cot'],
  'Wardrobes': ['wardrobe', 'almirah', 'closet'],
  'Microwaves': ['microwave', 'oven'],
  'Mixers': ['mixer', 'grinder', 'blender', 'juicer'],
  'Protein powders': ['protein', 'whey', 'supplement'],
  'Miscellaneous': ['other', 'misc', 'random'],
};

function autoDetectCategory(title: string, description: string): string[] {
  const text = (title + ' ' + description).toLowerCase();
  const scores: Record<string, number> = {};
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    for (const kw of keywords) {
      if (text.includes(kw)) scores[cat] = (scores[cat] || 0) + (kw.length > 5 ? 2 : 1);
    }
  }
  if (Object.keys(scores).length === 0) return ['Miscellaneous'];
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([cat]) => cat);
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
function fixImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url}`;
}

function isVideoFile(file: File) {
  return file.type.startsWith('video/');
}

function AddItemPageInner() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [autoCategories, setAutoCategories] = useState<string[]>([]);
  const [categoryOverridden, setCategoryOverridden] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // formData MUST be before useEffects that use it
  const [formData, setFormData] = useState({
    title: '', description: '', warrantyStatus: '', itemCondition: '',
    damageInfo: '', usageHistory: '', originalBox: '', price: '',
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]); // images + videos
  const [previews, setPreviews] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [condition, setCondition] = useState('New');
  const [actionType, setActionType] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [minNotifyBid, setMinNotifyBid] = useState('');
  const [exchangeFor, setExchangeFor] = useState('');
  const [resellAmount, setResellAmount] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const FREE_LIMIT = 3;

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setIsEditMode(true);
      setEditItemId(editId);
      loadItemForEdit(editId);
    } else {
      const checkLimit = async () => {
        try {
          const data = await apiService.getDashboard();
          const count = data?.stats?.totalItems ?? 0;
          const sub = data?.user?.subscriptions?.[0];
          const active = sub?.status === 'active' && sub?.expiryDate && new Date(sub.expiryDate) > new Date();
          if (!active && count >= FREE_LIMIT) setShowUpgradeModal(true);
        } catch {}
      };
      checkLimit();
    }
  }, []);

  useEffect(() => {
    if (!categoryOverridden && (formData.title.length > 3 || formData.description.length > 10)) {
      const detected = autoDetectCategory(formData.title, formData.description);
      setAutoCategories(detected);
      setSelectedCategories(detected);
    }
  }, [formData.title, formData.description, categoryOverridden]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => { if (cameraStream) cameraStream.getTracks().forEach(t => t.stop()); };
  }, [cameraStream]);

  const loadItemForEdit = async (itemId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const item = data.item || data;
      setFormData({
        title: item.title || '', description: item.description || '',
        warrantyStatus: item.warrantyStatus || '', itemCondition: item.itemCondition || '',
        damageInfo: item.damageInfo || '', usageHistory: item.usageHistory || '',
        originalBox: item.originalBox || '', price: item.price || '',
      });
      setSelectedCategories(item.tags || (item.category ? [item.category] : []));
      setCategoryOverridden(true);
      setCondition(item.condition || 'New');
      setActionType(item.type || '');
      setExistingImages((item.images || []).map(fixImageUrl));
      if (item.type === 'bidding') { setBidAmount(String(item.startingBid || '')); setMinNotifyBid(String(item.minimumNotifyBid || '')); }
      if (item.type === 'exchange') setExchangeFor(item.lookingFor || '');
      if (item.type === 'resell') setResellAmount(String(item.price || ''));
    } catch { alert('Failed to load item.'); }
  };

  const handleDelete = async () => {
    if (!editItemId) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${editItemId}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) { alert('Item deleted!'); router.push(`/${actionType || 'bidding'}`); }
      else { const d = await res.json(); alert(`Failed: ${d.error}`); }
    } catch { alert('Failed to delete.'); }
    finally { setDeleting(false); setShowDeleteConfirm(false); }
  };

  const addFiles = (newFiles: File[]) => {
    const maxFiles = 10;
    const remaining = maxFiles - files.length - existingImages.length;
    const toAdd = newFiles.slice(0, remaining);
    const newPreviews = toAdd.map(f => ({
      url: URL.createObjectURL(f),
      type: isVideoFile(f) ? 'video' as const : 'image' as const
    }));
    setFiles(prev => [...prev, ...toAdd]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const removeFile = (idx: number) => {
    URL.revokeObjectURL(previews[idx].url);
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      setCameraStream(stream);
      setShowCamera(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch { alert('Camera not available on this device/browser.'); }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
      addFiles([file]);
      closeCamera();
    }, 'image/jpeg', 0.9);
  };

  const closeCamera = () => {
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    setCameraStream(null);
    setShowCamera(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (cat: string) => {
    setCategoryOverridden(true);
    if (selectedCategories.includes(cat)) setSelectedCategories(selectedCategories.filter(c => c !== cat));
    else if (selectedCategories.length < 3) setSelectedCategories([...selectedCategories, cat]);
  };

  const handleSubmitItem = async () => {
    if (!actionType) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { alert('You must be logged in'); router.push('/'); return; }

      let uploadedUrls: string[] = isEditMode
        ? [...existingImages.map(url => url.startsWith(BASE_URL) ? url.replace(BASE_URL, '') : url)]
        : [];

      if (files.length > 0) {
        try {
          const uploadResult = await apiService.uploadMultipleImages(files);
          const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
          const newUrls = (uploadResult?.imageUrls || uploadResult?.urls || uploadResult?.images || [])
            .map((url: string) => url.startsWith('http') ? url : `${baseUrl}${url}`);
          uploadedUrls = [...uploadedUrls, ...newUrls];
        } catch {}
      }

      const itemData: any = {
        title: formData.title, description: formData.description,
        category: selectedCategories[0] || 'Miscellaneous', condition, type: actionType,
        stock: 1, images: uploadedUrls, tags: selectedCategories, location: 'Andhra Pradesh',
        ...(formData.warrantyStatus && { warrantyStatus: formData.warrantyStatus }),
        ...(formData.damageInfo && { damageInfo: formData.damageInfo }),
        ...(formData.usageHistory && { usageHistory: formData.usageHistory }),
        ...(formData.originalBox && { originalBox: formData.originalBox }),
        ...(actionType === 'resell' && { price: parseFloat(resellAmount) || 0 }),
        ...(actionType === 'exchange' && { lookingFor: exchangeFor }),
        ...(actionType === 'bidding' && {
          startingBid: parseFloat(bidAmount) || 0,
          ...(minNotifyBid && { minimumNotifyBid: parseFloat(minNotifyBid) }),
          ...(!isEditMode && { auctionEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() })
        })
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(isEditMode ? `${apiUrl}/items/${editItemId}` : `${apiUrl}/items`, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(itemData)
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData?.error || `HTTP ${response.status}`);

      setStep(5);
      setTimeout(() => router.push(`/${actionType}`), 2000);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to save item.'}`);
    } finally { setLoading(false); }
  };

  const maxTitle = 60;
  const maxDesc = 1200;
  const allSubcats = Object.entries(subCategories);

  const stepper = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 32, gap: 48 }}>
      {[1, 2, 3, 4].map((num) => (
        <div key={num} style={{ textAlign: 'center' }}>
          <div style={{ background: step === num ? '#924DAC' : '#eee', color: step === num ? '#fff' : '#924DAC', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 18, fontWeight: 700 }}>{num}</div>
          <div style={{ fontWeight: 600, color: step === num ? '#924DAC' : '#888', marginTop: 6, fontSize: 13 }}>
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
          <input type="text" name="title" value={formData.title} onChange={handleChange} maxLength={maxTitle}
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }}
            placeholder="e.g. Samsung Galaxy S21, Nike Air Max..." required />
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{formData.title.length}/{maxTitle}</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} maxLength={maxDesc} rows={4}
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa', resize: 'vertical' }}
            placeholder="Describe your item in detail..." required />
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{formData.description.length}/{maxDesc}</div>
        </div>
        {selectedCategories.length > 0 && (
          <div style={{ background: '#f0f9f0', border: '1.5px solid #86efac', borderRadius: 10, padding: '12px 16px', marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 6 }}>
              {categoryOverridden ? 'Selected Categories:' : 'Auto-detected Categories:'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {selectedCategories.map(cat => (
                <span key={cat} style={{ background: '#dcfce7', color: '#166534', borderRadius: 50, padding: '3px 12px', fontSize: 13, fontWeight: 600 }}>{cat}</span>
              ))}
              <button type="button" onClick={() => setStep(2)} style={{ background: 'none', border: '1.5px solid #924DAC', color: '#924DAC', borderRadius: 50, padding: '3px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Change</button>
            </div>
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { label: 'Warranty Status', name: 'warrantyStatus', opts: ['Under Warranty', 'Out of Warranty', 'No Warranty', 'Extended Warranty'] },
          { label: 'Item Condition', name: 'itemCondition', opts: ['Excellent', 'Good', 'Fair', 'Poor', 'For Parts'] },
          { label: 'Usage History', name: 'usageHistory', opts: ['Brand New', 'Lightly Used', 'Moderately Used', 'Heavily Used', 'Unknown'] },
          { label: 'Original Box/Accessories', name: 'originalBox', opts: ['Complete', 'Partial', 'No Box', 'No Accessories', 'N/A'] },
        ].map(({ label, name, opts }) => (
          <div key={name}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>{label}</label>
            <select name={name} value={(formData as any)[name]} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 15, background: '#f7f7fa' }}>
              <option value="">Select...</option>
              {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Damage Information</label>
          <textarea name="damageInfo" value={formData.damageInfo} onChange={handleChange} rows={2}
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 15, background: '#f7f7fa', resize: 'vertical' }}
            placeholder="Describe any damages..." />
        </div>
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Initial price</label>
          <input type="text" name="price" value={formData.price} onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 15, background: '#f7f7fa' }}
            placeholder="Original product price" />
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <button type="submit" className="sayonara-btn" style={{ minWidth: 140 }} disabled={!formData.title || !formData.description}>Next</button>
      </div>
    </form>
  );

  const step2 = (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Confirm or change your categories (max 3)</div>
      {!categoryOverridden && autoCategories.length > 0 && (
        <div style={{ background: '#f0f9f0', border: '1.5px solid #86efac', borderRadius: 10, padding: '12px 16px', marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 4 }}>Auto-detected:</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {autoCategories.map(cat => <span key={cat} style={{ background: '#dcfce7', color: '#166534', borderRadius: 50, padding: '3px 12px', fontSize: 13, fontWeight: 600 }}>{cat}</span>)}
          </div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 6 }}>Looks correct? Click Next! Or select below.</div>
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 18, maxHeight: 400, overflowY: 'auto' }}>
        {allSubcats.map(([group, cats]) => (
          <div key={group} style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 500, marginBottom: 6, color: '#924DAC' }}>{group}</div>
            {cats.map(cat => (
              <label key={cat} style={{ display: 'block', marginBottom: 4, cursor: 'pointer', fontWeight: selectedCategories.includes(cat) ? 700 : 400, color: selectedCategories.includes(cat) ? '#924DAC' : '#333' }}>
                <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategorySelect(cat)}
                  disabled={!selectedCategories.includes(cat) && selectedCategories.length >= 3} style={{ marginRight: 6 }} />
                {cat}
              </label>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 18 }}>
        <span style={{ fontWeight: 500 }}>Selected:</span>
        {selectedCategories.length === 0 && <span style={{ color: '#888', marginLeft: 8 }}>None</span>}
        {selectedCategories.map(cat => (
          <span key={cat} style={{ display: 'inline-block', background: '#f0e6fa', color: '#924DAC', borderRadius: 16, padding: '4px 12px', margin: '0 6px', fontWeight: 500 }}>
            {cat} <span style={{ cursor: 'pointer', marginLeft: 4 }} onClick={() => { setCategoryOverridden(true); setSelectedCategories(selectedCategories.filter(c => c !== cat)); }}>&times;</span>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
        <button className="sayonara-btn" style={{ minWidth: 120 }} onClick={() => setStep(1)}>Back</button>
        <button className="sayonara-btn" style={{ minWidth: 120 }} disabled={selectedCategories.length === 0} onClick={() => setStep(3)}>Next</button>
      </div>
    </div>
  );

  const totalMediaCount = existingImages.length + files.length;

  const step3 = (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>Add photos and videos (max 10)</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 18 }}>Supports JPG, PNG, WebP images and MP4, MOV videos</div>

      {/* Upload area — drag & drop */}
      <div
        onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
        style={{
          border: `2px dashed ${dragOver ? '#924DAC' : '#ccc'}`,
          borderRadius: 16, padding: 32, marginBottom: 18,
          background: dragOver ? '#faf5ff' : '#faf9fd',
          transition: 'all 0.2s', textAlign: 'center',
          minHeight: 160,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>&#x1F4F7;</div>
        <div style={{ fontWeight: 600, color: '#924DAC', fontSize: 16, marginBottom: 8 }}>
          Drag and drop photos or videos here
        </div>
        <div style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>or use the buttons below</div>

        {/* Upload buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: '#924DAC', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14 }}>
            <span>&#x1F4C1;</span> Choose Files
            <input type="file" accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={handleFileInput} disabled={totalMediaCount >= 10} />
          </label>

          <button type="button" onClick={openCamera} disabled={totalMediaCount >= 10}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#924DAC', border: '2px solid #924DAC', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            <span>&#x1F4F8;</span> Open Camera
          </button>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: '#fff', color: '#924DAC', border: '2px solid #924DAC', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14 }}>
            <span>&#x1F3A5;</span> Upload Video
            <input type="file" accept="video/*" multiple style={{ display: 'none' }} onChange={handleFileInput} disabled={totalMediaCount >= 10} />
          </label>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: '#aaa' }}>{totalMediaCount}/10 files added</div>
      </div>

      {/* Previews */}
      {(existingImages.length > 0 || previews.length > 0) && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          {existingImages.map((img, idx) => (
            <div key={`ex-${idx}`} style={{ position: 'relative', width: 90, height: 90, borderRadius: 10, overflow: 'hidden', border: '2px solid #924DAC' }}>
              <img src={img} alt="saved" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: 2, right: 6, color: '#e74c3c', fontWeight: 700, cursor: 'pointer', fontSize: 18, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}>
                &times;
              </span>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(146,77,172,0.75)', fontSize: 9, color: '#fff', textAlign: 'center', padding: '2px 0' }}>Saved</div>
            </div>
          ))}
          {previews.map((p, idx) => (
            <div key={idx} style={{ position: 'relative', width: 90, height: 90, borderRadius: 10, overflow: 'hidden', border: '1.5px solid #eee', background: '#000' }}>
              {p.type === 'video' ? (
                <>
                  <video src={p.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, textAlign: 'center', padding: '2px 0' }}>&#x1F3A5; Video</div>
                </>
              ) : (
                <img src={p.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <span style={{ position: 'absolute', top: 2, right: 4, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 16, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => removeFile(idx)}>
                &times;
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 18 }}>
        <span style={{ fontWeight: 500, marginRight: 12 }}>Condition:</span>
        {['New', 'Used', 'Refurbished'].map(opt => (
          <label key={opt} style={{ marginRight: 18, fontWeight: 500, color: condition === opt ? '#924DAC' : '#444', cursor: 'pointer' }}>
            <input type="radio" name="condition" value={opt} checked={condition === opt} onChange={e => setCondition(e.target.value)} style={{ marginRight: 6 }} />
            {opt}
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
        <button className="sayonara-btn" style={{ minWidth: 120 }} onClick={() => setStep(2)}>Back</button>
        <button className="sayonara-btn" style={{ minWidth: 120 }} disabled={files.length === 0 && existingImages.length === 0} onClick={() => setStep(4)}>Next</button>
        {!isEditMode && <button className="sayonara-btn" style={{ minWidth: 120, background: '#fff', color: '#924DAC', border: '2px solid #924DAC' }} onClick={() => setStep(1)}>Draft</button>}
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#000', borderRadius: 16, overflow: 'hidden', maxWidth: 500, width: '100%', position: 'relative' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '60vh', background: '#000' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', padding: 20, background: '#111' }}>
              <button onClick={capturePhoto} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: '50%', width: 64, height: 64, fontSize: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                &#x1F4F8;
              </button>
              <button onClick={closeCamera} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const step4 = (
    <div>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>What do you want to do?</div>
      <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
        {['bidding', 'exchange', 'resell'].map(type => (
          <label key={type} style={{ fontWeight: 500, cursor: 'pointer' }}>
            <input type="radio" name="actionType" value={type} checked={actionType === type}
              onChange={() => { setActionType(type); setBidAmount(''); setMinNotifyBid(''); setExchangeFor(''); setResellAmount(''); }}
              style={{ marginRight: 8 }} />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>

      {actionType === 'bidding' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Starting Bid Amount (Rs.) *</label>
            <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
              style={{ width: 240, padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }} placeholder="e.g. 5000" />
          </div>
          <div style={{ background: '#fefce8', border: '1.5px solid #fde047', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span>&#x1F514;</span>
              <label style={{ fontWeight: 700, color: '#854d0e', fontSize: 15 }}>Minimum Notify Bid (Rs.) — Optional</label>
              <span style={{ background: '#fde047', color: '#854d0e', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 50 }}>PRIVATE</span>
            </div>
            <p style={{ fontSize: 13, color: '#713f12', marginBottom: 10 }}>Only get notified when bid reaches this amount. Hidden from buyers.</p>
            <input type="number" value={minNotifyBid} onChange={e => setMinNotifyBid(e.target.value)}
              style={{ width: 240, padding: '10px 12px', border: '1.5px solid #fde047', borderRadius: 6, fontSize: 16, background: '#fff' }}
              placeholder={bidAmount ? `e.g. ${Math.round(parseFloat(bidAmount) * 1.5)}` : 'e.g. 7500'} />
            {minNotifyBid && bidAmount && parseFloat(minNotifyBid) <= parseFloat(bidAmount) && (
              <div style={{ color: '#e53e3e', fontSize: 12, marginTop: 6, fontWeight: 600 }}>Must be higher than starting bid</div>
            )}
          </div>
        </div>
      )}

      {actionType === 'exchange' && (
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>What are you looking for in exchange?</label>
          <input type="text" value={exchangeFor} onChange={e => setExchangeFor(e.target.value)}
            style={{ width: 280, padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }} placeholder="e.g. iPhone 12, Laptop" />
        </div>
      )}

      {actionType === 'resell' && (
        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Resell Amount (Rs.) *</label>
          <input type="number" value={resellAmount} onChange={e => setResellAmount(e.target.value)}
            style={{ width: 240, padding: '10px 12px', border: '1.5px solid #000', borderRadius: 6, fontSize: 16, background: '#f7f7fa' }} placeholder="e.g. 15000" />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 36, flexWrap: 'wrap' }}>
        <button className="sayonara-btn" style={{ minWidth: 120 }} onClick={() => setStep(3)}>Back</button>
        <button className="sayonara-btn" style={{ minWidth: 120 }}
          disabled={
            (actionType === 'bidding' && (!bidAmount || (!!minNotifyBid && !!bidAmount && parseFloat(minNotifyBid) <= parseFloat(bidAmount)))) ||
            (actionType === 'exchange' && !exchangeFor) ||
            (actionType === 'resell' && !resellAmount) ||
            !actionType || loading
          }
          onClick={handleSubmitItem}>
          {loading ? (isEditMode ? 'Saving...' : 'Publishing...') : (isEditMode ? 'Save Changes' : 'Publish')}
        </button>
        {isEditMode && (
          <button onClick={() => setShowDeleteConfirm(true)}
            style={{ minWidth: 120, background: '#fff', color: '#e74c3c', border: '2px solid #e74c3c', borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
            Delete Item
          </button>
        )}
      </div>
    </div>
  );

  const step5 = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ background: '#eafbe7', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <span style={{ color: '#2ecc40', fontSize: 48 }}>&#x2714;</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 22, color: '#222', marginBottom: 8 }}>{isEditMode ? 'Item updated!' : 'Your item is live!'}</div>
      <div style={{ color: '#666', fontSize: 16 }}>Redirecting...</div>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', background: '#f7f7fa', padding: '32px 0' }}>

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 40, maxWidth: 440, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>&#x1F512;</div>
            <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Free Plan Limit Reached</h2>
            <p style={{ color: '#555', marginBottom: 24 }}>Upgrade for just <strong style={{ color: '#924DAC' }}>Rs.99/year</strong> for unlimited listings!</p>
            <a href="https://sayonaraa.com/payment" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', background: 'linear-gradient(90deg,#924DAC,#b06fd4)', color: '#fff', fontWeight: 700, borderRadius: 10, padding: '14px 0', fontSize: 16, textDecoration: 'none', marginBottom: 12 }}>
              Subscribe Now — Rs.99/year
            </a>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#888', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>Go back</button>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 40, maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>&#x1F5D1;</div>
            <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Delete this item?</h2>
            <p style={{ color: '#555', marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ background: '#f0f0f0', color: '#444', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {!isEditMode && (
        <div style={{ background: 'linear-gradient(90deg,#924DAC,#b06fd4)', color: '#fff', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24, borderRadius: 12, maxWidth: 900, margin: '0 auto 24px auto' }}>
          <span>Free plan: <strong>3 items max</strong>. Unlock unlimited for <strong>Rs.99/year</strong>!</span>
          <a href="https://sayonaraa.com/payment" target="_blank" rel="noopener noreferrer"
            style={{ background: '#fff', color: '#924DAC', fontWeight: 700, borderRadius: 20, padding: '6px 18px', fontSize: 13, textDecoration: 'none' }}>
            Subscribe Now
          </a>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', maxWidth: 900, width: '100%', padding: 36 }}>
          {isEditMode && (
            <div style={{ background: '#f0e6fa', border: '1.5px solid #d4a8e8', borderRadius: 10, padding: '12px 20px', marginBottom: 24, color: '#924DAC', fontWeight: 600 }}>
              Edit Mode — Modify your listing and click Save Changes.
            </div>
          )}
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

export default function AddItemPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f7f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#924DAC' }}>Loading...</div>}>
      <AddItemPageInner />
    </Suspense>
  );
}
