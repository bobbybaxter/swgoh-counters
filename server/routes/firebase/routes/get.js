module.exports = ({ data, log }) => ({
  method: 'GET',
  path: '/firebase/:id',
  handler: async (request, reply) => {
    try {
      const user = await data.getByFirebaseUid(request.params.id);
      reply
        .type('application/json')
        .send(user);
    } catch (err) {
      log.error(err);
    }
  },
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          allyCode: { type: 'string' },
          username: { type: 'string' },
          patreonId: { type: 'string' },
          patronStatus: { type: 'string' },
        },
      },
    },
  },
});
