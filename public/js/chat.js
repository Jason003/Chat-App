const socket = io();
const $messageForm = $('#message-form');
const $messageTextarea = $('#messageTextarea');
const $sendLocationButton = $('#sendLocationButton');
const $submitButton = $('#submitButton');
const $messages = $('#messages');
const $sidebar = $('#sidebar');

// Templates
const messageTemplate = $('#message-template').html();
const locationTemplate = $('#location-template').html();
const sidebarTemplate = $('#sidebar-template').html();

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const autoscroll = () => {
  // // New message element
  // const $newMessage = $messages[0].lastElementChild;

  // console.log($newMessage);
  // // Height of the new message
  // const newMessageStyles = getComputedStyle($newMessage);
  // const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  // const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // // Visible height
  // const visibleHeight = $messages[0].offsetHeight;

  // // Height of messages container
  // const containerHeight = $messages[0].scrollHeight;

  // // How far have I scrolled?
  // const scrollOffset = $messages[0].scrollTop + visibleHeight;

  // console.log(scrollOffset);
  // console.log($messages[0]);

  // if (containerHeight - newMessageHeight <= scrollOffset) {
  $messages[0].scrollTop = $messages[0].scrollHeight;
  // }
};

const showMessage = (template, message) => {
  const { text, createdAt, username } = message;
  const html = Mustache.render(template, {
    message: text,
    createdAt,
    username
  });
  $messages.append(html);
  autoscroll();
};

socket.emit('join', { username, room }, error => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});

socket.on('welcome', message => {
  showMessage(messageTemplate, message);
});

socket.on('message', message => {
  showMessage(messageTemplate, message);
});

socket.on('location', location => {
  showMessage(locationTemplate, location);
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  $sidebar.html(html);
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
      return alert(error);
    }
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
