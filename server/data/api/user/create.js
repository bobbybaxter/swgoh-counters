module.exports = async function createUser(user, firebaseDb) {
  firebaseDb.ref(`users/${user.id}`).set({
    email: user.email,
    allyCode: '',
    isPatron: false,
  });
  return user;
};
