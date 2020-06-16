/* eslint-disable no-param-reassign */
module.exports = app => async function getUserByFirebaseUid(req, res) {
  try {
    const user = await app.data.user.getByFirebaseUid(req.params.id, app.firebaseDb);
    res.send(user);
  } catch (e) {
    console.log('getUserByFirebaseUid Error :>> ', e);
  }
};
