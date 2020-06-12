module.exports = app => async function createUser(req, res) {
  const user = await app.data.user.create(req.body, app.firebaseDb);
  res.send(user);
};
