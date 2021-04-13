module.exports = app => async ({ creatorToken, membership }) => {
  const { accessToken } = creatorToken;
  const getMemberTier = await fetch(encodeURI(`https://www.patreon.com/api/oauth2/v2/members/${membership.id}?include=currently_entitled_tiers`), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const memberTierResponse = await getMemberTier.json();

  if (!memberTierResponse) { return ''; }

  return memberTierResponse.included.find(x => x.type === 'tier'); // this assumes there is only one tier
};
