const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => counterId => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getAvgWinPerc.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, counterId, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn(`CounterStats don't exist for counterId: ${counterId}`);
        return res({});
      }

      return res(JSON.parse(JSON.stringify(results[0])));
    });
  }).catch(e => {
    throw e;
  });
};
