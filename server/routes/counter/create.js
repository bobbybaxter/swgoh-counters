module.exports = app => async (req, res) => {
  const createdCounter = await app.data.counter.create(app, req.body);

  if (createdCounter !== 'ok') {
    res.status('400').send('Counter was not created.');
  }

  res.send(createdCounter);
};
