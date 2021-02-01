module.exports = app => async (server) => {
  server.register(require('./character')(app));
  server.register(require('./counter')(app));
  server.register(require('./firebase')(app));
  server.register(require('./patreon')(app));
  server.register(require('./squad')(app));
  server.register(require('./videoLink')(app));
  server.register(require('./zeta')(app));
};
