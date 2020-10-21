module.exports = app => async (req, res) => {
  const updatedCounter = await app.data.counter.update(app, req.params.id, req.body);

  if (updatedCounter !== 'ok') {
    res.status('400').send('Counter was not updated.');
  }

  res.send(updatedCounter);
};
