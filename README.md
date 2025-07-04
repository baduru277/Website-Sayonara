# Sayonara - Barter & Resell Platform

A modern platform for bartering and reselling items, built with Next.js frontend and Node.js/Express backend.

## 🚀 Quick Deploy to Render

### Option 1: Using render.yaml (Recommended)

1. **Fork this repository** to your GitHub account
2. **Connect to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file
   - Click "Apply" to deploy all services

### Option 2: Manual Deployment

Follow the detailed instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🏗️ Project Structure

```
barter_resell_platform/
├── frontend/                 # Next.js 15 + TypeScript frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable components
│   │   └── lib/             # Utilities and helpers
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Node.js/Express backend
│   ├── routes/              # API routes
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   └── package.json
├── render.yaml              # Render infrastructure config
├── DEPLOYMENT.md            # Detailed deployment guide
└── README.md               # This file
```

## 🎯 Features

### Frontend Features
- **Modern UI/UX** with Tailwind CSS
- **Responsive Design** for all devices
- **User Authentication** (Login/Register)
- **Item Management** (Browse, Add, Edit, Delete)
- **Trading System** (Barter, Bidding, Exchange)
- **Real-time Messaging**
- **User Profiles** with ratings
- **Admin Dashboard** with analytics
- **Search & Filtering**
- **Image Upload** with Cloudinary

### Backend Features
- **RESTful API** with Express.js
- **JWT Authentication**
- **PostgreSQL Database** with Sequelize ORM
- **File Upload** with Multer & Cloudinary
- **Real-time Features** with Socket.io
- **CORS Configuration**
- **Environment-based Configuration**

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 19** - UI library
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Socket.io** - Real-time features
- **Multer** - File uploads
- **Cloudinary** - Image storage

## 🚀 Local Development

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL
- Cloudinary account

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sayonara_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Sayonara
NEXT_PUBLIC_APP_DESCRIPTION=Barter & Resell Platform
```

## 📱 Pages & Features

### Public Pages
- **Homepage** - Landing page with featured items
- **Browse Items** - Search and filter items
- **Item Details** - View item information and contact seller
- **Categories** - Browse by category
- **How It Works** - Platform explanation
- **Login/Register** - User authentication

### User Pages
- **Dashboard** - User profile and subscription management
- **Add Item** - List new items for barter/sale
- **My Items** - Manage listed items
- **Messages** - Real-time messaging
- **Trades** - Manage trade offers and history
- **Resell** - Auction-style bidding
- **Exchange** - Item-for-item barter

### Admin Pages
- **Admin Dashboard** - Analytics and user management
- **User Management** - View and manage users
- **Content Moderation** - Review reported items
- **Reports** - Platform statistics
- **Settings** - Platform configuration

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item by ID
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Trades
- `GET /api/trades` - Get user trades
- `POST /api/trades` - Create trade offer
- `PUT /api/trades/:id` - Update trade status

### Messages
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send message

## 🚀 Deployment

### Render (Recommended)
- Free tier available
- Automatic deployments from GitHub
- PostgreSQL database included
- SSL certificates included

### Other Platforms
- **Vercel** - Frontend deployment
- **Railway** - Full-stack deployment
- **Heroku** - Full-stack deployment
- **DigitalOcean** - VPS deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting
2. Review the application logs
3. Test locally first
4. Create an issue on GitHub

## 🔗 Links

- **Frontend:** https://sayonara-frontend.onrender.com
- **Backend API:** https://sayonara-backend.onrender.com
- **Health Check:** https://sayonara-backend.onrender.com/health 