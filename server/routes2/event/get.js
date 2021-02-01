module.exports = app => async (req, res) => {
  const events = await app.data.event.get(app);
  res.send(events);
};
