const _ = require('lodash');

module.exports = ({ firebaseDb }) => async (id) => {
  const user = await firebaseDb
    .ref(`users/${id}`)
    .once('value')
    .then(snapshot => (snapshot.val()) || {});
  if (!_.isEmpty(user)) {
    user.id = id;
  }
  return user;
};
