const renamePatronStatus = require('util/renamePatronStatus');
const renameTier = require('util/renameTier');

module.exports = ({ data, patreon }) => ({
  method: 'GET',
  path: '/patreon/redirect',
  handler: async (request, reply) => {
    let accessToken, patron, patreonId, patreonEmail, patronInfo, refreshToken;
    const { code } = request.query;
    const redirect = process.env.REDIRECT_URL;
    const myCampaignId = '3137849';
    const now = new Date();
    const expiresIn = new Date(now.setDate(now.getDate() + 30));

    const patreonToken = await patreon.getTokens(code, redirect); // patron's token
    accessToken = patreonToken.access_token;
    refreshToken = patreonToken.refresh_token;

    const apiClient = await data.getPatreonClient(accessToken);

    try {
      patronInfo = await apiClient({
        method: 'GET',
        path: '/v2/identity?include=memberships.campaign&fields[member]=patron_status,email&fields[campaign]=vanity&fields[user]=email,full_name',
      });
    } catch (err) {
      throw err;
    }

    if (patronInfo.rawJson) {
      const { rawJson } = patronInfo;
      // if the patron is a member of your campaign,
      // an object with the id and status will be returned
      patreonId = rawJson.data.id;
      patreonEmail = rawJson.data.attributes.email;
      const membership = rawJson.included && rawJson.included.find(x => x.type === 'member');
      const user = await data.firebase.getByEmail(patreonEmail.toLowerCase());

      if (membership) {
        const creatorToken = await data.firebase.getCreatorToken();
        const memberTier = await data.getMemberTier({ creatorToken, membership, patreonEmail });
        if (memberTier === 'Not a Patron') {
          return reply.redirect(process.env.BASE_URL);
        }

        const patronRelationship = rawJson.included && rawJson.included.find(inc => inc.type === 'member' && inc.relationships.campaign.data.id === myCampaignId);
        const patronStatus = patronRelationship.attributes.patron_status;

        if (user.expiresIn && user.expiresIn < now.toISOString()) {
          const refreshedPatronToken = await data.getRefreshedToken(accessToken, refreshToken);
          ({ accessToken } = refreshedPatronToken.accessToken);
          ({ refreshToken } = refreshedPatronToken.refreshToken);
        }

        if (patronStatus) {
          patron = {
            ...user,
            accessToken,
            refreshToken,
            expiresIn,
            patreonId,
            patronStatus: renamePatronStatus(patronStatus),
            tier: memberTier ? renameTier(memberTier.id) : '',
          };
        }
      } else {
        patron = {
          ...user,
          accessToken,
          refreshToken,
          expiresIn,
          patreonId,
          patronStatus: `Patreon info not found for ${patreonEmail}`,
          tier: '',
        };
      }
    }

    await data.firebase.addPatronInfoToFirebase(patron);

    return reply.redirect(process.env.BASE_URL);
  },
});
