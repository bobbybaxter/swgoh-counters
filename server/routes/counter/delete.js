module.exports = app => async (req, res) => {
  const deletedCounter = await app.data.counter.delete(app, req.params.id);

  if (deletedCounter !== 'ok') {
    res.status('400').send(deletedCounter.toString());
  }

  res.send(deletedCounter);
};
