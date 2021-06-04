// const leaders = require('setup/squadsToShow.json');

module.exports = ({ data }) => ({
  method: 'GET',
  path: '/squad/stubs/:size',
  handler: async (request, reply) => {
    // const leadersNormal = leaders.map(leader => ({
    //   id: leader.id,
    //   name: leader.name,
    // }));
    const leadersNormal = await data.getCounterLeaders('normal', request.params.size); // TODO: get from JSON
    const leadersReverse = await data.getCounterLeaders('reverse', request.params.size); // TODO: make query based on manually selected leaders
    const normal = await data.getStubs('normal', request.params.size);
    // console.log('normal :>> ', normal);
    const reverse = await data.getStubs('reverse', request.params.size);
    // const reverse = [];

    const squadStubs = {
      normal,
      reverse,
      leadersNormal,
      leadersReverse,
    };

    reply
      .type('application/json')
      .send(squadStubs);
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
                toon2Id: { type: 'string' },
                toon3Id: { type: 'string' },
                toon4Id: { type: 'string' },
                toon5Id: { type: 'string' },
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
                toon2Id: { type: 'string' },
                toon3Id: { type: 'string' },
                toon4Id: { type: 'string' },
                toon5Id: { type: 'string' },
                latestCounterVersion: { type: 'string' },
              },
            },
          },
          leadersNormal: {
            type: 'array',
            items: {
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
          leadersReverse: {
            type: 'array',
            items: {
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
});
