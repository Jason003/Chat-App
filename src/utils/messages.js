const moment = require('moment');
const message = text => {
  return {
    text: text,
    createdAt: moment(new Date().getTime()).format('h:mm a')
  };
};

module.exports = {
  message
};
