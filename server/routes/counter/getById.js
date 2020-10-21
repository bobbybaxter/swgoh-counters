module.exports = app => async (req, res) => {
  const counter = await app.data.counter.getById(app, req.params.id);
  // console.log('counter :>> ', counter);

  if (counter instanceof Error) {
    res.status('400').send("Counter doesn't exist.");
  }

  // const leftSquad = await app.data.squad.getById(app, counter.opponentSquadId);
  // const rightSquad = await app.data.squad.getById(app, counter.counterSquadId);

  // res.send({ counter, leftSquad, rightSquad });
  res.send(counter);
};
