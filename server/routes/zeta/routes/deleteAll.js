module.exports = app => ({
  method: 'DELETE',
  path: '/zeta',
  handler: async (request, reply) => {
    const response = await app.data.deleteAll();
    reply.send(response);
  },
  schema: {
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
});
