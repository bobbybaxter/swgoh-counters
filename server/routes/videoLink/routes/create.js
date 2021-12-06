const _ = require( 'lodash' );

module.exports = ( { data, log, server } ) => ( {
  method: 'POST',
  path: '/videoLink',
  preValidation: server.auth( [ server.firebaseAuth ] ),
  handler: async ( request, reply ) => {
    const counterToUpdate = await data.counter.getById( request.body.subjectId );
    const newCounter = {
      userId: request.body.userId,
      username: request.body.username,
      ...counterToUpdate,
    };

    // eslint-disable-next-line no-useless-catch
    try {
      const createdVideoLink = await data.create( request.body );
      await data.counter.update( newCounter );

      if ( createdVideoLink ) { // updates leaderVersion for the squads in this counter
        const { opponentSquadId, counterSquadId, battleType } = counterToUpdate;
        const opponentLeader = await data.leader.getSingleLeader( [ opponentSquadId, battleType, 'normal' ] );
        !_.isEmpty( opponentLeader ) && await data.leader.updateVersion( opponentLeader.id );
        const counterLeader = await data.leader.getSingleLeader( [ counterSquadId, battleType, 'reverse' ] );
        !_.isEmpty( counterLeader ) && await data.leader.updateVersion( counterLeader.id );
      }

      reply
        .type( 'text/html' )
        .send( createdVideoLink );
    } catch ( err ) {
      throw err;
    }
  },
  schema: {
    body: {
      type: 'object',
      properties: {
        subjectId: { type: 'string' },
        title: { type: 'string' },
        link: { type: 'string' },
        userId: { type: 'string' },
        username: { type: 'string' },
      },
      required: [
        'subjectId',
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
