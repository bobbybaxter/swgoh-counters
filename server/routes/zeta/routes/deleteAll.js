module.exports = ({ data, server }) => ({
  method: 'DELETE',
  path: '/zeta',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const response = await data.deleteAll();
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
