const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => leaderId => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getAllByLeaderId.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, leaderId, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn(`Squad doesn't exist for leaderId: ${leaderId}`);
        return res([]);
      }

      return res(JSON.parse(JSON.stringify(results)));
    });
  }).catch(e => {
    throw e;
  });
};
