module.exports = app => async server => {
  server.register( require( './character' )( app ));
  server.register( require( './counter' )( app ));
  server.register( require( './discordBot' )( app ));
  server.register( require( './firebase' )( app ));
  server.register( require( './guild' )( app ));
  server.register( require( './import' )( app ));
  server.register( require( './leader' )( app ));
  server.register( require( './patreon' )( app ));
  server.register( require( './search' )( app ));
  server.register( require( './squad' )( app ));
  server.register( require( './swgoh' )( app ));
  server.register( require( './videoLink' )( app ));
  server.register( require( './zeta' )( app ));
};
