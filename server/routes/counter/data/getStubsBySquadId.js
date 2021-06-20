const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => (id, type, size) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getCounterStubs.sql')).toString();
  let leftSquad, rightSquad;

  if (type === 'normal') {
    rightSquad = 'counterSquadId';
    leftSquad = 'opponentSquadId';
  } else if (type === 'reverse') {
    rightSquad = 'opponentSquadId';
    leftSquad = 'counterSquadId';
  }

  const variables = [
    rightSquad,
    leftSquad,
    id,
    size,
  ];

  return new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn(`Counter stub doesn't exist for ${type} ${size} counter for id: ${id}`);
        return res([]);
      }

      return res(JSON.parse(JSON.stringify(results)));
    });
  }).catch(err => {
    throw err;
  });
};
