const { Router } = require('express');

const router = new Router();

module.exports = (app) => {
  const { middleware } = app;

  return router
    .use(middleware.context)
    .get('/', require('./get')(app))
    .get('/:id', require('./getById')(app))
    .get('/old', require('./getOld')(app))
    .get('/stubs/:size', require('./getStubs')(app))
    .get('/versionDate', require('./versionDate')(app))
    .post('/', require('./create')(app))
    .patch('/:id', require('./update')(app))
    .delete('/:id', require('./delete')(app));
};
