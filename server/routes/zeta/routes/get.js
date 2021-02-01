module.exports = app => ({
  method: 'GET',
  path: '/zeta',
  handler: async (request, reply) => {
    const allZetas = await app.data.get();
    reply.send(allZetas);
  },
  schema: {
    response: {
      '2xx': {
        type: 'array',
        items: {
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            characterId: { type: 'string' },
          },
        },
      },
    },
  },
});
