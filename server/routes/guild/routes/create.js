module.exports = ({ data, server }) => ({
  method: 'POST',
  path: '/guild',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const guild = await data.create(request.body);
    reply
      .type('application/json')
      .send(guild);
  },
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          getTierUsers: { type: 'string' },
        },
      },
    },
  },
});
