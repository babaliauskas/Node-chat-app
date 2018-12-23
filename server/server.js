const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user connected');

  socket.emit('newEmail', {
    from: 'Mike@example.com',
    text: 'Hey. What is going on',
    createdAt: 123
  });

  socket.emit('newMessage', {
    from: 'Lukas@lukas.com',
    text: 'hello',
    createdAt: new Date(Date.now())
  });

  socket.on('createMessage', message => {
    console.log('CreateMessage: ', message);
  });

  socket.on('createEmail', newEmail => {
    console.log('CreateEmail: ', newEmail);
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
