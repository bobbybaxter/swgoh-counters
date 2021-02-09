const patreon = require('patreon');
// const config = require('../.config.json');

module.exports = (app) => {
  const patreonOAuth = patreon.oauth;
  const patreonOAuthClient = patreonOAuth(
    process.env.PATREON_CLIENT_ID,
    process.env.PATREON_CLIENT_SECRET,
  );

  return patreonOAuthClient;
};
