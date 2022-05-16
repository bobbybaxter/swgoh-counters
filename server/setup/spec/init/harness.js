const serverFactory = require( 'server' );

let server;

beforeAll( async done => {
  const app = require( 'server/index' );
  const srv = await serverFactory( app );
  await srv.initialize();
  server = srv;
  done();
} );

afterAll( async done => {
  await server.stop();
  done();
} );

module.exports = {
  server: new Proxy( {}, {
    get( target, name ) {
      return server[ name ];
    },
    set( target, name, value ) {
      server[ name ] = value;
    },
  } ),
};
