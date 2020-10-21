module.exports = app => async (req, res) => {
  const deletedEvent = await app.data.event.delete(app, req.params.id);

  if (deletedEvent !== 'ok') {
    res.status('400').send(deletedEvent.toString());
  }

  res.send(deletedEvent);
};
