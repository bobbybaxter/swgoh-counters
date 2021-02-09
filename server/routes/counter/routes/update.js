const _ = require('lodash');

module.exports = ({ data, log, server }) => ({
  method: 'PATCH',
  path: '/counter/:id',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const counterToUpdate = await data.getById(request.params.id);
    counterToUpdate.isHardCounter = counterToUpdate.isHardCounter === 1;
    counterToUpdate.isToon2Req = counterToUpdate.isToon2Req === 1;
    counterToUpdate.isToon3Req = counterToUpdate.isToon3Req === 1;
    counterToUpdate.isToon4Req = counterToUpdate.isToon4Req === 1;
    counterToUpdate.isToon5Req = counterToUpdate.isToon5Req === 1;

    const updateNeeded = !_.isEqual(
      _.omit(counterToUpdate, [
        'latestVersionId',
        'createdOn',
        'createdById',
        'createdByName',
      ]),
      _.omit(request.body, ['userId', 'username']),
    );

    if (updateNeeded) {
      await data.update(counterToUpdate, request.body);
    } else {
      log.warn('Counter update not needed.');
    }

    return reply
      .type('text/html')
      .send('ok');
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    body: {
      type: 'object',
      properties: {
        id: { type: 'string' },
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
        'id',
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
