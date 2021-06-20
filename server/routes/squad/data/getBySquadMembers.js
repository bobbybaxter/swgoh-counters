const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => squadMembers => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getBySquadMembers.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, squadMembers, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn(`Squad doesn't exist with squadmembers: ${squadMembers}`);
        return res({});
      }

      return res(JSON.parse(JSON.stringify(results[0])));
    });
  }).catch(e => {
    throw e;
  });
};
