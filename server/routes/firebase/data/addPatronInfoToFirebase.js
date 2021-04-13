module.exports = ({ firebaseDb }) => (user) => {
  firebaseDb.ref(`users/${user.id}`).update({
    accessToken: user.accessToken,
    expiresIn: user.expiresIn,
    patreonId: user.patreonId,
    patronStatus: user.patronStatus,
    refreshToken: user.refreshToken,
    tier: user.tier,
  });

  return 'ok';
};
