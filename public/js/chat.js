const socket = io();
const $messageForm = $('#message-form');
const $messageTextarea = $('#messageTextarea');
const $sendLocationButton = $('#sendLocationButton');
const $submitButton = $('#submitButton');
const $messages = $('#messages');

// Templates
const messageTemplate = $('#message-template').html();
const locationTemplate = $('#location-template').html();
console.log(messageTemplate);

socket.on('welcome', message => {
  console.log(message);
});

socket.on('message', message => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: message.createdAt
  });
  $messages.append(html);
});

socket.on('location', location => {
  const html = Mustache.render(locationTemplate, { location });
  $messages.append(html);
});

$messageForm.submit(e => {
  e.preventDefault();
  $submitButton.attr('disabled', 'disabled');
  let message = e.target.elements.message.value;
  message = $.trim(message);
  if (message === '') {
    alert('Please enter something!');
    $submitButton.removeAttr('disabled');
    $messageTextarea.focus();
    return;
  }
  $messageTextarea.val('');
  socket.emit('message', message, error => {
    $submitButton.removeAttr('disabled');
    $messageTextarea.focus();
    if (error) {
      return console.log(error);
    }
    console.log('Delivered Successfully!');
  });
});

$sendLocationButton.click(e => {
  e.preventDefault();
  $sendLocationButton.attr('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition(location => {
    const { longitude, latitude } = location.coords;
    socket.emit('location', { longitude, latitude }, () => {
      $sendLocationButton.removeAttr('disabled');
    });
  });
});
