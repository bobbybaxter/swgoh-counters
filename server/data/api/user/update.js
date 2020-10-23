module.exports = async function updateUser({
  id, allyCode, email, patreonId, patronStatus, username,
}, firebaseDb) {
  firebaseDb.ref(`users/${id}`).update({
    allyCode,
    email,
    patreonId,
    patronStatus,
    username,
  });

  return 'ok';
};
