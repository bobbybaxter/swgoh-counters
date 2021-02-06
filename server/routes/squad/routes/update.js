const _ = require('lodash');

module.exports = ({ data, log, server }) => ({
  method: 'PATCH',
  path: '/squad/:id',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const squadToUpdate = await data.getById(request.params.id);

    const updateNeeded = !_.isEqual(
      _.omit(squadToUpdate, [
        'toon1Name',
        'toon2Name',
        'toon3Name',
        'toon4Name',
        'toon5Name',
        'latestVersionId',
        'createdOn',
        'createdById',
        'createdByName',
      ]),
      _.omit(request.body, ['userId', 'username']),
    );

    if (updateNeeded) {
      await data.update(squadToUpdate, request.body);
    } else {
      log.warn('Squad update not needed.');
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
        name: { type: 'string' },
        description: { type: 'string' },
        generalStrategy: { type: 'string' },
        toon1Id: { type: 'string' },
        toon2Id: { type: 'string' },
        toon3Id: { type: 'string' },
        toon4Id: { type: 'string' },
        toon5Id: { type: 'string' },
        userId: { type: 'string' },
        username: { type: 'string' },
      },
      required: [
        'id',
        'name',
        'description',
        'generalStrategy',
        'toon1Id',
        'toon2Id',
        'toon3Id',
        'toon4Id',
        'toon5Id',
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
