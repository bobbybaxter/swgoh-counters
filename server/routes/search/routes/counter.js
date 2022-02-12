/* eslint-disable no-return-await */
module.exports = ( { data } ) => ( {
  method: 'POST',
  path: '/search/counter',
  handler: async ( request, reply ) => {
    const { body } = request;
    return await data.counter( body );
  },
  schema: {
    body: {
      type: 'object',
      required: [ 'battleType', 'selectedSeason', 'opponentSquad', 'counterSquad' ],
      properties: {
        battleType: { type: 'string' },
        selectedSeason: { type: 'number' },
        opponentSquad: { type: 'array' },
        counterSquad: { type: 'array' },
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
