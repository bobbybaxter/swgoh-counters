const _ = require('lodash');

module.exports = ({ data }) => ({
  method: 'GET',
  path: '/counter/getStubsBySquadId/:id',
  handler: async (request, reply) => {
    const squadId = request.params.id;
    const { view, type } = request.query;

    const stubs = await data.getStubsBySquadId(squadId, view, type);

    // adds video links to find latest date of update
    const rightSquadStubs = await Promise.all(stubs.map(async (x) => {
      const newX = { ...x };
      const videoLinks = await data.videoLink.getBySubjectId(newX.counterId);
      newX.videoLinks = videoLinks;
      return newX;
    }));

    reply.type('application/json');

    if (!_.isEmpty(rightSquadStubs)) {
      let counterVersion;

      if (rightSquadStubs.length > 1) {
        counterVersion = rightSquadStubs.reduce((a, b) => {
          const aLatestVideoDate = _.max(a.videoLinks.map(x => x.createdOn));
          const bLatestVideoDate = _.max(b.videoLinks.map(x => x.createdOn));
          const aLatestDate = _.max([a.counterCreatedOn, a.squadCreatedOn, aLatestVideoDate]);
          const bLatestDate = _.max([b.counterCreatedOn, b.squadCreatedOn, bLatestVideoDate]);
          return (
            (aLatestDate > bLatestDate) ? a : b
          );
        });

        return reply.send({ counterVersion: counterVersion.counterCreatedOn, rightSquadStubs });
      }

      counterVersion = rightSquadStubs[0].counterCreatedOn;
      return reply.send({ counterVersion, rightSquadStubs });
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
                name: { type: 'string' },
                counterId: { type: 'string' },
                isHardCounter: { type: 'boolean' },
                toon1Id: { type: 'string' },
                counterCreatedOn: { type: 'string' },
                counterCreatedById: { type: 'string' },
                counterCreatedByName: { type: 'string' },
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
