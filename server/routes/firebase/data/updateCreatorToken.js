module.exports = ({ firebaseDb }) => async ({
  id,
  accessToken,
  expiresIn,
  refreshToken,
}) => {
  if (id) {
    firebaseDb.ref(`patreonTokens/${id}`).update({
      accessToken,
      expiresIn,
      refreshToken,
    });
  }

  return 'ok';
};
