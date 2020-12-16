const _ = require('lodash');

module.exports = app => async (req, res) => {
  const squadToUpdate = await app.data.squad.getById(app, req.params.id);

  if (!squadToUpdate) {
    res.status('400').send('Squad does not exist.');
  }

  const updateNeeded = !_.isEqual(
    _.omit(squadToUpdate, [
      'toon1Name',
      'toon2Name',
      'toon3Name',
      'toon4Name',
      'toon5Name',
      'latestVersionId',
      'createdOn',
      'createdBy',
    ]),
    req.body,
  );

  if (updateNeeded) {
    const updatedSquad = await app.data.squad.update(app, squadToUpdate, req.body);

    if (updatedSquad !== 'ok') {
      res.status('400').send('Squad was not updated.');
    }

    res.send('ok');
  }

  res.send('ok');
};
