require('dotenv').config({ path: 'server/.env' });
const fp = require('fastify-plugin');

module.exports = async function createServer(app) {
  const { log } = app;
  const server = require('fastify')({
    logger: log,
    ignoreTrailingSlash: true,
    disableRequestLogging: true,
  });
  const PORT = process.env.PORT || 5000;

  const allowedOrigins = [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://swgohcounters.com',
    'https://swgohcounters.com',
    'http://www.swgohcounters.com',
    'https://www.swgohcounters.com',
    'http://saiastrange.com',
    'https://saiastrange.com',
    'http://www.saiastrange.com',
    'https://www.saiastrange.com',
  ];

  server.register(require('fastify-cors'), {
    origin: function originCheck(origin, callback) {
      // allow requests with no origin like mobile apps or curl requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin of ${origin}.`;
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    preFlightContinue: true,
  });
  server.decorate('firebaseAuth', fp(require('./auth')));
  server.register(require('fastify-auth'));
  server.register(require('./context'));
  server.register(require('./access-log'));
  server.register(require('./routes')(app), { prefix: '/api' });

  await server.listen(PORT, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  });

  return server;
};
