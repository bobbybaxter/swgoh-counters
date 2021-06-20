const _ = require('lodash');

module.exports = ({ data, log, server }) => ({
  method: 'PATCH',
  path: '/character/:id',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const characterToUpdate = await data.getById(request.params.id);

    const updateNeeded = !_.isEqual(
      _.omit(characterToUpdate, 'id'),
      request.body,
    );

    if (updateNeeded) {
      await data.update(characterToUpdate);
    } else {
      log.warn('Character update not needed.');
    }

    reply.send('ok');
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
      },
    },
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
});
