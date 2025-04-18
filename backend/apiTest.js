const axios = require('axios');
const io = require('socket.io-client');

// Server URL and API endpoint
const SERVER_URL = 'http://localhost:5000';
const API_ENDPOINT = `${SERVER_URL}/testTransaction`;

// Connect to the server via Socket.IO
const socket = io(SERVER_URL);

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

// Listen for transaction updates
socket.on('transactionUpdate', (data) => {
  console.log('Real-time Update Received:', data);
});

// Simulate API request
async function testApi() {
  try {
    const transactionData = {
      transactionId: '67949f615882db4e4182886d',
      status: 'pending',
    };

    console.log('Sending API request with:', transactionData);

    const response = await axios.post(API_ENDPOINT, transactionData);
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('Error during API request:', error.message);
  }
}

// Trigger API testing
testApi();

// Handle socket disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
