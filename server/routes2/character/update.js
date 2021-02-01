const _ = require('lodash');

module.exports = app => async (req, res) => {
  if (_.isEmpty(req.body)) {
    const response = 'Character was not updated.  Request body empty.';
    app.log.error(response);
    return res.status(400).send([response]);
  }

  try {
    const characterToUpdate = await app.data.character.getById(app, req.params.id);

    const updateNeeded = !_.isEqual(
      _.omit(characterToUpdate, 'id'),
      req.body,
    );

    if (updateNeeded) {
      await app.data.character.update(
        app,
        characterToUpdate,
        req.body,
      );
    } else {
      app.log.warn('Character update not needed.');
    }

    res.send('ok');
  } catch (err) {
    app.log.error(err);
    res.status(400).send('Character was not updated.');
  }
};
