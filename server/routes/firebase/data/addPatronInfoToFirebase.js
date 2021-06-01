module.exports = ({ firebaseDb }) => (user) => {
  if (user.id) {
    firebaseDb.ref(`users/${user.id}`).update({
      accessToken: user.accessToken,
      expiresIn: user.expiresIn,
      patreonId: user.patreonId,
      patronStatus: user.patronStatus,
      refreshToken: user.refreshToken,
      tier: user.tier,
    });
  }

  return 'ok';
};
