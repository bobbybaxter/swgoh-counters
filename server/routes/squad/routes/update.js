const _ = require( 'lodash' );

module.exports = ( { data, log, server } ) => ( {
  method: 'PATCH',
  path: '/squad/:id',
  preValidation: server.auth( [ server.firebaseAuth ] ),
  handler: async ( request, reply ) => {
    const { id } = request.params;
    const squadToUpdate = await data.getById( id );

    const updateNeeded = !_.isEqual(
      _.omit( squadToUpdate, [
        'toon1Name',
        'toon2Name',
        'toon3Name',
        'toon4Name',
        'toon5Name',
        'latestVersionId',
        'createdOn',
        'createdById',
        'createdByName',
      ] ),
      _.omit( request.body, [ 'userId', 'username' ] ),
    );

    if ( updateNeeded ) {
      const updateResponse = await data.update( { id, ...request.body } );

      if ( updateResponse === 'ok' ) {
        // updates all leaders that have counters with this squad
        const allCounters = await data.counter.getAllBySquadId( id );
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
    } else {
      log.warn( 'Squad update not needed.' );
    }

    return reply
      .type( 'text/html' )
      .send( 'ok' );
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    body: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        generalStrategy: { type: 'string' },
        toon1Id: { type: 'string' },
        toon2Id: { type: 'string' },
        toon3Id: { type: 'string' },
        toon4Id: { type: 'string' },
        toon5Id: { type: 'string' },
        userId: { type: 'string' },
        username: { type: 'string' },
      },
      required: [
        'id',
        'name',
        'description',
        'generalStrategy',
        'toon1Id',
        'toon2Id',
        'toon3Id',
        'toon4Id',
        'toon5Id',
        'userId',
        'username',
      ],
    },
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
} );
