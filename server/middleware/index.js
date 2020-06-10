const context = require('./context');
const auth = require('./auth');

module.exports = () => ({
  auth,
  context,
});
