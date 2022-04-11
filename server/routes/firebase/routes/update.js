module.exports = ( { data, server } ) => ( {
  method: 'PATCH',
  path: '/firebase',
  // preValidation: server.auth( [ server.firebaseAuth ] ),
  handler: async ( request, reply ) => {
    const user = await data.update( request.body );
    reply.send( user );
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    body: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        allyCode: { type: 'string' },
        discordId: { type: 'string' },
        email: { type: 'string' },
        expiresIn: { type: 'string' },
        guildId: { type: 'string' },
        guildName: { type: 'string' },
        patreonId: { type: 'string' },
        patronStatus: { type: 'string' },
        refreshToken: { type: 'string' },
        tier: { type: 'string' },
        username: { type: 'string' },
      },
    },
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
} );
