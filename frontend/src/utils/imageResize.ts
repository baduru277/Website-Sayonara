/**
 * Utility functions for image resizing to fit grid layouts
 */

export interface ImageResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  maintainAspectRatio?: boolean;
}

export const DEFAULT_GRID_IMAGE_SIZE = {
  width: 400,
  height: 300
};

/**
 * Resize an image to fit grid layout
 * @param file - The image file to resize
 * @param options - Resize options
 * @returns Promise<string> - Base64 encoded resized image
 */
export const resizeImageForGrid = (
  file: File,
  options: ImageResizeOptions = {}
): Promise<string> => {
  const {
    maxWidth = DEFAULT_GRID_IMAGE_SIZE.width,
    maxHeight = DEFAULT_GRID_IMAGE_SIZE.height,
    quality = 0.8,
    format = 'jpeg',
    maintainAspectRatio = true
  } = options;

  console.log('Resizing image:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    maxWidth,
    maxHeight,
    quality,
    format,
    maintainAspectRatio
  });

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const img = new Image();
      
      img.onload = () => {
        console.log('Original image dimensions:', {
          width: img.width,
          height: img.height
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('Canvas context not available');
          reject(new Error('Canvas context not available'));
          return;
        }

        let { width, height } = img;
        
        if (maintainAspectRatio) {
          // Calculate scaling to fit within max dimensions while maintaining aspect ratio
          const scaleX = maxWidth / width;
          const scaleY = maxHeight / height;
          const scale = Math.min(scaleX, scaleY);
          
          width = width * scale;
          height = height * scale;
        } else {
          // Force exact dimensions (may distort image)
          width = maxWidth;
          height = maxHeight;
        }

        console.log('Resized dimensions:', { width, height });

        canvas.width = width;
        canvas.height = height;

        // Draw the resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        const mimeType = `image/${format}`;
        const resizedBase64 = canvas.toDataURL(mimeType, quality);
        
        console.log('Resize completed:', {
          originalSize: file.size,
          resizedBase64Length: resizedBase64.length,
          compressionRatio: (resizedBase64.length / file.size * 100).toFixed(2) + '%'
        });
        
        resolve(resizedBase64);
      };

      img.onerror = () => {
        console.error('Failed to load image');
        reject(new Error('Failed to load image'));
      };

      img.src = reader.result as string;
    };

    reader.onerror = () => {
      console.error('Failed to read file');
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Resize multiple images for grid layout
 * @param files - Array of image files
 * @param options - Resize options
 * @returns Promise<string[]> - Array of base64 encoded resized images
 */
export const resizeImagesForGrid = (
  files: File[],
  options: ImageResizeOptions = {}
): Promise<string[]> => {
  console.log('Resizing multiple images:', files.length, 'files');
  const resizePromises = files.map(file => resizeImageForGrid(file, options));
  return Promise.all(resizePromises);
};

/**
 * Create a thumbnail version of an image
 * @param file - The image file to create thumbnail for
 * @param size - Thumbnail size (default: 80x80)
 * @returns Promise<string> - Base64 encoded thumbnail
 */
export const createThumbnail = (
  file: File,
  size: number = 80
): Promise<string> => {
  return resizeImageForGrid(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7,
    maintainAspectRatio: true
  });
};

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSize - Maximum file size in MB (default: 5MB)
 * @returns boolean - Whether file is valid
 */
export const validateImageFile = (file: File, maxSize: number = 5): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSizeBytes = maxSize * 1024 * 1024; // Convert MB to bytes

  console.log('Validating image file:', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    maxSizeBytes,
    isValidType: validTypes.includes(file.type),
    isValidSize: file.size <= maxSizeBytes
  });

  if (!validTypes.includes(file.type)) {
    return false;
  }

  if (file.size > maxSizeBytes) {
    return false;
  }

  return true;
}; 