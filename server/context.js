const fp = require('fastify-plugin');
const url = require('url');

module.exports = fp(async (server) => {
  server.decorateRequest('swContext', null);
  server.addHook('preHandler', async (req) => {
    const { log, headers } = req;
    const { pathname } = url.parse(req.url);
    const location = new URL(`https://${headers.host}${pathname}`);

    const context = {
      requestUrl: location,
      requestOrigin: location.origin,
      now: new Date(),
      log,
    };

    req.swContext = context;
  });
});

// const { protocol, hostname } = req;
// const location = url.format({
//   protocol,
//   host: hostname,
//   pathname: req.originalUrl,
// });

// const { origin } = (new url.URL(location));
// const pathnameValue = req.url.substr(1);

// req.context = {
//   // userId: req.user.id,
//   // orgId: req.user.organizationId,
//   requestUrl: location,
//   requestOrigin: origin,
//   pathnameValue,
//   now: new Date(),
// };

// console.info('context :>>', new Date(), `- ${req.method} ${location}`);

// return next();
// };
