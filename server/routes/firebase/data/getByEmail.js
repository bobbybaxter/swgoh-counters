module.exports = ({ firebaseDb }) => async (email) => {
  const userObj = await firebaseDb
    .ref('users')
    .orderByChild('email')
    .equalTo(email)
    .once('value')
    .then(snapshot => (snapshot.val()) || '');

  const user = Object.values(userObj)[0];
  const userId = Object.keys(userObj)[0];
  user.id = userId;

  return user;
};
