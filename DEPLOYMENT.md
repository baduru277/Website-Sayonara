# Sayonara Platform - Render Deployment Guide

This guide will help you deploy both the frontend and backend of the Sayonara platform on Render.

## Prerequisites

1. A Render account (free tier available)
2. A PostgreSQL database (you can use Render's PostgreSQL service)
3. A Cloudinary account for file uploads (free tier available)

## Step 1: Set up PostgreSQL Database on Render

1. Go to your Render dashboard
2. Click "New" → "PostgreSQL"
3. Choose a name (e.g., "sayonara-db")
4. Select your preferred region
5. Choose the free plan
6. Click "Create Database"
7. Note down the connection details (you'll need these for environment variables)

## Step 2: Deploy Backend

1. **Connect Repository:**
   - Go to your Render dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set the root directory to `backend`

2. **Configure Build Settings:**
   - **Name:** `sayonara-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

3. **Environment Variables:**
   Add these environment variables in the Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=your_postgres_host_from_step_1
   DB_PORT=5432
   DB_NAME=your_postgres_db_name
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your_secure_jwt_secret_key
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for the build to complete
   - Note the URL (e.g., `https://sayonara-backend.onrender.com`)

## Step 3: Deploy Frontend

1. **Connect Repository:**
   - Go to your Render dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set the root directory to `frontend`

2. **Configure Build Settings:**
   - **Name:** `sayonara-frontend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

3. **Environment Variables:**
   Add these environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_APP_NAME=Sayonara
   NEXT_PUBLIC_APP_DESCRIPTION=Barter & Resell Platform
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for the build to complete
   - Note the URL (e.g., `https://sayonara-frontend.onrender.com`)

## Step 4: Update CORS Settings

After both services are deployed:

1. Go to your backend service settings
2. Update the `CORS_ORIGIN` environment variable to your frontend URL
3. Redeploy the backend service

## Step 5: Database Setup

1. Connect to your PostgreSQL database
2. Run the database migrations (you'll need to create these based on your Sequelize models)
3. Seed initial data if needed

## Environment Variables Reference

### Backend Variables
- `PORT`: Port number (Render sets this automatically)
- `NODE_ENV`: Environment (production)
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port (usually 5432)
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: JWT token expiration time
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `CORS_ORIGIN`: Frontend URL for CORS

### Frontend Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_DESCRIPTION`: Application description

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check that all dependencies are in package.json
   - Ensure Node.js version is compatible (>=18.0.0)

2. **Database Connection Issues:**
   - Verify database credentials
   - Check if database is accessible from Render

3. **CORS Errors:**
   - Ensure CORS_ORIGIN is set to the correct frontend URL
   - Check that the backend is properly configured

4. **Environment Variables:**
   - Make sure all required variables are set
   - Check for typos in variable names

### Useful Commands:

```bash
# Check logs in Render dashboard
# Monitor build process
# Test API endpoints
curl https://your-backend-url.onrender.com/api/health
```

## Security Considerations

1. Use strong, unique JWT secrets
2. Keep database credentials secure
3. Use HTTPS in production
4. Regularly update dependencies
5. Monitor application logs

## Cost Optimization

- Use free tier for development/testing
- Monitor usage to avoid unexpected charges
- Consider upgrading only when necessary

## Support

If you encounter issues:
1. Check Render's documentation
2. Review application logs
3. Test locally first
4. Contact Render support if needed 