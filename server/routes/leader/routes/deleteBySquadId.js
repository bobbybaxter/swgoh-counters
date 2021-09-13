module.exports = ( { data, server } ) => ( {
  method: 'DELETE',
  path: '/leader/:squadId/:view/:battleType',
  handler: async ( request, reply ) => {
    const { squadId, view, battleType } = request.params;
    const response = await data.deleteBySquadId( [ squadId, view, battleType ] );
    reply
      .type( 'text/html' )
      .send( response );
  },
  schemas: {
    params: {
      squadId: { type: 'string' },
      view: { type: 'string' },
      battleType: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
} );
