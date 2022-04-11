// TODO: check to see if validation works now that i've added new passthroughs
module.exports = ( { data, server } ) => ( {
  method: 'POST',
  path: '/firebase',
  // preValidation: server.auth( [ server.firebaseAuth ] ),
  handler: async ( request, reply ) => {
    const user = await data.create( request.body );
    reply
      .type( 'application/json' )
      .send( user );
  },
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
        },
      },
    },
  },
} );
