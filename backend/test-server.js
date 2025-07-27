const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: 'test'
  });
});

// Mock signup endpoint
app.post('/api/auth/register', (req, res) => {
  console.log('Registration request received:', req.body);
  
  // Basic validation
  const { name, email, password, firstName, lastName } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: 'Name, email, and password are required' 
    });
  }
  
  // Simulate successful registration
  const mockUser = {
    id: 1,
    name,
    email,
    firstName,
    lastName
  };
  
  const mockToken = 'mock-jwt-token-for-testing';
  
  res.status(201).json({
    message: 'User created successfully. (This is a test response)',
    user: mockUser,
    token: mockToken
  });
});

// Mock login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }
  
  // Simulate successful login
  const mockUser = {
    id: 1,
    name: 'Test User',
    email
  };
  
  const mockToken = 'mock-jwt-token-for-testing';
  
  res.json({
    message: 'Login successful (test response)',
    user: mockUser,
    token: mockToken
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('This is a minimal test server for debugging signup issues');
});