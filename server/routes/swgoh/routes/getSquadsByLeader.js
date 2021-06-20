const _ = require('lodash');

module.exports = app => ({
  method: 'GET',
  path: '/swgoh/squads/:season',
  handler: async (request, reply) => {
    const { config, data, log } = app;
    const { season } = request.params;

    async function buildSquads(swgohInfo) {
      const allSquads = [];
      async function buildAllSquads() {
        const allCounterSquads = _.uniq(swgohInfo.map(x => JSON.stringify(x.counterSquad)));
        const allOpponentSquads = _.uniq(swgohInfo.map(x => JSON.stringify(x.opponentSquad)));
        allCounterSquads.forEach(x => allSquads.push(x));
        allOpponentSquads.forEach(x => allSquads.push(x));
      }
      await buildAllSquads();
      const allSquadsUnique = _.uniq(allSquads).sort();
      const characters = await data.character.get();

      // eslint-disable-next-line consistent-return
      await Promise.all(allSquadsUnique.map(async unparsedSquad => {
      // creates squads if they don't exist
        const squad = JSON.parse(unparsedSquad);

        const existingSquads = await data.squad.getAllByLeaderId(squad[0]);

        const squadToCheck = [...squad];
        const matchingSquad = existingSquads.find(exSquad => _.isEqual(
          squadToCheck.sort(),
          [
            exSquad.toon1Id,
            exSquad.toon2Id,
            exSquad.toon3Id,
            exSquad.toon4Id,
            exSquad.toon5Id,
          ].sort(),
        ));

        if (_.isEmpty(matchingSquad)) {
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

        const matchingSquadMembers = [
          matchingSquad.toon1Id,
          matchingSquad.toon2Id,
          matchingSquad.toon3Id,
          matchingSquad.toon4Id,
          matchingSquad.toon5Id,
        ];

        const updateNeeded = !_.isEqual(squad, matchingSquadMembers);

        if (updateNeeded) {
          const tmpSquad = [
            {
              id: squad[0],
              name: (characters.find(x => x.id === squad[0])).name,
              prevIndex: '0',
            },
            {
              id: squad[1],
              name: (characters.find(x => x.id === squad[1])).name,
              prevIndex: matchingSquadMembers.indexOf(squad[1]),
            },
            {
              id: squad[2],
              name: (characters.find(x => x.id === squad[2])).name,
              prevIndex: matchingSquadMembers.indexOf(squad[2]),
            },
            {
              id: squad[3],
              name: (characters.find(x => x.id === squad[3])).name,
              prevIndex: matchingSquadMembers.indexOf(squad[3]),
            },
            {
              id: squad[4],
              name: (characters.find(x => x.id === squad[4])).name,
              prevIndex: matchingSquadMembers.indexOf(squad[4]),
            },
          ];

          const squadToUpdate = {
            ...matchingSquad,
            toon1Id: tmpSquad[0].id,
            toon2Id: tmpSquad[1].id,
            toon3Id: tmpSquad[2].id,
            toon4Id: tmpSquad[3].id,
            toon5Id: tmpSquad[4].id,
            toon1Name: tmpSquad[0].name,
            toon2Name: tmpSquad[1].name,
            toon3Name: tmpSquad[2].name,
            toon4Name: tmpSquad[3].name,
            toon5Name: tmpSquad[4].name,
            userId: config.userId,
            username: config.username,
          };

          const response = await data.squad.update(squadToUpdate);

          if (response === 'ok') {
            const squadCounters = await data.counter.getByCounterSquadId(matchingSquad.id);

            if (!_.isEmpty(squadCounters)) {
              await Promise.all(squadCounters.map(async counter => {
                const tmpCounter = {
                  ...counter,
                  isToon2Req: counter[`isToon${tmpSquad[1].prevIndex + 1}Req`],
                  isToon3Req: counter[`isToon${tmpSquad[2].prevIndex + 1}Req`],
                  isToon4Req: counter[`isToon${tmpSquad[3].prevIndex + 1}Req`],
                  isToon5Req: counter[`isToon${tmpSquad[4].prevIndex + 1}Req`],
                  toon2Zetas: counter[`toon${tmpSquad[1].prevIndex + 1}Zetas`],
                  toon3Zetas: counter[`toon${tmpSquad[2].prevIndex + 1}Zetas`],
                  toon4Zetas: counter[`toon${tmpSquad[3].prevIndex + 1}Zetas`],
                  toon5Zetas: counter[`toon${tmpSquad[4].prevIndex + 1}Zetas`],
                  userId: config.userId,
                  username: config.username,
                };

                try {
                  return await data.counter.update(tmpCounter);
                } catch (err) {
                  throw err;
                }
              }));
            }
          }
        }

        log.info(`Squad exists with squadmembers: ${squad}`);
      }));
    }

    const swgohInfo = await data.getSeasonDataFromAws(season);

    if (swgohInfo) {
      await buildSquads(JSON.parse(swgohInfo));
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
