/* eslint-disable camelcase */
module.exports = ({
  data, log, patreon,
}) => ({
  method: 'GET',
  path: '/redirect',
  handler: async (request, reply) => {
    const { code } = request.query;
    const redirect = process.env.REDIRECT_URL;
    const myCampaignId = '3137849';
    let token;

    await patreon.getTokens(code, redirect)
      .then(({ access_token }) => { // gets Patreon access token from client link to Patreon button
        token = access_token;
        const apiClient = data.verifyPatronToken(token); // verifies token with Patreon
        return apiClient(encodeURI('/v2/identity?include=memberships.campaign&fields[member]=patron_status,email&fields[campaign]=vanity&fields[user]=email,full_name')); // requests patron info
      })
      .then(async ({ rawJson }) => {
        // if the patron is a member of your campaign,
        // an object with the id and status will be returned
        const patreonId = rawJson.data.id;
        const patreonEmail = rawJson.data.attributes.email;
        const patronRelationship = rawJson.included.find(inc => inc.type === 'member' && inc.relationships.campaign.data.id === myCampaignId);
        const patronStatus = patronRelationship.attributes.patron_status;
        const user = await data.firebase.getByEmail(patreonEmail);

        if (patronStatus === 'active_patron') {
          const patron = {
            ...user,
            patreonId,
            patronStatus,
          };
          data.firebase.addPatronInfoToFirebase(patron);
        }

        reply.redirect(process.env.BASE_URL);
      })
      .catch((err) => {
        log.error('error with Patreon verification', err);
        reply.redirect(process.env.BASE_URL);
      });
  },
});
