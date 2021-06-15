const _ = require('lodash');

module.exports = app => ({
  method: 'GET',
  path: '/swgoh/squads/:season',
  handler: async (request, reply) => {
    const { config, data, log } = app;
    const { season } = request.params;
    const leaderIds = await data.firebase.getSeasonRoster(season);

    const swgohInfo = await data.getSeasonData({ leaderIds, season });

    async function buildSquads() {
      const allSquads = [];
      async function buildAllSquads() {
        const allCounterSquads = _.uniq(swgohInfo.map(x => JSON.stringify(x.counterSquad)));
        const allOpponentSquads = _.uniq(swgohInfo.map(x => JSON.stringify(x.opponentSquad)));
        allCounterSquads.forEach(x => allSquads.push(x));
        allOpponentSquads.forEach(x => allSquads.push(x));
      }
      await buildAllSquads();
      const allSquadsUnique = _.uniq(allSquads).sort();

      Promise.all(allSquadsUnique.map(async unparsedSquad => {
      // creates squads if they don't exist
        const squad = JSON.parse(unparsedSquad);
        const existingSquad = await data.squad.getBySquadMembers(squad);

        if (_.isEmpty(existingSquad)) {
          const squadToCreate = {
            name: '',
            description: '',
            generalStrategy: '',
            toon1Id: squad[0],
            toon2Id: squad[1],
            toon3Id: squad[2],
            toon4Id: squad[3],
            toon5Id: squad[4],
            userId: config.userId,
            username: config.username,
          };

          try {
            return await data.squad.create(squadToCreate);
          } catch (err) {
            throw err;
          }
        }

        return log.info(`Squad exists with squadmembers: ${squad}`);
      }));
    }

    if (swgohInfo) {
      await buildSquads();
    }

    reply.send('ok');
  },
  schema: {
    params: {
      season: { type: 'string' },
    },
    response: {
      '2xx': { type: 'string' },
    },
  },
});
