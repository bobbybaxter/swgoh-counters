const firebase = require('firebase');

module.exports = async function getByFirebaseUid(id) {
  const user = await firebase
    .database()
    .ref('users')
    .orderByChild('id')
    .equalTo(id)
    .once('value')
    .then(snapshot => (snapshot.val()) || '');
  return user;
};
