/* eslint-disable no-return-await */
module.exports = ( { data } ) => ( {
  method: 'POST',
  path: '/search/squad',
  handler: async ( request, reply ) => {
    const { body } = request;
    return await data.squad( body );
  },
  schema: {
    body: {
      type: 'object',
      required: [ 'battleType', 'selectedSeason', 'squadPosition', 'squad' ],
      properties: {
        battleType: { type: 'string' },
        selectedSeason: { type: 'number' },
        squadPosition: { type: 'string' },
        squad: { type: 'array' },
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
