module.exports = ( { data, server } ) => ( {
  method: 'POST',
  path: '/leader',
  handler: async ( request, reply ) => {
    const { id, view, battleType } = request.body;

    const leaderSquadToCreate = {
      squadId: id,
      view,
      battleType,
    };

    const createdSquadId = await data.create( leaderSquadToCreate );

    reply
      .type( 'text/html' )
      .send( createdSquadId );
  },
  schema: {
    body: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        view: { type: 'string' },
        battleType: { type: 'string' },
      },
    },
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
} );
