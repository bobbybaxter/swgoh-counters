const _ = require( 'lodash' );

module.exports = ( { data, server } ) => ( {
  method: 'DELETE',
  path: '/counter/:id',
  preValidation: server.auth( [ server.firebaseAuth ] ),
  handler: async ( request, reply ) => {
    const { id } = request.params;
    const counter = await data.getById( id );

    const response = await data.delete( id );

    if ( response === 'ok' ) { // updates leaderVersion for the squads in this counter
      const { opponentSquadId, counterSquadId, battleType } = counter;
      const opponentLeader = await data.leader.getSingleLeader( [ opponentSquadId, battleType, 'normal' ] );
      !_.isEmpty( opponentLeader ) && data.leader.updateVersion( opponentLeader.id );
      const counterLeader = await data.leader.getSingleLeader( [ counterSquadId, battleType, 'reverse' ] );
      !_.isEmpty( counterLeader ) && data.leader.updateVersion( counterLeader.id );
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
