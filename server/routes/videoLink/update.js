const _ = require('lodash');

module.exports = app => async (req, res) => {
  const videoLinkToUpdate = await app.data.videoLink.getById(app, req.params.id);

  if (!videoLinkToUpdate) {
    return res.status('400').send('Video link does not exist.');
  }

  const updateNeeded = !_.isEqual(
    _.omit(videoLinkToUpdate, [
      'subjectId',
      'createdOn',
      'createdById',
      'createdByName',
    ]),
    _.omit(req.body, ['userId', 'username']),
  );

  if (updateNeeded) {
    const counterToUpdate = await app.data.counter.getById(app, videoLinkToUpdate.subjectId);
    const newCounter = {
      userId: req.body.userId,
      username: req.body.username,
      ...counterToUpdate,
    };
    const updatedVideoLink = await app.data.videoLink.update(app, videoLinkToUpdate, req.body);
    const updatedCounter = await app.data.counter.update(app, counterToUpdate, newCounter);

    if (updatedVideoLink || updatedCounter !== 'ok') {
      return res.status('400').send('Video link was not updated.');
    }
  }

  return res.send('ok');
};
