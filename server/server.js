const express = require('express');
const cors = require('cors');

const server = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://saiastrange.com',
];

module.exports = (app) => {
  const PORT = process.env.PORT || 5000;

  server.use(cors({
    origin(origin, callback) {
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not '
                + 'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }));

  server.use(require('./routes')(app));

  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

  return server;
};
