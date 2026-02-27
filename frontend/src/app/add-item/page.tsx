'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';
import { resizeImagesForGrid, validateImageFile, createThumbnail } from '@/utils/imageResize';
import "../../components/Header.css";

// ... (keep all your subCategories object as is) ...

export default function AddItemPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userItemCount, setUserItemCount] = useState(0);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const router = useRouter();
  
  // ... (keep all your existing state variables) ...
  
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
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [condition, setCondition] = useState('New');
  
  const [actionType, setActionType] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [exchangeFor, setExchangeFor] = useState('');
  const [resellAmount, setResellAmount] = useState('');

  const maxTitle = 60;
  const maxDesc = 1200;
  const FREE_TIER_LIMIT = 3; // ✅ FREE USERS CAN POST 3 ITEMS

  // ✅ CHECK USER'S ITEM COUNT AND SUBSCRIPTION ON LOAD
  useEffect(() => {
    checkUserLimits();
  }, []);

  const checkUserLimits = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to post items');
        router.push('/');
        return;
      }

      // Check subscription status
      try {
        const subResponse = await apiService.getSubscription();
        const subscription = subResponse?.subscription;
        
        if (subscription && subscription.status === 'active') {
          setHasActiveSubscription(true);
          console.log('✅ User has active subscription - unlimited posts');
        } else {
          setHasActiveSubscription(false);
          console.log('⚠️ User on free tier - checking item count...');
        }
      } catch (err) {
        console.log('No subscription found - free tier');
        setHasActiveSubscription(false);
      }

      // Check how many items user has posted
      try {
        const itemsResponse = await apiService.getMyItems();
        const count = itemsResponse?.items?.length || 0;
        setUserItemCount(count);
        console.log(`📊 User has posted ${count} items`);

        // If free tier and already at limit, show upgrade modal
        if (!hasActiveSubscription && count >= FREE_TIER_LIMIT) {
          console.log('🚫 Free tier limit reached!');
          setShowUpgradeModal(true);
        }
      } catch (err) {
        console.error('Error fetching user items:', err);
      }
    } catch (error) {
      console.error('Error checking limits:', error);
    } finally {
      setCheckingLimit(false);
    }
  };

  const handleUpgradeClick = () => {
    // Redirect to payment page with ₹99/year plan
    router.push('/payment?plan=Annual%20Plan&amount=99&duration=1%20Year');
  };

  // ... (keep all your existing handler functions) ...
  
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
        const resizedImages = await resizeImagesForGrid(validFiles, {
          maxWidth: 400,
          maxHeight: 300,
          quality: 0.8,
          maintainAspectRatio: true
        });

        const thumbnailPromises = validFiles.map(file => createThumbnail(file, 80));
        const thumbnails = await Promise.all(thumbnailPromises);

        setImages(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...resizedImages]);
      } catch (error) {
        console.error('Error processing images:', error);
        alert('Error processing images. Please try again.');
      }
    }
  };
  
  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    
    if (uploadedImageUrls[idx]) {
      setUploadedImageUrls(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const uploadImagesToServer = async () => {
    if (images.length === 0) {
      return [];
    }

    console.log('📤 Uploading', images.length, 'images to server...');
    setUploadingImages(true);

    try {
      const formData = new FormData();
      
      images.forEach((image) => {
        formData.append('images', image);
      });
      formData.append('folder', 'products');

      console.log('📤 Calling uploadMultipleImages...');
      const response = await apiService.uploadMultipleImages(formData);
      
      console.log('✅ Images uploaded:', response);
      
      const imageUrls = response.images.map((img: any) => img.imageUrl);
      setUploadedImageUrls(imageUrls);
      
      return imageUrls;
    } catch (error) {
      console.error('❌ Failed to upload images:', error);
      throw new Error('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmitItem = async () => {
    if (!actionType) return;
    
    // ✅ CHECK LIMIT BEFORE SUBMITTING
    if (!hasActiveSubscription && userItemCount >= FREE_TIER_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }
    
    console.log('🔍 Starting item creation...');
    console.log('📸 Images to upload:', images.length);
    
    setLoading(true);
    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (images.length > 0) {
        console.log('📤 Uploading images...');
        imageUrls = await uploadImagesToServer();
        console.log('✅ Images uploaded:', imageUrls);
      }

      // Create item with image URLs
      const itemData = {
        title: formData.title,
        description: formData.description,
        category: selectedCategories[0] || 'Other',
        condition: condition,
        type: actionType,
        stock: 1,
        images: imageUrls,
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

      console.log('📦 Creating item with data:', itemData);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create an item');
        router.push('/');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create item');
      }

      const responseData = await response.json();
      console.log('✅ Item created successfully:', responseData);

      // Update item count
      setUserItemCount(prev => prev + 1);

      // Show success and redirect
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
    } catch (error) {
      console.error('❌ Error creating item:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create item. Please try again.';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPGRADE MODAL
  const UpgradeModal = () => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 40,
          maxWidth: 500,
          width: '90%',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>🚀</div>
        
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#924DAC', marginBottom: 12 }}>
          Upgrade to Post More
        </h2>
        
        <p style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>
          You've reached your free tier limit of <strong>{FREE_TIER_LIMIT} items</strong>
        </p>
        
        <div
          style={{
            background: 'linear-gradient(135deg, #f3eaff 0%, #e7ffe7 100%)',
            borderRadius: 12,
            padding: 24,
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
            Annual Subscription
          </div>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#924DAC', marginBottom: 8 }}>
            ₹99
          </div>
          <div style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>
            for 1 full year
          </div>
          
          <div style={{ textAlign: 'left', fontSize: 14, color: '#444', lineHeight: 2 }}>
            ✅ <strong>Unlimited</strong> item posts<br />
            ✅ Post to Bidding, Exchange & Resell<br />
            ✅ Priority support<br />
            ✅ Analytics & insights<br />
            ✅ Featured listings
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => {
              setShowUpgradeModal(false);
              router.push('/');
            }}
            style={{
              padding: '12px 24px',
              background: '#fff',
              color: '#924DAC',
              border: '2px solid #924DAC',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Maybe Later
          </button>
          
          <button
            onClick={handleUpgradeClick}
            style={{
              padding: '12px 24px',
              background: '#924DAC',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Upgrade Now →
          </button>
        </div>

        <div style={{ fontSize: 13, color: '#999', marginTop: 16 }}>
          💡 You currently have {userItemCount} of {FREE_TIER_LIMIT} free posts used
        </div>
      </div>
    </div>
  );

  // Loading check
  if (checkingLimit) {
    return (
      <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7fa' }}>
        <div style={{ textAlign: 'center', color: '#924DAC', fontSize: 18 }}>
          <div style={{ marginBottom: 16 }}>🔍 Checking your account...</div>
        </div>
      </div>
    );
  }

  // Show upgrade modal if limit reached
  if (showUpgradeModal) {
    return <UpgradeModal />;
  }

  // ... (keep all your existing stepper, step1, step2, step3, step4, step5 code) ...
  
  // Your existing stepper code goes here
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

  // Add info banner showing remaining free posts
  const FreeTierBanner = () => {
    if (hasActiveSubscription) {
      return (
        <div style={{
          background: 'linear-gradient(135deg, #e7ffe7 0%, #eafff3 100%)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          textAlign: 'center',
          fontSize: 14,
          color: '#2d7a2d',
          fontWeight: 600
        }}>
          💎 Premium Account - Unlimited Posts
        </div>
      );
    }

    const remaining = FREE_TIER_LIMIT - userItemCount;
    
    return (
      <div style={{
        background: remaining > 0 ? 'linear-gradient(135deg, #fff3ea 0%, #f0e7ff 100%)' : 'linear-gradient(135deg, #ffe7e7 0%, #fff3ea 100%)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        textAlign: 'center',
        fontSize: 14,
        color: remaining > 0 ? '#d46b08' : '#d32f2f',
        fontWeight: 600
      }}>
        {remaining > 0 ? (
          <>
            🎉 Free Account: {remaining} of {FREE_TIER_LIMIT} posts remaining
            <span style={{ display: 'block', fontSize: 12, marginTop: 4, fontWeight: 400 }}>
              Upgrade to ₹99/year for unlimited posts
            </span>
          </>
        ) : (
          <>
            🚫 Free tier limit reached ({FREE_TIER_LIMIT} posts)
            <button
              onClick={handleUpgradeClick}
              style={{
                marginLeft: 12,
                padding: '4px 12px',
                background: '#924DAC',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Upgrade Now
            </button>
          </>
        )}
      </div>
    );
  };

  // [Keep all your existing step1, step2, step3, step4, step5 JSX code]
  // Just add FreeTierBanner at the top of the form

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7fa', padding: '32px 0' }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', maxWidth: 900, width: '100%', padding: 36 }}>
        <FreeTierBanner />
        {stepper}
        {/* Add all your step components here */}
        <div>Form steps go here (keep your existing code)</div>
      </div>
    </div>
  );
}
