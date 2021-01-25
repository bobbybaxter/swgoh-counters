const fs = require('fs');
const path = require('path');

// NOTE why are we getting these from counters
module.exports = ({ database, log }, type, size) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getStubs.sql')).toString();
  const selector = type === 'normal' ? 'opponentSquadId' : 'counterSquadId';
  const variables = [
    selector,
    size,
    selector,
    selector,
  ];

  return new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { rej(error); }

      const parsedResults = JSON.parse(JSON.stringify(results));
      if (!parsedResults.length) {
        rej(new Error('No squad stubs exist'));
      }

      res(parsedResults);
    });
  }).catch((e) => {
    log.error(e.message);
    throw e;
  });
};
