module.exports = async function addPatronInfoToFirebase(user, firebaseDb) {
  firebaseDb.ref(`users/${user.id}`).update({
    patreonId: user.patreonId,
    patronStatus: user.patronStatus,
  });

  return 'ok';
};
