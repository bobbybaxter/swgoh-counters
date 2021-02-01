module.exports = ({ data }) => ({
  method: 'GET',
  path: '/character/:id',
  handler: async (request, reply) => {
    const character = await data.getById(request.params.id);
    reply.send(character);
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    response: {
      '2xx': {
        id: { type: 'string' },
        name: { type: 'string' },
      },
    },
  },
});
