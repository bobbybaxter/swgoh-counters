module.exports = ({ data, log, server }) => ({
  method: 'DELETE',
  path: '/videoLink/:id',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const counterToUpdate = await data.counter.getById(request.body.subjectId);
    const newCounter = {
      userId: request.body.userId,
      username: request.body.username,
      ...counterToUpdate,
    };

    try {
      const deletedVideoLink = await data.delete(request.params.id);
      await data.counter.update(newCounter);
      reply
        .type('text/html')
        .send(deletedVideoLink);
    } catch (err) {
      throw err;
    }
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    body: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        subjectId: { type: 'string' },
        userId: { type: 'string' },
        username: { type: 'string' },
      },
      required: [
        'id',
        'subjectId',
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
