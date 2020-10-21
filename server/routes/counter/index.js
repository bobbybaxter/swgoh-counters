const { Router } = require('express');

const router = new Router();

module.exports = (app) => {
  const { middleware } = app;

  return router
    .use(middleware.context)
    .get('/', require('./get')(app))
    .get('/old', require('./getOld')(app))
    .get('/3v3', require('./get3v3')(app))
    .get('/3v3versionDates', require('./get3v3versionDates')(app))
    .get('/5v5', require('./get5v5')(app))
    .get('/getBySquadId/:id', require('./getBySquadId')(app))
    .get('/getStubsBySquadId/:id', require('./getStubsBySquadId')(app))
    .get('/5v5versionDates', require('./get5v5versionDates')(app))
    .get('/:id', require('./getById')(app))
    .post('/', require('./create')(app))
    .patch('/:id', require('./update')(app))
    .delete('/:id', require('./delete')(app));
};
