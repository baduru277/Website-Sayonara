# Sayonara Platform - Hostinger Deployment Guide

This guide will help you deploy both the frontend and backend of the Sayonara platform on Hostinger with cPanel/H Panel.

## Prerequisites

1. A Hostinger hosting account with Node.js support
2. Access to cPanel/H Panel
3. A MySQL/PostgreSQL database (available in Hostinger)
4. A Cloudinary account for file uploads (free tier available)
5. Gmail account for email notifications

## Step 1: Prepare Your Files

### Backend Preparation
1. Create a `.env` file in the backend directory with production values:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@host:5432/database_name
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=https://yourdomain.com
```

### Frontend Preparation
1. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=Sayonara
NEXT_PUBLIC_APP_DESCRIPTION=Barter & Resell Platform
NEXT_PUBLIC_GOOGLE_CLIENT_ID=380078509373-814un77hbu18p9s6s8tqeit1t18lfnk1.apps.googleusercontent.com
```

2. Build the frontend:
```bash
cd frontend
npm install
npm run build
```

## Step 2: Database Setup

### Option A: PostgreSQL (Recommended)
1. In H Panel, go to "Databases" > "PostgreSQL Databases"
2. Create a new database (e.g., `sayonara_db`)
3. Create a database user with full permissions
4. Note the connection details for your `.env` file

