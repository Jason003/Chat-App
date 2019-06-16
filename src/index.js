const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const { message } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const filter = new Filter();

const port = process.env.PORT || 3001;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', socket => {
  console.log('New WebSocket Connection...');
  socket.emit('welcome', 'Welcome!');
  socket.broadcast.emit('welcome', 'A new user entered');
  socket.on('message', (text, callback) => {
    if (filter.isProfane(text)) {
      return callback('Profane if not allowed!');
    }
    io.emit('message', message(text));
    callback();
  });
  socket.on('disconnect', () => {
    io.emit('welcome', 'A user left');
  });
  socket.on('location', ({ longitude, latitude }, callback) => {
    io.emit('location', `https://google.com/maps?q=${latitude},${longitude}`);
    callback();
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
