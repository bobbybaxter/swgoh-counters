const _ = require('lodash');

module.exports = ({ data }) => ({
  method: 'GET',
  path: '/counter/getStubsBySquadId/:id',
  handler: async (request, reply) => {
    const leaderId = request.params.id;
    const { view, type } = request.query;

    const stubs = await data.getStubsBySquadId(leaderId, view, type);
    const latestDate = await data.getLatestCounterVersion(leaderId, view, type);

    // adds video links to find latest date of update
    const rightSquadStubs = await Promise.all(stubs.map(async (x) => {
      const newX = { ...x };
      const videoLinks = await data.videoLink.getBySubjectId(newX.id);
      newX.videoLinks = videoLinks;
      newX.toon1Zetas = newX.toon1Zetas ? newX.toon1Zetas.split(',') : [];
      newX.toon2Zetas = newX.toon2Zetas ? newX.toon2Zetas.split(',') : [];
      newX.toon3Zetas = newX.toon3Zetas ? newX.toon3Zetas.split(',') : [];
      newX.toon4Zetas = newX.toon4Zetas ? newX.toon4Zetas.split(',') : [];
      newX.toon5Zetas = newX.toon5Zetas ? newX.toon5Zetas.split(',') : [];

      return newX;
    }));

    reply.type('application/json');

    if (!_.isEmpty(rightSquadStubs)) {
      return reply.send({ counterVersion: latestDate.counterVersion, rightSquadStubs });
    }

    return reply.send({ rightSquadStubs });
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    queryStrings: {
      view: { type: 'string' },
      type: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          counterVersion: { type: 'string' },
          rightSquadStubs: {
            type: 'array',
            items: {
              properties: {
                id: { type: 'string' },
                opponentSquadId: { type: 'string' },
                counterSquadId: { type: 'string' },
                latestVersionId: { type: 'string' },
                isHardCounter: { type: 'boolean' },
                battleType: { type: 'string' },
                counterStrategy: { type: 'string' },
                isToon2Req: { type: 'boolean' },
                isToon3Req: { type: 'boolean' },
                isToon4Req: { type: 'boolean' },
                isToon5Req: { type: 'boolean' },
                toon1Zetas: { type: 'array' },
                toon2Zetas: { type: 'array' },
                toon3Zetas: { type: 'array' },
                toon4Zetas: { type: 'array' },
                toon5Zetas: { type: 'array' },
                counterCreatedOn: { type: 'string' },
                counterCreatedById: { type: 'string' },
                counterCreatedByName: { type: 'string' },
                name: { type: 'string' },
                toon1Id: { type: 'string' },
                squadCreatedOn: { type: 'string' },
                squadCreatedById: { type: 'string' },
                squadCreatedByName: { type: 'string' },
                videoLinks: { type: 'array' },
              },
            },
          },
        },
      },
    },
  },
});
