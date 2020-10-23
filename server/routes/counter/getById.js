module.exports = app => async (req, res) => {
  const counter = await app.data.counter.getById(app, req.params.id);

  if (counter instanceof Error) {
    res.status('400').send("Counter doesn't exist.");
  }

  res.send(counter);
};
