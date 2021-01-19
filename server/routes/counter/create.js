module.exports = app => async (req, res) => {
  const createdCounter = await app.data.counter.create(app, req.body);

  if (createdCounter.res !== 'ok') {
    return res.status('400').send('Counter was not created.');
  }

  return res.send(createdCounter.counterId);
};