### Option B: MySQL (Alternative)
1. In H Panel, go to "Databases" > "MySQL Databases"
2. Create a new database and user
3. Modify the database configuration in `backend/config/database.js` to use MySQL:

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL || {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
```

## Step 3: Backend Deployment

### Upload Backend Files
1. Compress your `backend` folder to a ZIP file
2. In H Panel, go to "File Manager"
3. Navigate to your domain's root directory (usually `public_html`)
4. Create a new folder called `api` or `backend`
5. Upload and extract the ZIP file in this folder

### Configure Node.js Application
1. In H Panel, go to "Advanced" > "Node.js"
2. Click "Create Application"
3. Set the following:
   - **Node.js Version**: Latest stable (18.x or higher)
   - **Application Mode**: Production
   - **Application Root**: `/api` (or `/backend`)
   - **Application URL**: `api.yourdomain.com` or `yourdomain.com/api`
   - **Application Startup File**: `bin/www`

### Install Dependencies
1. In the Node.js application interface, click "Run NPM Install"
2. Or use the terminal:
```bash
cd /path/to/your/api/directory
npm install
```

### Set Environment Variables
In the Node.js application settings, add your environment variables from the `.env` file.

## Step 4: Frontend Deployment

### Option A: Static Export (Recommended for Hostinger)
1. Modify `next.config.ts` for static export:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
```

2. Build and export:
```bash
cd frontend
npm run build
```

3. Upload the `out` folder contents to your domain's `public_html` directory

### Option B: Node.js Application (If supported)
1. Create another Node.js application for the frontend
2. Set the startup file to `server.js` or use Next.js standalone mode

## Step 5: Domain Configuration

### Subdomain Setup (Recommended)
1. Create a subdomain `api.yourdomain.com` for the backend
2. Point it to the `/api` directory
3. Use the main domain for the frontend

### Single Domain Setup
1. Configure URL rewriting in `.htaccess`:
```apache
RewriteEngine On

# API routes
RewriteRule ^api/(.*)$ /api/bin/www [L,QSA]

# Frontend routes (if using Node.js)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /frontend/server.js [L,QSA]
```

## Step 6: SSL Certificate

1. In H Panel, go to "Security" > "SSL/TLS"
2. Enable "Free SSL Certificate" for your domain and subdomains
3. Force HTTPS redirection

## Step 7: Database Migration

Create database tables by running this script in your database:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS "Users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "avatar" VARCHAR(255),
  "phone" VARCHAR(255),
  "location" VARCHAR(255),
  "bio" TEXT,
  "isVerified" BOOLEAN DEFAULT false,
  "rating" DECIMAL(3,2) DEFAULT 0.00,
  "totalReviews" INTEGER DEFAULT 0,
  "isPrime" BOOLEAN DEFAULT false,
  "lastActive" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "otpCode" VARCHAR(255),
  "otpExpires" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE IF NOT EXISTS "Items" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "category" VARCHAR(255) NOT NULL,
  "condition" VARCHAR(50) CHECK ("condition" IN ('New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair')),
  "type" VARCHAR(50) CHECK ("type" IN ('exchange', 'bidding', 'resell')),
  "priority" VARCHAR(50) DEFAULT 'medium' CHECK ("priority" IN ('high', 'medium', 'low')),
  "images" TEXT[],
  "tags" TEXT[],
  "location" VARCHAR(255) NOT NULL,
  "isActive" BOOLEAN DEFAULT true,
  "isFeatured" BOOLEAN DEFAULT false,
  "views" INTEGER DEFAULT 0,
  "lookingFor" TEXT,
  "startingBid" DECIMAL(10,2),
  "currentBid" DECIMAL(10,2),
  "buyNowPrice" DECIMAL(10,2),
  "auctionEndDate" TIMESTAMP,
  "totalBids" INTEGER DEFAULT 0,
  "price" DECIMAL(10,2),
  "originalPrice" DECIMAL(10,2),
  "discount" INTEGER,
  "stock" INTEGER DEFAULT 1,
  "shipping" VARCHAR(255),
  "isPrime" BOOLEAN DEFAULT false,
  "fastShipping" BOOLEAN DEFAULT false,
  "userId" UUID REFERENCES "Users"("id"),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bids table
CREATE TABLE IF NOT EXISTS "Bids" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "amount" DECIMAL(10,2) NOT NULL CHECK ("amount" > 0),
  "isWinning" BOOLEAN DEFAULT false,
  "isAutoBid" BOOLEAN DEFAULT false,
  "maxAmount" DECIMAL(10,2),
  "userId" UUID REFERENCES "Users"("id"),
  "itemId" UUID REFERENCES "Items"("id"),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_type ON "Items"("type");
CREATE INDEX IF NOT EXISTS idx_items_category ON "Items"("category");
CREATE INDEX IF NOT EXISTS idx_items_active ON "Items"("isActive");
CREATE INDEX IF NOT EXISTS idx_bids_item ON "Bids"("itemId");
CREATE INDEX IF NOT EXISTS idx_bids_user ON "Bids"("userId");
```

## Step 8: Testing

1. Test your API endpoints:
   - `https://api.yourdomain.com/health`
   - `https://api.yourdomain.com/api/auth/register`

2. Test your frontend:
   - `https://yourdomain.com`
   - Check console for any API connection errors

## Step 9: Production Optimizations

### Backend Optimizations
1. Enable gzip compression in your Node.js app
2. Set up proper logging
3. Configure rate limiting
4. Set up monitoring

### Frontend Optimizations
1. Enable caching headers in `.htaccess`:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## Troubleshooting

### Common Issues:

1. **Node.js Version**: Ensure Hostinger supports your Node.js version
2. **Database Connection**: Check connection strings and credentials
3. **File Permissions**: Set proper permissions (755 for directories, 644 for files)
4. **Environment Variables**: Double-check all environment variables
5. **CORS Issues**: Ensure FRONTEND_URL is correctly set in backend

### Logs and Debugging:
- Check Node.js application logs in H Panel
- Use browser developer tools for frontend issues
- Check database connection in H Panel

## Security Checklist

- [ ] SSL certificate installed and forced
- [ ] Strong JWT secret generated
- [ ] Database credentials secured
- [ ] File permissions properly set
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation in place

## Support

If you encounter issues:
1. Check Hostinger's Node.js documentation
2. Review application logs
3. Test locally first
4. Contact Hostinger support for hosting-specific issues

## Cost Optimization

- Use Hostinger's free SSL certificates
- Optimize images and assets
- Use CDN for static assets (Cloudinary)
- Monitor bandwidth usage
- Consider upgrading plan only when needed