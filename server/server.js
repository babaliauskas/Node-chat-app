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
const { isRealString } = require('./utils/validations');
const { Users } = require('./utils/users');

const users = new Users();

app.use(express.static(publicPath));

// io.emit - everybody gets message
// io.to(roomName).emit - everybody gets message in the room
// socket.emit - only new user gets message
// socket.emit -
// socket.broadcast.emit - everybody gets message except new user
// socket.broadcast.to(roomName).emit - everybody gets message in the room except new user

io.on('connection', socket => {
  console.log('New user connected');

  // Join the room
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room are required!');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // Sends message to the user who joined the room
    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to the chata app')
    );
    // sends message when somebody joins the room
    socket.broadcast
      .to(params.room)
      .emit(
        'newMessage',
        generateMessage('Admin', `${params.name} has joined`)
      );
    callback();
  });

  // sends message to everybody
  socket.on('createMessage', (message, callback) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  // sends your geolocation to everybody
  socket.on('createLocationMessage', coords => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', coords.latitude, coords.longitude)
    );
  });

  socket.on('createEmail', newEmail => {
    console.log('CreateEmail: ', newEmail);
  });

  // Remove user from the list when they leave a room
  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit(
        'newMessage',
        generateMessage('Admin', `${user.name} has left`)
      );
    }
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
