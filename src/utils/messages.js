const moment = require('moment');
const message = (username, text) => {
  return {
    username,
    text,
    createdAt: moment(new Date().getTime()).format('h:mm a')
  };
};

module.exports = {
  message
};
