const getRefreshedToken = require('./getRefreshedToken');
const updateCreatorToken = require('../../firebase/data/updateCreatorToken');

module.exports = app => async ({ creatorToken, membership, patreonEmail }) => {
  const { log } = app;
  let getMemberTier;
  const { accessToken, refreshToken } = creatorToken;

  getMemberTier = await fetch(encodeURI(`https://www.patreon.com/api/oauth2/v2/members/${membership.id}?include=currently_entitled_tiers`), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (getMemberTier.status === 401) {
    log.error(`Creator Access Token (${accessToken}) expired.`);
    const newCreatorToken = await getRefreshedToken(app)(accessToken, refreshToken);
    await updateCreatorToken({
      id: process.env.PATREON_CREATOR_ID,
      accessToken: newCreatorToken.accessToken,
      expiresIn: newCreatorToken.accessToken,
      refreshToken: newCreatorToken.refreshToken,
    });
    getMemberTier = await fetch(encodeURI(`https://www.patreon.com/api/oauth2/v2/members/${membership.id}?include=currently_entitled_tiers`), {
      headers: {
        Authorization: `Bearer ${newCreatorToken.accessToken}`,
      },
    });
  }

  const memberTierResponse = await getMemberTier.json();

  if (!memberTierResponse) {
    return '';
  }

  if (!memberTierResponse.included) {
    return `Patreon info not found for ${patreonEmail}`;
  }

  return memberTierResponse.included.find(x => x.type === 'tier'); // this assumes there is only one tier
};
