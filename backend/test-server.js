const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Mock auth endpoints
app.post('/api/auth/register', (req, res) => {
  console.log('Registration request:', req.body);
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  
  // Mock successful registration
  res.json({
    message: 'User registered successfully',
    user: {
      id: 1,
      name,
      email,
      createdAt: new Date().toISOString()
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Mock successful login
  res.json({
    message: 'Login successful',
    token: 'mock-jwt-token',
    user: {
      id: 1,
      name: 'Mock User',
      email
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    id: 1,
    name: 'Mock User',
    email: 'user@example.com'
  });
});

// Catch all other routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /health');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
  console.log('- GET /api/auth/me');
});