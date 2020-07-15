const axios = require('axios');
const buildSquad = require('../../../util/buildSquad');
const buildOpponentTeam = require('../../../util/buildOpponentTeam');
const characters = require('../../../util/characters.json');

const { counterSheet, squadSheet } = require('../../../.config.json');

const buildSquadObjects = (res, squads, squad, size, view) => {
  // get the correct counter info
  const counterInfo = res
    .filter(x => x.battleType === `${size}v${size}`)
    .filter(x => (view === 'normal'
      ? x.opponentTeam === squad.id
      : x.counterTeam === squad.id
    ));

  // get the left side squad
  const leftSideSquad = buildSquad(squad, size, characters.data);

  // get the right side squads
  const rightSideSquads = counterInfo
    .map(matchup => buildOpponentTeam(
      matchup, size, squads, characters.data, view,
    ));

  // put them into an object and push into state
  const squadObject = rightSideSquads.length ? { leftSideSquad, rightSideSquads } : '';
  return squadObject;
};

module.exports = async (app) => {
  const s = await axios.get(squadSheet);
  const c = await axios.get(counterSheet);
  const squads = s.data;
  const counters = c.data;

  const normal5 = [];
  const reverse5 = [];
  const normal3 = [];
  const reverse3 = [];

  squads.forEach((squad) => {
    normal5.push(buildSquadObjects(counters, squads, squad, 5, 'normal'));
    reverse5.push(buildSquadObjects(counters, squads, squad, 5, 'reverse'));
    normal3.push(buildSquadObjects(counters, squads, squad, 3, 'normal'));
    reverse3.push(buildSquadObjects(counters, squads, squad, 3, 'reverse'));
  });

  const countersObject = {
    squads,
    countersNormal5v5: normal5.filter(x => x !== ''),
    countersNormal3v3: normal3.filter(x => x !== ''),
    countersReverse5v5: reverse5.filter(x => x !== ''),
    countersReverse3v3: reverse3.filter(x => x !== ''),
  };

  return countersObject;
};
