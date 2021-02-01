module.exports = ({ data }) => ({
  method: 'GET',
  path: '/counter',
  handler: async (request, reply) => {
    const counters = await data.get();
    reply.send(counters);
  },
  schema: {
    response: {
      '2xx': {
        type: 'array',
        items: {
          properties: {
            id: { type: 'string' },
            opponentSquadId: { type: 'string' },
            counterSquadId: { type: 'string' },
            latestVersionId: { type: 'string' },
            isHardCounter: { type: 'boolean' },
            battleType: { type: 'string' },
            counterStrategy: { type: 'string' },
            isToon2Req: { type: 'boolean' },
            isToon3Req: { type: 'boolean' },
            isToon4Req: { type: 'boolean' },
            isToon5Req: { type: 'boolean' },
            toon1Zetas: { type: 'string' },
            toon2Zetas: { type: 'string' },
            toon3Zetas: { type: 'string' },
            toon4Zetas: { type: 'string' },
            toon5Zetas: { type: 'string' },
            createdOn: { type: 'string' },
            createdById: { type: 'string' },
            createdByName: { type: 'string' },
          },
        },
      },
    },
  },
});
