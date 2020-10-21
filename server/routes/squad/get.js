module.exports = app => async (req, res) => {
  const squads = await app.data.squad.get(app);
  squads.sort((a, b) => ((a.name > b.name) ? 1 : -1));
  res.send(squads);
};
