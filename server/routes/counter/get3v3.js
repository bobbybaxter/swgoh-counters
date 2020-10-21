const _ = require('lodash');

module.exports = app => async (req, res) => {
  const squadResults = await app.data.squad.getIds(app);
  const squadIds = squadResults.map(x => x.id);

  const countersNormal = await Promise.all(squadIds.map(async (squadId) => {
    const leftSquad = await app.data.squad.getById(app, squadId);
    const rightSquads = await app.data.counter.getCounters(app, squadId, 'normal', '3v3');
    rightSquads.sort((a, b) => ((a.name > b.name) ? 1 : -1));
    return { leftSquad, rightSquads };
  }));

  const countersReverse = await Promise.all(squadIds.map(async (squadId) => {
    const leftSquad = await app.data.squad.getById(app, squadId);
    const rightSquads = await app.data.counter.getCounters(app, squadId, 'reverse', '3v3');
    rightSquads.sort((a, b) => ((a.name > b.name) ? 1 : -1));
    return { leftSquad, rightSquads };
  }));

  countersNormal.sort((a, b) => ((a.leftSquad.name > b.leftSquad.name) ? 1 : -1));
  countersReverse.sort((a, b) => ((a.leftSquad.name > b.leftSquad.name) ? 1 : -1));

  res.send({
    countersNormal: countersNormal.filter(x => !_.isEmpty(x.rightSquads)),
    countersReverse: countersReverse.filter(x => !_.isEmpty(x.rightSquads)),
  });
};
