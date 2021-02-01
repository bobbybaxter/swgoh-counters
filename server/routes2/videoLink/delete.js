module.exports = app => async (req, res) => {
  const counterToUpdate = await app.data.counter.getById(app, req.body.subjectId);
  const newCounter = {
    userId: req.body.userId,
    username: req.body.username,
    ...counterToUpdate,
  };
  const deletedVideoLink = await app.data.videoLink.delete(app, req.params.id);
  const updatedCounter = await app.data.counter.update(app, counterToUpdate, newCounter);

  if (deletedVideoLink || updatedCounter !== 'ok') {
    return res.status('400').send(deletedVideoLink.toString());
  }

  return res.send(deletedVideoLink);
};
