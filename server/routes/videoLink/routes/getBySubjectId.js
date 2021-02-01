module.exports = ({ data }) => ({
  method: 'GET',
  path: '/videoLink/subjectId/:subjectId',
  handler: async (request, reply) => {
    const videoLink = await data.getBySubjectId(request.params.subjectId);
    reply.send(videoLink);
  },
  schema: {
    params: {
      subjectId: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'array',
        items: {
          properties: {
            id: { type: 'string' },
            subjectId: { type: 'string' },
            title: { type: 'string' },
            link: { type: 'string' },
            createdOn: { type: 'string' },
            createdById: { type: 'string' },
            createdByName: { type: 'string' },
          },
        },
      },
    },
  },
});
