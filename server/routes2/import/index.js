const { Router } = require('express');

const router = new Router();

module.exports = (app) => {
  const { middleware } = app;

  return router
    .use(middleware.context)
    .get('/counters', require('./counters')(app))
    .get('/characters', require('./characters')(app))
    .get('/squads', require('./squads')(app));
};
