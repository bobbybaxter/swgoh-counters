module.exports = ({ data, server }) => ({
  method: 'PATCH',
  path: '/guild',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const guild = await data.update(request.body);
    reply.send(guild);
  },
  schema: {
    body: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        guildTierUsers: { type: 'string' },
      },
    },
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
});
