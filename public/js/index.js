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

  const messageTextBox = jQuery('[name=message]');

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: messageTextBox.val()
    },
    function() {
      messageTextBox.val('');
    }
  );
});

// send geolocation button
const locationButton = jQuery('#send-location');

locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      locationButton.removeAttr('disabled').text('Send location');
      alert('Unable to fetch location');
    }
  );
});
