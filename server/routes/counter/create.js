module.exports = app => async (req, res) => {
  try {
    const createdCounter = await app.data.counter.create(app, req.body);
    return res.send(createdCounter.counterId);
  } catch (err) {
    res.status(404).send([err.message]);
  }
};
