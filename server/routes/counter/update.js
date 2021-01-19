const _ = require('lodash');

module.exports = app => async (req, res) => {
  const counterToUpdate = await app.data.counter.getById(app, req.params.id);

  if (!counterToUpdate) {
    return res.status('400').send('Counter does not exist.');
  }

  const updateNeeded = !_.isEqual(
    _.omit(counterToUpdate, [
      'latestVersionId',
      'createdOn',
      'createdById',
      'createdByName',
    ]),
    _.omit(req.body, ['userId', 'username']),
  );

  if (updateNeeded) {
    const updatedCounter = await app.data.counter.update(app, counterToUpdate, req.body);

    if (updatedCounter !== 'ok') {
      return res.status('400').send('Counter was not updated.');
    }
  }

  return res.send('ok');
};
