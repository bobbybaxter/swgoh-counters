const renamePatronStatus = require('../../../util/renamePatronStatus');
const renameTier = require('../../../util/renameTier');

module.exports = ({ data, patreon }) => ({
  method: 'GET',
  path: '/patreon/redirect',
  handler: async (request, reply) => {
    let accessToken;
    let refreshToken;
    const { code } = request.query;
    const redirect = process.env.REDIRECT_URL;
    const myCampaignId = '3137849';
    const now = new Date();
    const expiresIn = new Date(now.setDate(now.getDate() + 30));

    const patreonToken = await patreon.getTokens(code, redirect);
    accessToken = patreonToken.access_token;
    refreshToken = patreonToken.refresh_token;

    const apiClient = await data.getPatreonClient(accessToken);
    let patronInfo;
    try {
      patronInfo = await apiClient({
        method: 'GET',
        path: '/v2/identity?include=memberships.campaign&fields[member]=patron_status,email&fields[campaign]=vanity&fields[user]=email,full_name',
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
    if (patronInfo.rawJson) {
      const { rawJson } = patronInfo;
      // if the patron is a member of your campaign,
      // an object with the id and status will be returned
      const patreonId = rawJson.data.id;
      const patreonEmail = rawJson.data.attributes.email;
      const membership = rawJson.included && rawJson.included.find(x => x.type === 'member');

      if (membership) {
        const creatorToken = await data.firebase.getCreatorToken();
        const memberTier = await data.getMemberTier({ creatorToken, membership });
        const patronRelationship = rawJson.included && rawJson.included.find(inc => inc.type === 'member' && inc.relationships.campaign.data.id === myCampaignId);
        const patronStatus = patronRelationship.attributes.patron_status;
        const user = await data.firebase.getByEmail(patreonEmail.toLowerCase());

        if (expiresIn < now.toISOString()) {
          const refreshedPatronToken = await data.getRefreshedToken(accessToken, refreshToken);
          ({ accessToken } = refreshedPatronToken.accessToken);
          ({ refreshToken } = refreshedPatronToken.refreshToken);
        }

        if (patronStatus) {
          const patron = {
            ...user,
            accessToken,
            refreshToken,
            expiresIn,
            patreonId,
            patronStatus: renamePatronStatus(patronStatus),
            tier: renameTier(memberTier.id),
          };
          await data.firebase.addPatronInfoToFirebase(patron);
        }
      }
    }

    reply.redirect(process.env.BASE_URL);
  },
});
