module.exports = app => async (req, res) => {
  const createdEvent = await app.data.event.create(app, req.body);

  if (createdEvent !== 'ok') {
    res.status('400').send('Event was not created.');
  }

  res.send(createdEvent);
};
