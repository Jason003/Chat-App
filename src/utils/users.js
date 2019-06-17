users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room) {
    return { error: 'Username and room is required!' };
  }
  const idx = users.findIndex(
    user => user.username === username && user.room === room
  );
  if (idx !== -1 || username === 'admin') {
    return { error: 'User exists in this room!' };
  }
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = id => {
  const idx = users.findIndex(user => user.id === id);
  if (idx !== -1) {
    return users.splice(idx, 1)[0];
  }
};

const getUser = id => {
  return users.find(user => user.id === id);
};

const getUserInRoom = room => {
  return users.filter(user => user.room === room.trim().toLowerCase());
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserInRoom
};
