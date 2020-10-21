const _ = require('lodash');

module.exports = app => async (req, res) => {
  const squadId = req.params.id;
  const { view, type } = req.query;

  const rightSquadStubs = await app.data.counter.getCounterStubs(app, squadId, view, type);

  if (_.isEmpty(rightSquadStubs)) {
    console.log('rightSquadStubs :>> ', rightSquadStubs);
    res.send(rightSquadStubs);
  } else {
    rightSquadStubs.sort((a, b) => ((a.name > b.name) ? 1 : -1));
    let counterVersion;

    if (rightSquadStubs.length > 1) {
      counterVersion = rightSquadStubs.reduce((a, b) => (
        (a.counterCreatedOn > b.counterCreatedOn) ? a.counterCreatedOn : b.counterCreatedOn
      ));
    } else {
      counterVersion = rightSquadStubs[0].counterCreatedOn;
    }

    res.send({ counterVersion, rightSquadStubs });
  }
};
