module.exports = ({ data }) => ({
  method: 'GET',
  path: '/counter/variations',
  handler: async (request, reply) => {
    const { opponentLeaderId, counterLeaderId, size } = request.query;
    const response = await data.getVariations([
      size,
      opponentLeaderId,
      counterLeaderId,
    ]);

    function sanitizeName(x) {
      return x.replace(/"/g, "'");
    }

    const variations = response.map(x => ({
      ...x,
      opponentSquad: JSON.parse(x.opponentSquad.replace(/"Cody"|"Echo"|"Fives"|"Rex"|"Zeb"/g, name => sanitizeName(name))),
      counterSquad: JSON.parse(x.counterSquad.replace(/"Cody"|"Echo"|"Fives"|"Rex"|"Zeb"/g, name => sanitizeName(name))),
    }));

    reply
      .type('application/json')
      .send(variations);
  },
  schema: {
    query: {
      opponentLeaderId: { type: 'string' },
      counterLeaderId: { type: 'string' },
      size: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            totalSeen: { type: 'integer' },
            avgWin: { type: 'number' },
            opponentSquad: { type: 'array' },
            counterSquad: { type: 'array' },
          },
        },
      },
    },
  },
});
