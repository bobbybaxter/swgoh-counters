const { Router } = require('express');

const router = new Router();

module.exports = (app) => {
  const { middleware } = app;

  return router
    .use(middleware.auth)
    .use(middleware.context)
    .post('/', require('./create')(app))
    .patch('/:id', require('./update')(app));
};
