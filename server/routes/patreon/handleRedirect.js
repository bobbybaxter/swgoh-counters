/* eslint-disable camelcase */
// const patreonApi = require('patreon');

module.exports = app => async function handleRedirect(req, res) {
  const { patreon, firebaseDb } = app;
  const { code } = req.query;
  const redirect = process.env.REDIRECT_URL;
  const myCampaignId = '3137849';
  let token;

  // TODO: try to change redirects to returns
  // so i can take action on the results on the client side

  await patreon.getTokens(code, redirect)
    .then(({ access_token }) => { // gets Patreon access token from client link to Patreon button
      token = access_token;
      const apiClient = app.data.patreon.verifyPatronToken(token); // verifies token with Patreon
      return apiClient(encodeURI('/v2/identity?include=memberships.campaign&fields[member]=patron_status,email&fields[campaign]=vanity&fields[user]=email,full_name')); // requests patron info
    })
    .then(async ({ rawJson }) => {
      // if the patron is a member of your campaign,
      // an object with the id and status will be returned
      const patreonId = rawJson.data.id;
      const patreonEmail = rawJson.data.attributes.email;
      const patronRelationship = rawJson.included.find(inc => inc.type === 'member' && inc.relationships.campaign.data.id === myCampaignId);
      const patronStatus = patronRelationship.attributes.patron_status;
      const user = await app.data.user.getByEmail(patreonEmail, firebaseDb);

      if (patronStatus === 'active_patron') {
        const patron = {
          ...user,
          patreonId,
          patronStatus,
        };
        app.data.user.addPatronInfoToFirebase(patron, firebaseDb);
      }

      console.log('redirect on success :>> ');
      res.redirect(process.env.RETURN_URL);
    })
    .catch((err) => {
      console.log('Error with Patron verification');
      console.log(err);
      res.redirect(process.env.RETURN_URL);
    });
};
