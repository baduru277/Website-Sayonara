const app = require("./app");
const http = require("http");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cors = require("cors");
const socketIo = require("socket.io"); 
const { _transaction } = require("./utils/messages");

dotenv.config({ path: "./config/config.env" });

connectDatabase();

app.use(cors());


const server = http.createServer(app);


const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",  
    methods: ["GET", "POST"],
  },
});


io.on('connection', (socket) => {
  console.log('A user connected');
  
 
  socket.on('sendMessage', (message) => {
    console.log('Received message:', message);

    io.emit('transactionCreated', {
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error("Shutting down the server due to Uncaught Exception");

  server.close(() => {
    process.exit(1); 
  });
});


process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  console.error("Shutting down the server due to Unhandled Promise Rejection");


  server.close(() => {
    process.exit(1); 
  });
});
