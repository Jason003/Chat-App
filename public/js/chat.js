const socket = io();

socket.on('welcome', message => {
  console.log(message);
});

socket.on('message', message => {
  console.log(message);
});

socket.on('location', ({ longitude, latitude }) => {
  console.log(longitude);
  console.log(latitude);
});

$('#message-form').submit(e => {
  e.preventDefault();
  let message = e.target.elements.message.value;
  message = $.trim(message);
  if (message === '') {
    alert('Please enter something!');
    return;
  }
  $('#messageTextarea').val('');
  socket.emit('message', message, error => {
    if (error) {
      return console.log(error);
    }
    console.log('Delivered Successfully!');
  });
});

$('#sendLocationButton').click(e => {
  e.preventDefault();
  navigator.geolocation.getCurrentPosition(location => {
    const { longitude, latitude } = location.coords;
    socket.emit('location', { longitude, latitude });
  });
});
