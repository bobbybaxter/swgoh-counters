module.exports = app => async function getAllCounters(req, res) {
  const { log } = app;
  log.info('this is in getAllCounters');
  const counters = await app.data.counter.get();
  res.send(counters);
};
