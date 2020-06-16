module.exports = async function updateUser({
  id, allyCode, email, patreonId, patronStatus,
}, firebaseDb) {
  firebaseDb.ref(`users/${id}`).update({
    allyCode,
    email,
    patreonId,
    patronStatus,
  });

  return 'ok';
};
