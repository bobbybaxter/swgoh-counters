module.exports = ({ data }) => ({
  method: 'GET',
  path: '/squad/versionDate',
  handler: async (request, reply) => {
    const versionDate = await data.getVersionDate();
    reply.send(versionDate);
  },
  response: {
    '2xx': {
      type: 'object',
      properties: {
        lateUpdate: { type: 'string' },
      },
    },
  },
});
