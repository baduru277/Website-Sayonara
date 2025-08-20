'use client';

import Image from 'next/image';
import { useState } from 'react';

const testImages = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Nike Air Jordan 1",
    image: "https://images.unsplash.com/photo-1517263904808-5dc0d6e1ad21?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Guitar - Fender Stratocaster",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    title: "Gaming PC Setup",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  }
];

export default function TestHomeImages() {
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});

  const handleImageError = (id: number) => {
    console.error(`Image failed to load for item ${id}`);
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const handleImageLoad = (id: number) => {
    console.log(`Image loaded successfully for item ${id}`);
    setImageErrors(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Home Page Images Test</h1>

      <div className="mb-6 p-4 bg-blue-100 rounded-lg">
        <h3 className="font-semibold mb-2">Testing Instructions:</h3>
        <ul className="text-sm space-y-1">
          <li>• Check if images load properly</li>
          <li>• Look for any console errors</li>
          <li>• Verify image dimensions and aspect ratios</li>
          <li>• Test with different screen sizes</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testImages.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="grid-image-wrapper">
              {imageErrors[item.id] ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Image failed to load</span>
                </div>
              ) : (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(item.id)}
                  onLoad={() => handleImageLoad(item.id)}
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">
                {imageErrors[item.id] ? '❌ Failed to load' : '✅ Loaded successfully'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <div className="text-sm space-y-1">
          <p>• Open browser console (F12) to see detailed logs</p>
          <p>• Check Network tab for image loading status</p>
          <p>• Verify Next.js image optimization is working</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Image URLs:</h3>
        <div className="text-sm space-y-1">
          {testImages.map((item) => (
            <div key={item.id} className="break-all">
              <strong>{item.title}:</strong> {item.image}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 