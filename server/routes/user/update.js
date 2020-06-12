module.exports = app => async function updateUser(req, res) {
  const payload = {
    id: req.params.id,
    allyCode: req.body.allyCode,
  };
  const user = await app.data.user.update(payload, app.firebaseDb);
  res.send(user);
};
