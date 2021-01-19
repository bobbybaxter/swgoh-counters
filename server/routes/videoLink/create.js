module.exports = app => async (req, res) => {
  const counterToUpdate = await app.data.counter.getById(app, req.body.subjectId);
  const newCounter = {
    userId: req.body.userId,
    username: req.body.username,
    ...counterToUpdate,
  };
  const createdVideoLink = await app.data.videoLink.create(app, req.body);
  const updatedCounter = await app.data.counter.update(app, counterToUpdate, newCounter);

  if (createdVideoLink || updatedCounter !== 'ok') {
    return res.status('400').send('Video link was not created.');
  }

  return res.send(createdVideoLink);
};
