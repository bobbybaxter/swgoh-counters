const url = require('url');

module.exports = function context(req, res, next) {
  const { protocol, hostname } = req;
  const location = url.format({
    protocol,
    host: hostname,
    pathname: req.originalUrl,
  });

  const { origin } = (new url.URL(location));
  const pathnameValue = req.url.substr(1);

  req.context = {
    // userId: req.user.id,
    // orgId: req.user.organizationId,
    requestUrl: location,
    requestOrigin: origin,
    pathnameValue,
    now: new Date(),
  };

  console.log('req.context :>> ', req.context);

  return next();
};
