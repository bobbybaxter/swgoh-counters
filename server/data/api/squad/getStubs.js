const fs = require('fs');
const path = require('path');

// NOTE why are we getting these from counters
module.exports = async ({ database }, type, size) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getStubs.sql')).toString();
  const selector = type === 'normal' ? 'opponentSquadId' : 'counterSquadId';
  const variables = [
    selector,
    size,
    selector,
    selector,
  ];

  const response = new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { rej(error); }

      const parsedResults = JSON.parse(JSON.stringify(results));
      if (!parsedResults.length) {
        return rej(new Error('No counter versions exist'));
      }

      return res(parsedResults);
    });
  });

  try {
    return await response;
  } catch (err) {
    return new Error(err);
  }
};
