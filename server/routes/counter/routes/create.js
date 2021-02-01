module.exports = ({ data, server }) => ({
  method: 'POST',
  path: '/counter',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const createdCounterId = await data.create(request.body);
    reply.send(createdCounterId);
  },
  schema: {
    body: {
      type: 'object',
      properties: {
        opponentSquadId: { type: 'string' },
        counterSquadId: { type: 'string' },
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
        userId: { type: 'string' },
        username: { type: 'string' },
      },
      required: [
        'opponentSquadId',
        'counterSquadId',
        'isHardCounter',
        'battleType',
        'counterStrategy',
        'isToon2Req',
        'isToon3Req',
        'isToon4Req',
        'isToon5Req',
        'toon1Zetas',
        'toon2Zetas',
        'toon3Zetas',
        'toon4Zetas',
        'toon5Zetas',
        'userId',
        'username',
      ],
    },
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
});
