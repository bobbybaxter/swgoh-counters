const patreon = require('patreon');
const config = require('./.config.json');

module.exports = (app) => {
  const patreonOAuth = patreon.oauth;
  const patreonOAuthClient = patreonOAuth(
    config.patreonClientId,
    config.patreonClientSecret,
  );

  return patreonOAuthClient;
};
