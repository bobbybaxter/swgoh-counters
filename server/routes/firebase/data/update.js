module.exports = ({ firebaseDb }) => async ({
  id,
  allyCode,
  email,
  patreonId,
  patronStatus,
  username,
}) => {
  firebaseDb.ref(`users/${id}`).update({
    allyCode,
    email,
    patreonId,
    patronStatus,
    username,
  });

  return 'ok';
};
