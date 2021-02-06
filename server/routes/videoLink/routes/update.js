const _ = require('lodash');

module.exports = ({ data, log, server }) => ({
  method: 'PATCH',
  path: '/videoLink/:id',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const videoLinkToUpdate = await data.getById(request.params.id);

    const updateNeeded = !_.isEqual(
      _.omit(videoLinkToUpdate, [
        'subjectId',
        'createdOn',
        'createdById',
        'createdByName',
      ]),
      _.omit(request.body, ['userId', 'username']),
    );

    if (updateNeeded) {
      const counterToUpdate = await data.counter.getById(videoLinkToUpdate.subjectId);
      const newCounter = {
        userId: request.body.userId,
        username: request.body.username,
        ...counterToUpdate,
      };

      try {
        const response = await data.update(videoLinkToUpdate, request.body);
        await data.counter.update(counterToUpdate, newCounter);
        return reply
          .type('text/html')
          .send(response);
      } catch (err) {
        throw err;
      }
    } else {
      log.warn('VideoLink update not needed.');
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
        title: { type: 'string' },
        link: { type: 'string' },
        userId: { type: 'string' },
        username: { type: 'string' },
      },
      required: [
        'id',
        'title',
        'link',
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
