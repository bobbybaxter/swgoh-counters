module.exports = app => async function getAllCounters(req, res) {
  const counters = await app.data.counter.get();
  res.send(counters);
};
