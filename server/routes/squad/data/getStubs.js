const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => (type, size) => {
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

      if (!results || (results && !results.length)) {
        log.warn('Squad database is empty');
        return res({});
      }

      res(JSON.parse(JSON.stringify(results)));
    });
  }).catch((e) => {
    log.error(e.message);
    throw e;
  });
};
