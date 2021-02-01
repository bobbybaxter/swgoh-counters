module.exports = ({ data }) => ({
  method: 'GET',
  path: '/squad/:id',
  handler: async (request, reply) => {
    const squad = await data.getById(request.params.id);
    reply.send(squad);
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
          name: { type: 'string' },
          toon1Id: { type: 'string' },
          toon1Name: { type: 'string' },
          toon2Id: { type: 'string' },
          toon2Name: { type: 'string' },
          toon3Id: { type: 'string' },
          toon3Name: { type: 'string' },
          toon4Id: { type: 'string' },
          toon4Name: { type: 'string' },
          toon5Id: { type: 'string' },
          toon5Name: { type: 'string' },
          description: { type: 'string' },
          generalStrategy: { type: 'string' },
          latestVersionId: { type: 'string' },
          createdOn: { type: 'string' },
          createdById: { type: 'string' },
          createdByName: { type: 'string' },
        },
      },
    },
  },
});
