const express = require('express');
const cors = require('cors');

const server = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://saiastrange.com',
  'https://saiastrange.com',
  'http://www.saiastrange.com',
  'https://www.saiastrange.com',
];

module.exports = (app) => {
  const { log } = app;
  const PORT = process.env.PORT || 5000;

  server.use(cors({
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
  }));

  server.use(require('./routes')(app));

  log.info(`Listening on port ${PORT}`);
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

  return server;
};
