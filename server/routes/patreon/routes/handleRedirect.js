/* eslint-disable camelcase */
module.exports = ({ data, patreon }) => ({
  method: 'GET',
  path: '/patreon/redirect',
  handler: async (request, reply) => {
    const { code } = request.query;
    const redirect = process.env.REDIRECT_URL;
    const myCampaignId = '3137849';

    const patreonToken = await patreon.getTokens(code, redirect);
    const token = patreonToken.access_token;
    const apiClient = await data.verifyPatronToken(token); // verifies token with Patreon
    const patronInfo = await apiClient(encodeURI('/v2/identity?include=memberships.campaign&fields[member]=patron_status,email&fields[campaign]=vanity&fields[user]=email,full_name')); // requests patron info
    const { rawJson } = patronInfo;

    if (rawJson.included) {
      // if the patron is a member of your campaign,
      // an object with the id and status will be returned
      const patreonId = rawJson.data.id;
      const patreonEmail = rawJson.data.attributes.email;

      const patronRelationship = rawJson.included.find(inc => inc.type === 'member' && inc.relationships.campaign.data.id === myCampaignId);
      const patronStatus = patronRelationship.attributes.patron_status;
      // console.log('patronStatus :>> ', patronStatus);
      const user = await data.firebase.getByEmail(patreonEmail);

      if (patronStatus === 'active_patron') {
        const patron = {
          ...user,
          patreonId,
          patronStatus,
        };
        await data.firebase.addPatronInfoToFirebase(patron);
      }
    }

    reply.redirect(process.env.BASE_URL);
  },
});
