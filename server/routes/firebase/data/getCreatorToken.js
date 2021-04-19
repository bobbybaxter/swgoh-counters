const getRefreshedToken = require('../../patreon/data/getRefreshedToken');
const updateCreatorToken = require('./updateCreatorToken');

module.exports = app => async () => {
  const now = new Date();
  const patreonCreatorId = process.env.PATREON_CREATOR_ID;

  let creatorToken = await app.firebaseDb
    .ref(`patreonTokens/${patreonCreatorId}`)
    .once('value')
    .then(snapshot => (snapshot.val()) || {});

  if (creatorToken.expiresIn < now.toISOString()) {
    creatorToken = await getRefreshedToken()(creatorToken.accessToken, creatorToken.refreshToken);
    await updateCreatorToken(app)({
      ...creatorToken,
      id: patreonCreatorId,
    });
  }
  return creatorToken;
};
