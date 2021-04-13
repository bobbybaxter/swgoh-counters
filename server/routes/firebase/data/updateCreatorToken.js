module.exports = ({ firebaseDb }) => async ({
  id,
  accessToken,
  expiresIn,
  refreshToken,
}) => {
  firebaseDb.ref(`patreonTokens/${id}`).update({
    accessToken,
    expiresIn,
    refreshToken,
  });

  return 'ok';
};
