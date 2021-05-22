const updateCreatorToken = require('../../firebase/data/updateCreatorToken');
const getPatreonClient = require('./getPatreonClient');

module.exports = app => async (oldAccessToken, oldRefreshToken) => {
  try {
    const apiClient = await getPatreonClient(app)(oldAccessToken);
    const newToken = await apiClient({
      method: 'POST',
      path: `/token?grant_type=refresh_token&refresh_token=${oldRefreshToken}&client_id=${process.env.PATREON_CLIENT_ID}&client_secret=${process.env.PATREON_CLIENT_SECRET}`,
    });

    const accessToken = newToken.rawJson.access_token;
    const refreshToken = newToken.rawJson.refresh_token;
    const now = new Date();
    const expiresIn = new Date(now.setDate(now.getDate() + 30));

    const newCreatorToken = {
      id: process.env.PATREON_CREATOR_ID,
      accessToken,
      refreshToken,
      expiresIn,
    };

    await updateCreatorToken(app)(newCreatorToken);

    return newCreatorToken;
  } catch (err) {
    throw err;
  }
};
