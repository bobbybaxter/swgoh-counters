const fs = require('fs');
const path = require('path');

module.exports = async ({ database }, id, type, size) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getCounters.sql')).toString();
  let leftSquad;
  let rightSquad;

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

  const response = new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { rej(error); }

      const parsedResults = JSON.parse(JSON.stringify(results));
      if (!parsedResults.length) {
        return rej(new Error("Counters don't exist"));
      }

      return res(parsedResults);
    });
  });

  try {
    return await response;
  } catch (err) {
    return [];
  }
};
