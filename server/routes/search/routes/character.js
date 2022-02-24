/* eslint-disable no-return-await */
module.exports = ( { data, server } ) => ( {
  method: 'POST',
  path: '/search/character',
  preValidation: server.auth( [ server.firebaseAuth ] ),
  handler: async ( request, reply ) => {
    const { body } = request;
    return await data.character( body );
  },
  schema: {
    body: {
      type: 'object',
      required: [ 'battleType', 'selectedSeason', 'squadPosition', 'characterId' ],
      properties: {
        battleType: { type: 'string' },
        selectedSeason: { type: 'number' },
        squadPosition: { type: 'string' },
        characterId: { type: 'string' },
      },
    },
    response: {
      '2xx': {
        type: 'array',
        items: {
          properties: {
            id: { type: 'string' },
            totalSeen: { type: 'number' },
            avgWin: { type: 'number' },
            avgBanners: { type: 'number' },
            opponentSquad: { type: 'array' },
            counterSquad: { type: 'array' },
          },
        },
      },
    },
  },
} );
