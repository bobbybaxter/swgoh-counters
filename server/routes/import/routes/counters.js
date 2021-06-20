const { userId, username } = require('.config.json');

module.exports = ({ data, log }) => ({
  method: 'GET',
  path: '/import/counters',
  handler: async (request, reply) => {
    const oldSquads = await data.squad.getOld();
    const counters = await data.counter.getOld();
    const newSquads = await data.squad.get();

    await Promise.all(counters.map(async (counter) => {
      const {
        battleType,
        counterTeam,
        description,
        isHardCounter,
        opponentTeam,
        video,
      } = counter;

      // maps new nanoids based on team names
      const matchedCounterTeam = oldSquads.find(x => x.id === counterTeam);
      const newCounterTeam = newSquads.find(x => x.name === matchedCounterTeam.name);
      const matchedOpponentTeam = oldSquads.find(x => x.id === opponentTeam);
      const newOpponentTeam = newSquads.find(x => x.name === matchedOpponentTeam.name);

      const counterToCreate = {
        opponentSquadId: newOpponentTeam.id,
        counterSquadId: newCounterTeam.id,
        isHardCounter,
        battleType,
        counterStrategy: description,
        isToon2Req: false,
        isToon3Req: false,
        isToon4Req: false,
        isToon5Req: false,
        toon1Zetas: '',
        toon2Zetas: '',
        toon3Zetas: '',
        toon4Zetas: '',
        toon5Zetas: '',
        userId,
        username,
      };

      const counterId = await data.counter.create(counterToCreate);

      if (video) {
        const videoToCreate = {
          subjectId: counterId,
          title: 'title',
          link: video,
          userId,
          username,
        };

        try {
          await data.videoLink.create(videoToCreate);
        } catch (err) {
          throw new Error(err);
        }
      }
    }));

    log.info('counter import complete');
    reply.send('ok');
  },
});
