module.exports = app => async function updateUser(req, res) {
  const user = await app.data.user.update();
  res.send(user);
};
