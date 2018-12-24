const socket = io();

socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('newMessage', function(message) {
  console.log('NewMessage: ', message);
  const li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

// display geolocation as a link
socket.on('newLocationMessage', function(message) {
  const li = jQuery('<li></li>');
  const a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newEmail', function(email) {
  console.log('New Email: ', email);
});

// Send message button
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: jQuery('[name=message]').val()
    },
    function() {}
  );
});

// send geolocation button
const locationButton = jQuery('#send-location');

locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      alert('Unable to fetch location');
    }
  );
});
