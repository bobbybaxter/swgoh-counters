const routeFactory = require('./routes');

module.exports = app => async (server) => {
  const data = require('./data')(app);
  data.patreon = require('routes/patreon/data')(app);
  data.guild = require('routes/guild/data')(app);
  const routes = routeFactory({ ...app, data, server });
  return routes.forEach(route => server.route(route));
};
