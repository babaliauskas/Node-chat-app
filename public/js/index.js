const socket = io();

socket.on('connect', function() {
  console.log('Connected to server');

  socket.emit('createEmail', {
    to: 'asd@asd.asd',
    text: 'Hey'
  });

  socket.emit('createMessage', {
    to: 'everybody@all.com',
    text: 'Xaxa'
  });
});

socket.on('newMessage', function(message) {
  console.log('NewMessage: ', message);
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newEmail', function(email) {
  console.log('New Email: ', email);
});
