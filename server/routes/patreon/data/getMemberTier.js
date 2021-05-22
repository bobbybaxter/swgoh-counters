const getRefreshedToken = require('./getRefreshedToken');

module.exports = app => async ({ creatorToken, membership }) => {
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
    return 'Not a Patron';
  }

  return memberTierResponse.included.find(x => x.type === 'tier'); // this assumes there is only one tier
};
