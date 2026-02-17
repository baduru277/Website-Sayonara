const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// -------------------- Auth Middleware --------------------
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// -------------------- Multer Configuration --------------------
// Create uploads directories if they don't exist
const productUploadDir = path.join(__dirname, '../uploads/products');
const avatarUploadDir = path.join(__dirname, '../uploads/avatars');

[productUploadDir, avatarUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Choose directory based on upload type
    const dir = req.path.includes('avatar') ? avatarUploadDir : productUploadDir;
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const nameWithoutExt = path.basename(file.originalname, ext);
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    cb(null, `${safeName}_${uniqueSuffix}${ext}`);
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Multer instances
const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10 // Max 10 files
  }
});

// -------------------- Upload Single Image --------------------
// POST /api/upload/single
// Used for: profile avatar, single product image
router.post('/single', authenticate, uploadSingle.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folder = req.path.includes('avatar') ? 'avatars' : 'products';
    const imageUrl = `/uploads/${folder}/${req.file.filename}`;

    console.log(`✅ Image uploaded: ${req.file.filename} by user ${req.userId}`);

    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload single image error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
});

// -------------------- Upload Multiple Images --------------------
// POST /api/upload/multiple
// Used for: product listings (up to 10 images)
router.post('/multiple', authenticate, uploadMultiple.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedImages = req.files.map(file => ({
      imageUrl: `/uploads/products/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype
    }));

    console.log(`✅ ${req.files.length} images uploaded by user ${req.userId}`);

    res.status(201).json({
      message: `${req.files.length} image(s) uploaded successfully`,
      images: uploadedImages,
      // Also return array of just URLs for convenience
      imageUrls: uploadedImages.map(img => img.imageUrl)
    });
  } catch (error) {
    console.error('Upload multiple images error:', error);
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({ error: error.message || 'Failed to upload images' });
  }
});

// -------------------- Upload Avatar --------------------
// POST /api/upload/avatar
// Used for: user profile picture
router.post('/avatar', authenticate, uploadSingle.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/avatars/${req.file.filename}`;

    console.log(`✅ Avatar uploaded for user ${req.userId}`);

    res.status(201).json({
      message: 'Avatar uploaded successfully',
      imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message || 'Failed to upload avatar' });
  }
});

// -------------------- Delete Image --------------------
// DELETE /api/upload/delete/:folder/:filename
router.delete('/delete/:folder/:filename', authenticate, async (req, res) => {
  try {
    const { folder, filename } = req.params;

    // Security: only allow valid folders
    const allowedFolders = ['products', 'avatars'];
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({ error: 'Invalid folder' });
    }

    // Security: prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(__dirname, '../uploads', folder, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    console.log(`🗑️ Image deleted: ${folder}/${filename} by user ${req.userId}`);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete image' });
  }
});

// -------------------- List Images (Admin) --------------------
// GET /api/upload/list/:folder
router.get('/list/:folder', authenticate, async (req, res) => {
  try {
    const { folder } = req.params;
    const allowedFolders = ['products', 'avatars'];

    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({ error: 'Invalid folder' });
    }

    const dir = path.join(__dirname, '../uploads', folder);

    if (!fs.existsSync(dir)) {
      return res.json({ images: [], total: 0 });
    }

    const files = fs.readdirSync(dir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(filename => {
        const filePath = path.join(dir, filename);
        const stats = fs.statSync(filePath);
        return {
          filename,
          imageUrl: `/uploads/${folder}/${filename}`,
          size: stats.size,
          uploadedAt: stats.birthtime
        };
      });

    res.json({ images, total: images.length });
  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
