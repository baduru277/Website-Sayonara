const io = require('socket.io-client');

const socket = io('http://localhost:3001'); // Replace with your backend URL


socket.emit('testEvent',()=>
   { 
  console.log('Hello Server!')
    });

socket.on('connect', () => {
  console.log('Connected to Socket.IO server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

