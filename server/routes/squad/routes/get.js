module.exports = ({ data }) => ({
  method: 'GET',
  path: '/squad',
  handler: async (request, reply) => {
    const squads = await data.get();
    squads.sort((a, b) => ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1));
    reply.send(squads);
  },
  schema: {
    response: {
      '2xx': {
        type: 'array',
        items: {
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
  },
});
