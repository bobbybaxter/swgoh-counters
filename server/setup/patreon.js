const patreon = require('patreon');

module.exports = (app) => {
  const patreonOAuth = patreon.oauth;
  const patreonOAuthClient = patreonOAuth(
    process.env.PATREON_CLIENT_ID,
    process.env.PATREON_CLIENT_SECRET,
  );

  return patreonOAuthClient;
};
