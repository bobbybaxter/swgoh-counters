const _ = require( 'lodash' );

// returns a JSON of the roster of squadLeaders per season=
module.exports = ( { data } ) => ( {
  method: 'GET',
  path: '/swgoh/leaders/:season',
  handler: async ( request, reply ) => {
    const { season } = request.params;
    const seasonRoster = await data.getLeadersBySeason( season ) || [];

    if ( !_.isEmpty( seasonRoster )) {
      try {
        await data.firebase.createSeasonRoster( { season, seasonRoster } );
      } catch ( err ) {
        console.error( 'err :>> ', err );
        throw err;
      }
    }

    reply.send( 'ok' );
  },
  schema: {
    params: {
      season: { type: 'number' },
    },
  },
} );
