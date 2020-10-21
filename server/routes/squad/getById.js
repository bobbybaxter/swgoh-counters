module.exports = app => async (req, res) => {
  const squad = await app.data.squad.getById(app, req.params.id);

  if (squad instanceof Error) {
    res.status('400').send("Squad doesn't exist.");
  }

  res.send(squad);
};
