const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require("path")
// Middlewares
const errorMiddleware = require("./middlewares/error");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./admin/adminRoutes");
const productRoutes = require("./routes/product/productRoutes");
const flaggedRoutes = require("./routes/product/flaggedContentRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const broadcastRoutes = require("./admin/broadcastMessage/broadcastMessageRoutes");

// Initialize Express App
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for Socket.io connection

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust for production frontend URL
    methods: ["GET", "POST"]
  }
});

// Allow requests from frontend (React app)
app.use(
  cors({
    origin: "http://localhost:3001", 
    credentials: true, 
  })
);


app.set('socketio', io);


io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);


  socket.on('sendMessage', (data) => {
    console.log('Received message:', data);
    socket.emit('newMessage', { message: 'Message received!' });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", flaggedRoutes);
app.use("/api/v1", transactionRoutes);
app.use("/api/v1", notificationRoutes);
app.use("/api/v1", messageRoutes);
app.use("/api/v1", broadcastRoutes);


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  keyGenerator: (req) => req.ip, 
});
app.use(limiter);

app.options('*', cors());
app.use(cors());



app.use(express.static(path.join(__dirname, '../frontend/src/')));
// app.use(express.static(path.join(__dirname, '../frontent/src/components/User')));


app.get('/frontend', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/RegisterPage.js'));
});

app.get('/frontend', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages'));
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html',));
});
app.set('trust proxy', true);
// Secure the trust proxy setting
app.set('trust proxy', '123.45.67.89'); // Only trust the proxy with this IP

// Set up rate limiting middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
//   keyGenerator: (req) => req.ip, // Use req.ip after trust proxy setting
// });

const corsOptions = {
  origin: 'http://localhost:3001', 
  methods: 'GET,POST', 
  allowedHeaders: 'Content-Type', 
};

app.use(cors(corsOptions));


// Error middleware
app.use(errorMiddleware);


module.exports = app;
