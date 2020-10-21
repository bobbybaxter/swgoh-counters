module.exports = app => async (req, res) => {
  const versionDates = await app.data.counter.get3v3versionDates(app);
  res.send(versionDates);
};
