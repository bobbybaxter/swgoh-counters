const { userId, username } = require('../../.config.json');

module.exports = app => async (req, res) => {
  const oldSquads = await app.data.squad.getOld(app);
  const counters = await app.data.counter.getOld(app);
  const newSquads = await app.data.squad.get(app);

  counters.forEach(async (counter) => {
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
      isHardCounter: isHardCounter === true ? 1 : 0,
      battleType,
      counterStrategy: description,
      isToon2Req: 0,
      isToon3Req: 0,
      isToon4Req: 0,
      isToon5Req: 0,
      toon1Zetas: '',
      toon2Zetas: '',
      toon3Zetas: '',
      toon4Zetas: '',
      toon5Zetas: '',
      userId,
      username,
    };

    const counterResponse = await app.data.counter.create(app, counterToCreate);

    if (video) {
      const videoToCreate = {
        subjectId: counterResponse.counterId,
        title: 'title',
        link: video,
        userId,
        username,
      };

      try {
        await app.data.videoLink.create(app, videoToCreate);
      } catch (err) {
        throw new Error(err);
      }
    }
  });

  console.info('counter import complete');
  res.send('ok');
};
