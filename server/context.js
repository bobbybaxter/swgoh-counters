const fp = require( 'fastify-plugin' );
const url = require( 'url' );

module.exports = fp( async server => {
  server.decorateRequest( 'swContext', null );
  server.addHook( 'preHandler', ( request, reply, done ) => {
    const { log, headers } = request;
    const { pathname } = url.parse( request.url );
    const location = new URL( `https://${ headers.host }${ pathname }` );

    const context = {
      requestUrl: location,
      requestOrigin: location.origin,
      now: new Date(),
      log,
    };

    request.swContext = context;
    done();
  } );
} );
