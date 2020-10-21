module.exports = app => async (req, res) => {
  const counters = await app.data.counter.getOld(app);
  res.send(counters);
};
