module.exports = app => async (req, res) => {
  const event = await app.data.event.getById(app, req.params.id);

  if (event instanceof Error) {
    res.status('400').send("Event doesn't exist.");
  }

  res.send(event);
};
