const axios = require('axios');

const buildSquad = require('../../../util/buildSquad');
const buildOpponentTeam = require('../../../util/buildOpponentTeam');
const characters = require('../../../util/characters.json');

const parseGoogleSheet = require('../../../helpers/parseGoogleSheet');

const { sheetId, apiKey } = require('../../../.config.json');

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

module.exports = async ({ database }) => {
  const unparsedSquads = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Teams?key=${apiKey}`);
  const unparsedCounters = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Counters?key=${apiKey}`);
  const parsedSquads = parseGoogleSheet(unparsedSquads.data.values);
  const parsedCounters = parseGoogleSheet(unparsedCounters.data.values);

  const normal5 = [];
  const reverse5 = [];
  const normal3 = [];
  const reverse3 = [];

  parsedSquads.forEach((squad) => {
    normal5.push(buildSquadObjects(parsedCounters, parsedSquads, squad, 5, 'normal'));
    reverse5.push(buildSquadObjects(parsedCounters, parsedSquads, squad, 5, 'reverse'));
    normal3.push(buildSquadObjects(parsedCounters, parsedSquads, squad, 3, 'normal'));
    reverse3.push(buildSquadObjects(parsedCounters, parsedSquads, squad, 3, 'reverse'));
  });

  return parsedSquads;
};
