const express = require('express');

// const app = express();
const port = process.env.PORT || 5000;

// app.listen(port, () => console.log(`Listening on port ${port}`));

// app.get('/express_backend', (req, res) => {
//   res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
// });

// const express = require( "express" );
// const commonMiddleware = require( "@lk/core-common-middleware" );
// const eventTracking = require( "@lk/core-express-tracking" );
// const nocache = require( "nocache" );

module.exports = (app) => {
  // const { pkg, log, config } = app;

  // if ( config.eventTracking.enabled ) {
  // log.debug( "Enabling event tracking" );
  // eventTracking.apply(
  // express,
  // app.log,
  // config.name,
  // config.rabbit,
  // config.eventTracking.routeBlacklist
  // );
  // }

  const server = express();
  server.listen(port, () => console.log(`Listening on port ${port}`));

  // server.set( "trust proxy", true );
  // server.set( "etag", false );
  // server.set( "x-powered-by", false );

  // server.use( nocache() );

  // // Mount global pre-routing middleware
  // server.use( commonMiddleware.preRouting( pkg, log ) );

  // Mount our routes
  server.use(require('./routes')(app));

  // Mount global post-routing middleware
  // server.use( commonMiddleware.postRouting() );

  return server;
};
