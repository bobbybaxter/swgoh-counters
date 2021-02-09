const _ = require('lodash');

module.exports = ({ data }) => ({
  method: 'GET',
  path: '/counter/:id',
  handler: async (request, reply) => {
    let formattedCounter = {};
    const counter = await data.getById(request.params.id);

    const videoLinks = await data.videoLink.getBySubjectId(request.params.id);

    if (!_.isEmpty(counter)) {
      formattedCounter = {
        ...counter,
        toon1Zetas: counter.toon1Zetas ? counter.toon1Zetas.split(',') : [],
        toon2Zetas: counter.toon2Zetas ? counter.toon2Zetas.split(',') : [],
        toon3Zetas: counter.toon3Zetas ? counter.toon3Zetas.split(',') : [],
        toon4Zetas: counter.toon4Zetas ? counter.toon4Zetas.split(',') : [],
        toon5Zetas: counter.toon5Zetas ? counter.toon5Zetas.split(',') : [],
        videoLinks,
      };
    }

    reply
      .type('application/json')
      .send(formattedCounter);
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'object',
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
          createdOn: { type: 'string' },
          createdById: { type: 'string' },
          createdByName: { type: 'string' },
          videoLinks: { type: 'array' },
        },
      },
    },
  },
});
