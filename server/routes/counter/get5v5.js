const _ = require('lodash');

// TODO: find a way to incrementally show counters instead of having a huge blast of counters
module.exports = app => async (req, res) => {
  const squadResults = await app.data.squad.getIds(app);
  const squadIds = squadResults.map(x => x.id);

  const countersNormal = await Promise.all(squadIds.map(async (squadId) => {
    let counterVersion;
    const leftSquad = await app.data.squad.getById(app, squadId);
    const rightSquads = await app.data.counter.getCounters(app, squadId, 'normal', '5v5');

    if (!_.isEmpty(rightSquads)) {
      rightSquads.sort((a, b) => ((a.name > b.name) ? 1 : -1));
      counterVersion = rightSquads.reduce((a, b) => (
        (a.counterCreatedOn > b.counterCreatedOn) ? a.counterCreatedOn : b.counterCreatedOn
      ));
    }

    return { counterVersion, leftSquadId: leftSquad.id, rightSquads };
  }));

  const countersReverse = await Promise.all(squadIds.map(async (squadId) => {
    let counterVersion;
    const leftSquad = await app.data.squad.getById(app, squadId);
    const rightSquads = await app.data.counter.getCounters(app, squadId, 'reverse', '5v5');

    if (!_.isEmpty(rightSquads)) {
      rightSquads.sort((a, b) => ((a.name > b.name) ? 1 : -1));
      counterVersion = rightSquads.reduce((a, b) => (
        (a.counterCreatedOn > b.counterCreatedOn) ? a.counterCreatedOn : b.counterCreatedOn
      ));
    }


    return { counterVersion, leftSquadId: leftSquad.id, rightSquads };
  }));

  res.send({
    countersNormal: countersNormal.filter(x => !_.isEmpty(x.rightSquads)),
    countersReverse: countersReverse.filter(x => !_.isEmpty(x.rightSquads)),
  });
};
