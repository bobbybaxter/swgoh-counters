const routeFactory = require('./routes');

module.exports = app => async (server) => {
  const data = require('./data')(app);
  data.counter = require('../counter/data')(app);
  const routes = routeFactory({ ...app, data, server });
  return routes.forEach(route => server.route(route));
};
