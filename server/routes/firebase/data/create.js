module.exports = ({ firebaseDb }) => async (user) => {
  firebaseDb.ref(`users/${user.id}`).set({
    email: user.email,
    allyCode: '',
    patreonId: '',
    patronStatus: '',
    username: '',
  });
  return user;
};
