const _ = require('lodash');

module.exports = app => async (req, res) => {
  try {
    const squadToUpdate = await app.data.squad.getById(app, req.params.id);

    const updateNeeded = !_.isEqual(
      _.omit(squadToUpdate, [
        'toon1Name',
        'toon2Name',
        'toon3Name',
        'toon4Name',
        'toon5Name',
        'latestVersionId',
        'createdOn',
        'createdById',
        'createdByName',
      ]),
      _.omit(req.body, ['userId', 'username']),
    );

    if (updateNeeded) {
      await app.data.squad.update(app, squadToUpdate, req.body);
    } else {
      app.log.warn('Squad update not needed.');
    }

    return res.send('ok');
  } catch (err) {
    res.status(404).send([err.message]);
  }
};
