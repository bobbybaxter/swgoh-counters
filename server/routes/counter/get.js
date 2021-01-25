module.exports = app => async (req, res) => {
  try {
    const counters = await app.data.counter.get(app);
    res.send(counters);
  } catch (err) {
    res.status(404).send([err.message]);
  }
};
