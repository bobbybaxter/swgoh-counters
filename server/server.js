const express = require('express');

const server = express();

module.exports = (app) => {
  const PORT = process.env.PORT || 5000;

  server.use(require('./routes')(app));

  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

  return server;
};
