const routeFactory = require('./routes');

module.exports = app => async (server) => {
  const data = require('./data')(app);
  data.character = require('routes/character/data')(app);
  data.squad = require('routes/squad/data')(app);
  data.counter = require('routes/counter/data')(app);
  data.videoLink = require('routes/videoLink/data')(app);
  data.zeta = require('routes/zeta/data')(app);
  const routes = routeFactory({ ...app, data });
  return routes.forEach(route => server.route(route));
};
