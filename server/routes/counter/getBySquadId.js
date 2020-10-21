const _ = require('lodash');

module.exports = app => async (req, res) => {
  const squadId = req.params.id;
  const { view, type } = req.query;

  const rightSquads = await app.data.counter.getCounters(app, squadId, view, type);

  if (_.isEmpty(rightSquads)) {
    res.send(rightSquads);
  } else {
    rightSquads.sort((a, b) => ((a.name > b.name) ? 1 : -1));
    const counterVersion = rightSquads.reduce((a, b) => (
      (a.counterCreatedOn > b.counterCreatedOn) ? a.counterCreatedOn : b.counterCreatedOn
    ));

    res.send({ counterVersion, rightSquads });
  }
};
