module.exports = app => async function getUserByFirebaseUid(req, res) {
  try {
    const user = await app.data.user.getByFirebaseUid(req.params.id, app.firebaseDb);
    res.send(user);
  } catch (e) {
    console.error('getUserByFirebaseUid Error :>> ', e);
  }
};
