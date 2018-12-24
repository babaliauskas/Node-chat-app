const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { generateMessage, generateLocationMessage } = require('./utils/message');

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user connected');

  // Socket.emit - emits only to new user
  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcome to the chata app')
  );

  // everybody gets message except new user
  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New user joined')
  );

  // Socket.emit - emits to single connection
  socket.on('createMessage', (message, callback) => {
    console.log('CreateMessage: ', message);
    // io.emit - everybody gets message
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', coords => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', coords.latitude, coords.longitude)
    );
  });

  socket.on('createEmail', newEmail => {
    console.log('CreateEmail: ', newEmail);
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
