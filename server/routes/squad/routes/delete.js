const _ = require( 'lodash' );

module.exports = ( { data, server } ) => ( {
  method: 'DELETE',
  path: '/squad/:id',
  preValidation: server.auth( [ server.firebaseAuth ] ),
  handler: async ( request, reply ) => {
    const { id } = request.params;

    const allCounters = await data.counter.getAllBySquadId( id );

    const response = await data.delete( request.params.id );

    if ( response === 'ok' ) {
      // deletes squad from leaders
      const leaders = await data.leader.getMultipleLeaders( id );
      if ( !_.isEmpty( leaders )) {
        await Promise.all( leaders.map( async leader => data.leader.delete( leader.id )));
      }

      // updates all leaders that had counters with this squad
      const normalLeaderIds = await Promise.all( allCounters
        .filter( x => x.opponentSquadId !== id )
        .map( async y => {
          const leader = await data.leader.getSingleLeader( [ y.opponentSquadId, y.battleType, 'normal' ] );
          return leader.id;
        } ));
      const filteredNormalLeaderIds = normalLeaderIds.filter( x => x !== undefined );

      filteredNormalLeaderIds && !_.isEmpty( filteredNormalLeaderIds[ 0 ] ) && await Promise.all(
        filteredNormalLeaderIds.map( leaderId => (
          data.leader.updateVersion( leaderId )
        )),
      );

      const reverseLeaderIds = await Promise.all( allCounters
        .filter( x => x.opponentSquadId === id )
        .map( async y => {
          const leader = await data.leader.getSingleLeader( [ y.counterSquadId, y.battleType, 'reverse' ] );
          return leader.id || {};
        } ));
      const filteredReverseLeaderIds = reverseLeaderIds.filter( x => x !== undefined );

      filteredReverseLeaderIds && !_.isEmpty( filteredReverseLeaderIds[ 0 ] ) && await Promise.all(
        filteredReverseLeaderIds.map( leaderId => (
          data.leader.updateVersion( leaderId )
        )),
      );
    }

    reply
      .type( 'text/html' )
      .send( response );
  },
  schemas: {
    params: {
      id: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
} );
