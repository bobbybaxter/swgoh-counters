module.exports = app => async function getAllSquads(req, res) {
  const { log } = app;
  log.info('this is in getAllSquads');
  const squads = await app.data.squad.get();
  res.send(squads);
};
