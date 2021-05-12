const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => (type, size) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getCounterLeaders.sql')).toString();
  const squadSelector = type === 'normal' ? 'counterSquadId' : 'opponentSquadId';
  const variables = [
    squadSelector,
    size,
  ];

  return new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn('Squad database is empty');
        return res({});
      }

      return res(JSON.parse(JSON.stringify(results)));
    });
  }).catch((err) => {
    throw err;
  });
};
