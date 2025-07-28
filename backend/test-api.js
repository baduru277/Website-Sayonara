const http = require('http');
const url = require('url');

const PORT = 3001;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  console.log(`${new Date().toISOString()} - ${req.method} ${path}`);

  // Health check
  if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: 'development'
    }));
    return;
  }

  // Registration endpoint
  if (path === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Registration attempt:', { name: data.name, email: data.email });
        
        const { name, email, password } = data;
        
        if (!name || !email || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Name, email, and password are required' }));
          return;
        }

        // Mock successful registration
        const mockUser = {
          id: Math.floor(Math.random() * 1000),
          name,
          email,
          createdAt: new Date().toISOString()
        };

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: 'User created successfully. Verification email sent.',
          user: mockUser,
          token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9)
        }));
      } catch (error) {
        console.error('Registration error:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });
    return;
  }

  // Login endpoint
  if (path === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Login attempt:', { email: data.email });
        
        const { email, password } = data;
        
        if (!email || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Email and password are required' }));
          return;
        }

        // Mock successful login
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: 'Login successful',
          token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
          user: {
            id: 1,
            name: 'Test User',
            email
          }
        }));
      } catch (error) {
        console.error('Login error:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found', path }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Test API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /health');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});