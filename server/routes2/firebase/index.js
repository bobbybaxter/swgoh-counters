const { Router } = require('express');

const router = new Router();

module.exports = (app) => {
  const { middleware } = app;

  return router
    .use(middleware.context)
    .get('/:id', require('./get')(app));
};
