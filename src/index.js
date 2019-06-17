const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const { message } = require('./utils/messages');
const {
  addUser,
  removeUser,
  getUser,
  getUserInRoom
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const filter = new Filter();

const port = process.env.PORT || 3001;
const publicDirectoryPath = path.join(__dirname, '../public');

const System = 'Admin';

app.use(express.static(publicDirectoryPath));

io.on('connection', socket => {
  console.log('New WebSocket Connection...');

  socket.on('join', (options, callback) => {
    const { user, error } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit('welcome', message(System, 'Welcome!'));
    socket.broadcast
      .to(user.room)
      .emit('welcome', message(System, `${user.username} has joined`));
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUserInRoom(user.room)
    });

    callback();
  });

  socket.on('message', (text, callback) => {
    if (filter.isProfane(text)) {
      return callback('Profane if not allowed!');
    }
    const user = getUser(socket.id);
    io.to(user.room).emit('message', message(user.username, text));
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        message(System, `${user.username} has left`)
      );
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUserInRoom(user.room)
      });
    }
  });

  socket.on('location', ({ longitude, latitude }, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      'location',
      message(
        user.username,
        `https://google.com/maps?q=${latitude},${longitude}`
      )
    );
    callback();
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
