module.exports = app => async function updateUser(req, res) {
  const { id } = req.params;
  const {
    allyCode, email, patreonId, patronStatus, username,
  } = req.body;

  const payload = {
    id,
    allyCode,
    email,
    patreonId,
    patronStatus,
    username,
  };

  const user = await app.data.user.update(payload, app.firebaseDb);
  res.send(user);
};
