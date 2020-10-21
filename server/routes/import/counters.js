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
      description,
    };

    await app.data.counter.create(app, counterToCreate);
  });

  res.send('ok');
};
