module.exports = ({ data, server }) => ({
  method: 'DELETE',
  path: '/character/:id',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const response = await data.delete(request.params.id);
    reply.send(response);
  },
  schemas: {
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
