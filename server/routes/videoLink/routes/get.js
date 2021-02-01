module.exports = ({ data }) => ({
  method: 'GET',
  path: '/videoLink',
  handler: async (request, reply) => {
    const videoLinks = await data.get();
    videoLinks.sort((a, b) => ((a.createdOn > b.createdOn) ? 1 : -1));
    reply.send(videoLinks);
  },
  schema: {
    response: {
      '2xx': {
        type: 'array',
        items: {
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
  },
});
