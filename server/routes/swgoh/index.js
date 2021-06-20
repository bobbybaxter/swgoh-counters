const routeFactory = require('./routes');

module.exports = app => async server => {
  const data = require('./data')(app);
  data.firebase = require('routes/firebase/data')(app);
  data.squad = require('routes/squad/data')(app);
  data.counter = require('routes/counter/data')(app);
  data.counterStats = require('routes/counterStats/data')(app);
  data.character = require('routes/character/data')(app);
  const routes = routeFactory({ ...app, data, server });
  return routes.forEach(route => server.route(route));
};
