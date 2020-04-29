module.exports = app => async function get(res) {
  const counters = await app.data.counter.get();
  res.send(counters);
};
