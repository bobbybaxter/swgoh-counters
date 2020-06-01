module.exports = app => async function createUser(req, res) {
  const { log } = app;
  log.info('this is in createUser');
  const user = await app.data.user.create();
  res.send(user);
};
