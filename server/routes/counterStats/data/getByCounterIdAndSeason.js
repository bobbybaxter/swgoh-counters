const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => ({ counterId, season }) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getByCounterIdAndSeason.sql')).toString();

  const variables = [
    counterId,
    season,
  ];

  return new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn(`CounterStats don't exist for counterId: ${counterId}`);
        return res({});
      }

      return res(JSON.parse(JSON.stringify(results[0])));
    });
  }).catch(err => {
    throw err;
  });
};
