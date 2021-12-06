const routeFactory = require( './routes' );

module.exports = app => async server => {
  const data = require( './data' )( app );
  data.counter = require( 'routes/counter/data' )( app );
  data.leader = require( 'routes/leader/data' )( app );
  const routes = routeFactory( { ...app, data, server } );
  return routes.forEach( route => server.route( route ));
};
