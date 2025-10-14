# Sayonara - Barter & Resell Platform

A modern, Amazon-like marketplace platform for item exchange, bidding, and direct purchase. Built with Next.js frontend and Node.js backend with PostgreSQL database.

## 🌟 Features

### **Priority-Based Sections**
- **High Priority**: Exchange items directly with other users
- **Medium Priority**: Bid on live auctions for exclusive items  
- **Low Priority**: Purchase items directly from verified sellers

### **Amazon-Like Experience**
- Advanced filtering and search functionality
- User ratings and verification system
- Real-time bidding with countdown timers
- Responsive design with modern UI/UX
- Image upload and management
- Secure authentication and authorization

### **Technical Features**
- Full-stack TypeScript/JavaScript application
- RESTful API with comprehensive endpoints
- PostgreSQL database with Sequelize ORM
- JWT authentication
- Cloud deployment ready
- Real-time updates (WebSocket ready)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Website-Sayonara
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.local .env
   # Edit .env with your database credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Database Setup**
   - Create a PostgreSQL database
   - Update the `.env` file with your database credentials
   - The database tables will be created automatically on first run

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sayonara_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## ☁️ Cloud Deployment (Render)

### 1. Database Setup
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create a new **PostgreSQL** database
3. Note down the connection string

### 2. Backend Deployment
1. Connect your GitHub repository to Render
2. Create a new **Web Service**
3. Configure the service:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=10000
     JWT_SECRET=your-secure-jwt-secret
     FRONTEND_URL=https://your-frontend-url.onrender.com
     DATABASE_URL=your-postgres-connection-string
     ```

### 3. Frontend Deployment
1. Create a new **Static Site** service
2. Configure the service:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/.next`
   - **Environment Variables**:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
     ```

### 4. Using render.yaml (Alternative)
If you have the `render.yaml` file in your repository:
1. Push your code to GitHub
2. In Render Dashboard, select "New Blueprint Instance"
3. Connect your repository
4. Render will automatically create all services

## 📁 Project Structure

```
Website-Sayonara/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   └── services/        # API services
│   └── package.json
├── backend/                  # Node.js backend
│   ├── config/              # Database configuration
│   ├── models/              # Sequelize models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   └── package.json
├── render.yaml              # Render deployment config
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Items
- `GET /api/items` - Get all items with filtering
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `POST /api/items/:id/bid` - Place bid
- `GET /api/items/featured/items` - Get featured items
- `GET /api/items/categories/list` - Get categories

## 🛠️ Development

### Available Scripts

#### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
npm test         # Run tests
```

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Database Migrations
```bash
cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- Rate limiting (can be added)
- SQL injection protection via Sequelize

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Performance Optimizations

- Image optimization with Next.js Image component
- Lazy loading for components
- Database indexing
- API response caching
- Bundle size optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the API endpoints

## 🔄 Updates and Maintenance

- Regular security updates
- Performance optimizations
- New feature additions
- Bug fixes and improvements

---

**Built with ❤️ using Next.js, Node.js, and PostgreSQL** 