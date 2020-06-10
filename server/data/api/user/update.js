module.exports = async function updateUser({ id, allyCode }, firebaseDb) {
  firebaseDb.ref(`users/${id}`).update({
    allyCode,
  });
  return 'ok';
};
