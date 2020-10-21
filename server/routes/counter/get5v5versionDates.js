module.exports = app => async (req, res) => {
  const versionDatesNormal = await app.data.counter.getVersionDates(app, 'normal', '5v5');
  const versionDatesReverse = await app.data.counter.getVersionDates(app, 'reverse', '5v5');
  res.send({ versionDatesNormal, versionDatesReverse });
};
