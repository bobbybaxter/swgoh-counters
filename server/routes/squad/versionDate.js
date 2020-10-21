module.exports = app => async (req, res) => {
  const versionDate = await app.data.squad.getVersionDate(app);
  res.send(versionDate);
};
