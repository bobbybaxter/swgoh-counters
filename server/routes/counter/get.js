module.exports = app => async (req, res) => {
  const counters = await app.data.counter.get(app);
  res.send(counters);
};
