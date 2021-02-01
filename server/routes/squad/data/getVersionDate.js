const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => () => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getVersionDate.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn('Squad database is empty');
        return res({});
      }

      res(JSON.parse(JSON.stringify(results[0])));
    });
  }).catch((e) => {
    log.error(e.message);
    throw e;
  });
};
