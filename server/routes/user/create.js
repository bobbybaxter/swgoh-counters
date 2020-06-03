const firebase = require('firebase');

module.exports = app => async function createUser(req, res) {
  const { log } = app;
  log.info('this is in createUser');
  log.info(req);
  const user = await app.data.user.create();
  res.send(user);
};
