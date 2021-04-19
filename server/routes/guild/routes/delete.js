module.exports = ({ data, log, server }) => ({
  method: 'DELETE',
  path: '/guild/:id',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const response = await data.delete(request.params.id);
    reply
      .type('text/html')
      .send(response);
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
});
