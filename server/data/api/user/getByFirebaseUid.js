const firebase = require('firebase');

module.exports = async function getByFirebaseUid(id) {
  const user = await firebase
    .database()
    .ref(`/users/${id}`)
    .once('value')
    .then(snapshot => (snapshot.val()) || 'no user');
  user.firebaseUid = id || '';
  return user;
};
