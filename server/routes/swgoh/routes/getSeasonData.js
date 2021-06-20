module.exports = app => ({
  method: 'GET',
  path: '/swgoh/counters/SeasonData/:season',
  handler: async (request, reply) => {
    const { data } = app;
    const { season } = request.params;

    const leaderIds = await data.firebase.getSeasonRoster(season);

    const swgohInfo = await data.getSeasonData({ leaderIds, season });

    return JSON.stringify(swgohInfo);
  },
  schema: {
    params: {
      season: { type: 'integer' },
    },
    response: {
      '2xx': { type: 'string' },
    },
  },
});
