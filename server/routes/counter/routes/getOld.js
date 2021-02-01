module.exports = ({ data }) => ({
  method: 'GET',
  path: '/counter/old',
  handler: async (request, reply) => {
    const counters = await data.getOld();
    reply.send(counters);
  },
  schema: {
    response: {
      '2xx': {
        type: 'array',
        items: {
          properties: {
            counterId: { type: 'string' },
            opponentTeam: { type: 'string' },
            counterTeam: { type: 'string' },
            isHardCounter: { type: 'boolean' },
            battleType: { type: 'string' },
            description: { type: 'string' },
            video: { type: 'string' },
          },
        },
      },
    },
  },
});
