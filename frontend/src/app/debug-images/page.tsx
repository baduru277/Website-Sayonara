'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function DebugImages() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        setImageInfo({
          originalWidth: img.width,
          originalHeight: img.height,
          fileSize: file.size,
          fileType: file.type,
          fileName: file.name
        });
      };
      img.src = reader.result as string;
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Image Debug Page</h1>

      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
      </div>

      {imageInfo && (
        <div className="mb-6 p-4 bg-blue-100 rounded-lg">
          <h3 className="font-semibold mb-2">Image Information:</h3>
          <ul className="text-sm space-y-1">
            <li>• Original Width: {imageInfo.originalWidth}px</li>
            <li>• Original Height: {imageInfo.originalHeight}px</li>
            <li>• File Size: {(imageInfo.fileSize / 1024 / 1024).toFixed(2)}MB</li>
            <li>• File Type: {imageInfo.fileType}</li>
            <li>• File Name: {imageInfo.fileName}</li>
          </ul>
        </div>
      )}

      {uploadedImage && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Original Image */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Original Image</h3>
            <div className="border rounded-lg p-4">
              <img
                src={uploadedImage}
                alt="Original"
                className="max-w-full h-auto"
                style={{ maxHeight: '300px' }}
              />
            </div>
          </div>

          {/* Grid Image Wrapper */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Grid Image Wrapper</h3>
            <div className="border rounded-lg p-4">
              <div className="grid-image-wrapper">
                <img
                  src={uploadedImage}
                  alt="Grid"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Next.js Image Component */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Next.js Image Component</h3>
            <div className="border rounded-lg p-4">
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={uploadedImage}
                  alt="Next.js"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">CSS Classes Check:</h3>
        <div className="text-sm space-y-2">
          <div>
            <strong>grid-image-wrapper:</strong>
            <div className="grid-image-wrapper bg-gray-200 h-32 flex items-center justify-center">
              <span className="text-gray-600">Test Container</span>
            </div>
          </div>
          <div>
            <strong>Regular div with h-48:</strong>
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">Test Container</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold mb-2">Troubleshooting:</h3>
        <ul className="text-sm space-y-1">
          <li>• Check if images are loading correctly</li>
          <li>• Verify CSS classes are applied</li>
          <li>• Check browser console for errors</li>
          <li>• Verify image dimensions and aspect ratios</li>
          <li>• Test with different image types and sizes</li>
        </ul>
      </div>
    </div>
  );
} 