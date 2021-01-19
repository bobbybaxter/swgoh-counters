const _ = require('lodash');

module.exports = app => async (req, res) => {
  const squadId = req.params.id;
  const { view, type } = req.query;

  const stubs = await app.data.counter.getCounterStubs(app, squadId, view, type);

  // adds video links to find latest date of update
  const rightSquadStubs = await Promise.all(stubs.map(async (x) => {
    const newX = { ...x };
    const videoLinks = await app.data.videoLink.getBySubjectId(app, newX.counterId);
    newX.videoLinks = videoLinks;
    return newX;
  }));

  if (!_.isEmpty(rightSquadStubs)) {
    // REVIEW: we may want to change this to sorting by name
    //  but for now we're sorting by date created/updated so the freshest
    //  counters are at the front of the line
    rightSquadStubs.sort((a, b) => ((a.counterCreatedOn < b.counterCreatedOn) ? 1 : -1));
    let counterVersion;

    if (rightSquadStubs.length > 1) {
      counterVersion = rightSquadStubs.reduce((a, b) => {
        const aLatestVideoDate = _.max(a.videoLinks.map(x => x.createdOn));
        const bLatestVideoDate = _.max(b.videoLinks.map(x => x.createdOn));
        const aLatestDate = _.max([a.counterCreatedOn, a.squadCreatedOn, aLatestVideoDate]);
        const bLatestDate = _.max([b.counterCreatedOn, b.squadCreatedOn, bLatestVideoDate]);
        return (
          (aLatestDate > bLatestDate) ? a : b
        );
      });

      return res.send({ counterVersion: counterVersion.counterCreatedOn, rightSquadStubs });
    }

    counterVersion = rightSquadStubs[0].counterCreatedOn;
    return res.send({ counterVersion, rightSquadStubs });
  }

  return res.send(rightSquadStubs);
};
