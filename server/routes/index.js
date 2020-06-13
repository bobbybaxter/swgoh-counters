const { Router } = require('express');

const router = new Router();
const bodyParser = require('body-parser');

module.exports = (app) => {
  router
    .use(bodyParser.json());

  router
    .use('/api/counters', require('./counter')(app))
    .use('/api/squads', require('./squad')(app))
    .use('/api/user', require('./user')(app))
    .use('/api/firebase', require('./firebase')(app))
    .use('/api/patreon', require('./patreon')(app));

  return router;
};
