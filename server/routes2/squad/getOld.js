module.exports = app => async (req, res) => {
  const squads = await app.data.squad.getOld(app);
  res.send(squads);
};
