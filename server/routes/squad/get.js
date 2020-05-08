module.exports = app => async function getAllSquads(req, res) {
  const squads = await app.data.squad.get();
  res.send(squads);
};
