module.exports = ({ data }) => ({
  method: 'POST',
  path: '/squad',
  handler: async (request, reply) => {
    const createdSquadId = await data.create(request.body);
    reply.send(createdSquadId);
  },
  schema: {
    body: {
      type: 'object',
      properties: {
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
