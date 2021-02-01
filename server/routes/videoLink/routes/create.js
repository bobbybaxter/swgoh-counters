module.exports = ({ data, log, server }) => ({
  method: 'POST',
  path: '/videoLink',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const counterToUpdate = await data.counter.getById(request.body.subjectId);
    const newCounter = {
      userId: request.body.userId,
      username: request.body.username,
      ...counterToUpdate,
    };

    try {
      const createdVideoLink = await data.create(request.body);
      await data.counter.update(counterToUpdate, newCounter);
      reply.send(createdVideoLink);
    } catch (e) {
      log.error(e);
      throw new Error(e);
    }
  },
  schema: {
    body: {
      type: 'object',
      properties: {
        subjectId: { type: 'string' },
        title: { type: 'string' },
        link: { type: 'string' },
        userId: { type: 'string' },
        username: { type: 'string' },
      },
      required: [
        'subjectId',
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
