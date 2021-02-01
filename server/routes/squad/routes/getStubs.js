module.exports = ({ data }) => ({
  method: 'GET',
  path: '/squad/stubs/:size',
  handler: async (request, reply) => {
    const normal = await data.getStubs('normal', request.params.size);
    const reverse = await data.getStubs('reverse', request.params.size);

    const squadStubs = {
      normal,
      reverse,
    };

    reply.send(squadStubs);
  },
  schema: {
    params: {
      size: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          normal: {
            type: 'array',
            items: {
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                toon1Id: { type: 'string' },
                latestCounterVersion: { type: 'string' },
              },
            },
          },
          reverse: {
            type: 'array',
            items: {
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                toon1Id: { type: 'string' },
                latestCounterVersion: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
});
