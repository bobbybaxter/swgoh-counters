module.exports = app => async function getUserByFirebaseUid(req, res) {
  const { log } = app;
  log.info('this is in getUserByFirebaseUid');
  const user = await app.data.user.getByFirebaseUid(req.params.id);
  res.send(user);
};
