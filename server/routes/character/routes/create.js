module.exports = ({ data, server }) => ({
  method: 'POST',
  path: '/character',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const response = await data.create(request.body);
    reply.send(response);
  },
  schema: {
    body: {
      type: 'object',
      required: ['id', 'name'],
      properties: {
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
      },
    },
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
});
