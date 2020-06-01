const { Router } = require('express');

const router = new Router();

module.exports = (app) => {
  const { middleware, log } = app;

  log.info(middleware.context);

  return router
    .use(middleware.context)
    .use('/', require('./create')(app))
    .use('/:id', require('./update')(app));
};

// .use(middleware.auth)
