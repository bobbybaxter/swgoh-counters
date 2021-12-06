const _ = require( 'lodash' );

module.exports = ( { data, log, server } ) => ( {
  method: 'PATCH',
  path: '/videoLink/:id',
  preValidation: server.auth( [ server.firebaseAuth ] ),
  handler: async ( request, reply ) => {
    const videoLinkToUpdate = await data.getById( request.params.id );

    const updateNeeded = !_.isEqual(
      _.omit( videoLinkToUpdate, [
        'subjectId',
        'createdOn',
        'createdById',
        'createdByName',
      ] ),
      _.omit( request.body, [ 'userId', 'username' ] ),
    );

    if ( updateNeeded ) {
      const counterToUpdate = await data.counter.getById( videoLinkToUpdate.subjectId );
      const newCounter = {
        userId: request.body.userId,
        username: request.body.username,
        ...counterToUpdate,
      };

      // eslint-disable-next-line no-useless-catch
      try {
        const updateResponse = await data.update( request.body );
        await data.counter.update( newCounter );

        if ( updateResponse ) { // updates leaderVersion for the squads in this counter
          const { opponentSquadId, counterSquadId, battleType } = counterToUpdate;
          const opponentLeader = await data.leader.getSingleLeader( [ opponentSquadId, battleType, 'normal' ] );
          !_.isEmpty( opponentLeader ) && await data.leader.updateVersion( opponentLeader.id );
          const counterLeader = await data.leader.getSingleLeader( [ counterSquadId, battleType, 'reverse' ] );
          !_.isEmpty( counterLeader ) && await data.leader.updateVersion( counterLeader.id );
        }

        return reply
          .type( 'text/html' )
          .send( updateResponse );
      } catch ( err ) {
        throw err;
      }
    } else {
      log.warn( 'VideoLink update not needed.' );
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
        title: { type: 'string' },
        link: { type: 'string' },
        userId: { type: 'string' },
        username: { type: 'string' },
      },
      required: [
        'id',
        'title',
        'link',
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
