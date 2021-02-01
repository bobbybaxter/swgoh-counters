module.exports = ({ data }) => ({
  method: 'GET',
  path: '/videoLink/:id',
  handler: async (request, reply) => {
    const videoLink = await data.getById(request.params.id);
    reply.send(videoLink);
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          id: { type: 'string' },
          subjectId: { type: 'string' },
          link: { type: 'string' },
          title: { type: 'string' },
          createdOn: { type: 'string' },
          createdById: { type: 'string' },
          createdByName: { type: 'string' },
        },
      },
    },
  },
});
