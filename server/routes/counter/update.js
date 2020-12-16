const _ = require('lodash');

module.exports = app => async (req, res) => {
  const counterToUpdate = await app.data.counter.getById(app, req.params.id);

  if (!counterToUpdate) {
    res.status('400').send('Counter does not exist.');
  }

  const updateNeeded = !_.isEqual(
    _.omit(counterToUpdate, [
      'latestVersionId',
      'createdOn',
      'createdBy',
    ]),
    req.body,
  );

  if (updateNeeded) {
    const updatedCounter = await app.data.counter.update(app, counterToUpdate, req.body);

    if (updatedCounter !== 'ok') {
      res.status('400').send('Counter was not updated.');
    }

    res.send('ok');
  }

  res.send('ok');
};
