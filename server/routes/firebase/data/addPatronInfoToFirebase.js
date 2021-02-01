module.exports = ({ firebaseDb }) => (user) => {
  firebaseDb.ref(`users/${user.id}`).update({
    patreonId: user.patreonId,
    patronStatus: user.patronStatus,
  });

  return 'ok';
};
