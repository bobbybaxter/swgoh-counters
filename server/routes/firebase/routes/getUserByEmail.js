module.exports = ( { data } ) => ( {
  method: 'GET',
  path: '/firebase/getUserByEmail/:email',
  handler: async ( request, reply ) => {
    const user = await data.getByEmail( request.params.email );
    reply
      .type( 'application/json' )
      .send( user );
  },
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          allyCode: { type: 'string' },
          discordId: { type: 'string' },
          email: { type: 'string' },
          expiresIn: { type: 'string' },
          id: { type: 'string' },
          guildId: { type: 'string' },
          guildName: { type: 'string' },
          patreonId: { type: 'string' },
          patronStatus: { type: 'string' },
          refreshToken: { type: 'string' },
          tier: { type: 'string' },
          username: { type: 'string' },
        },
      },
    },
  },
} );
