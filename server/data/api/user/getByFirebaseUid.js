module.exports = async function getByFirebaseUid(id, firebaseDb) {
  const user = await firebaseDb
    .ref(`users/${id}`)
    .once('value')
    .then(snapshot => (snapshot.val()) || '');
  user.id = id;
  return user;
};
