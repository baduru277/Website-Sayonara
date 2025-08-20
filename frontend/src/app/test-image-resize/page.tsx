'use client';

import { useState } from 'react';
import { resizeImageForGrid, validateImageFile } from '@/utils/imageResize';

export default function TestImageResize() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    try {
      if (!validateImageFile(file)) {
        throw new Error('Please upload a valid image file (JPEG, PNG, WebP, GIF) under 5MB.');
      }

      // Show original image
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Resize image for grid
      const resized = await resizeImageForGrid(file, {
        maxWidth: 400,
        maxHeight: 300,
        quality: 0.8,
        maintainAspectRatio: true
      });

      setResizedImage(resized);
    } catch (error) {
      console.error('Error resizing image:', error);
      setError(error instanceof Error ? error.message : 'Error resizing image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Image Resize Test</h1>

      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          <p className="mt-2">Processing image...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {originalImage && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Original Image</h2>
            <div className="border rounded-lg p-4">
              <img
                src={originalImage}
                alt="Original"
                className="max-w-full h-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        )}

        {resizedImage && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Resized for Grid (400x300)</h2>
            <div className="border rounded-lg p-4">
              <div className="grid-image-wrapper mb-4">
                <img
                  src={resizedImage}
                  alt="Resized"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600">
                This image has been resized to fit the grid layout while maintaining aspect ratio.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Upload any image file (JPEG, PNG, WebP, GIF)</li>
          <li>• Images are automatically resized to 400x300 pixels</li>
          <li>• Aspect ratio is maintained to prevent distortion</li>
          <li>• Images are optimized for consistent grid display</li>
          <li>• File size is reduced for better performance</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <h3 className="font-semibold mb-2">Testing Instructions:</h3>
        <ol className="text-sm text-gray-700 space-y-1">
          <li>1. Upload an image using the file input above</li>
          <li>2. Check that the original image displays correctly</li>
          <li>3. Verify that the resized image appears in the grid container</li>
          <li>4. Confirm that the aspect ratio is maintained</li>
          <li>5. Check the browser console for any errors</li>
        </ol>
      </div>
    </div>
  );
} 