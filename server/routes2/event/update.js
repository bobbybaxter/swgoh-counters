module.exports = app => async (req, res) => {
  const updatedEvent = await app.data.event.update(app, req.params.id, req.body);

  if (updatedEvent !== 'ok') {
    res.status('400').send('Event was not updated.');
  }

  res.send(updatedEvent);
};
